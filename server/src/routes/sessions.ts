// All routes of the Scrum Poker backend. The server is complete:
//   - list, create, get and delete sessions
//   - add (join) and remove (leave) participants
//   - pick a card, reveal / new round, switch deck
// The README lists all routes.

import { Router } from 'express'
import type { Request, Response } from 'express'
import {
  addParticipant,
  clearVotes,
  createSession,
  deleteSession,
  findParticipant,
  findParticipantByName,
  findSession,
  listSessions,
  removeParticipant,
} from '../store.ts'
import { DECKS, isDeckId } from '../decks.ts'
import { toParticipantView, toSessionSummary, toSessionView } from '../views.ts'
import type {
  ErrorResponse,
  ParticipantView,
  SessionSummary,
  SessionView,
} from '../types.ts'

export const sessionsRouter = Router()

// Express reads path parameters as strings (Express 5 types them that way).
// These params types tell TypeScript which parameters a route has.
interface SessionParams {
  sessionId: string
}

interface ParticipantParams extends SessionParams {
  participantId: string
}

// All sessions as a summary (ID + participant count) for the home page.
sessionsRouter.get(
  '/sessions',
  (_req: Request, res: Response<SessionSummary[]>) => {
    const sessions = listSessions()
    const summaries = sessions.map(toSessionSummary)
    res.status(200).json(summaries)
  },
)

// Create a new session. Body: { "name": "Sprint 12" }.
// The server generates the ID, not the client.
sessionsRouter.post(
  '/sessions',
  (req: Request, res: Response<SessionView | ErrorResponse>) => {
    const rawName = readField(req.body, 'name')
    if (rawName === undefined) {
      res.status(400).json({ error: 'The name is missing.' })
      return
    }
    if (typeof rawName !== 'string') {
      res.status(400).json({ error: 'The name must be a string.' })
      return
    }
    const name = rawName.trim()
    if (name === '') {
      res.status(400).json({ error: 'The name must not be empty.' })
      return
    }

    const session = createSession(name)
    const view = toSessionView(session)
    res.status(201).json(view)
  },
)

// Get one session. The frontend requests this regularly (polling).
sessionsRouter.get(
  '/sessions/:sessionId',
  (req: Request<SessionParams>, res: Response<SessionView | ErrorResponse>) => {
    const session = findSession(req.params.sessionId)
    if (!session) {
      res.status(404).json({ error: 'Session not found.' })
      return
    }
    const view = toSessionView(session)
    res.status(200).json(view)
  },
)

// Delete a session, even if participants are still in it.
// 204 = success without a response body.
sessionsRouter.delete(
  '/sessions/:sessionId',
  // On success (204) there is no body, so only the error type appears.
  (req: Request<SessionParams>, res: Response<ErrorResponse>) => {
    const wasDeleted = deleteSession(req.params.sessionId)
    if (!wasDeleted) {
      res.status(404).json({ error: 'Session not found.' })
      return
    }
    res.status(204).end()
  },
)

// Reads a field from an unknown body. Returns undefined if the field is missing.
function readField(body: unknown, field: string): unknown {
  const isObject = typeof body === 'object' && body !== null
  if (!isObject || !(field in body)) {
    return undefined
  }
  const value: unknown = (body as Record<string, unknown>)[field]
  return value
}

// A participant joins a session. The body is `unknown`: we do not know what
// the client actually sent, so we check it step by step.
sessionsRouter.post(
  '/sessions/:sessionId/participants',
  (
    req: Request<SessionParams>,
    res: Response<ParticipantView | ErrorResponse>,
  ) => {
    const session = findSession(req.params.sessionId)
    if (!session) {
      res.status(404).json({ error: 'Session not found.' })
      return
    }

    const body: unknown = req.body
    const hasNameField =
      typeof body === 'object' && body !== null && 'name' in body
    if (!hasNameField) {
      res.status(400).json({ error: 'The name is missing.' })
      return
    }
    const rawName: unknown = body.name
    if (typeof rawName !== 'string') {
      res.status(400).json({ error: 'The name must be a string.' })
      return
    }
    const name = rawName.trim()
    if (name === '') {
      res.status(400).json({ error: 'The name must not be empty.' })
      return
    }

    // Joining is idempotent: if someone with this name already sits at the table,
    // the client gets exactly that participant back (200) instead of a new one.
    // This prevents duplicates when someone joins twice or reloads.
    const existing = findParticipantByName(session, name)
    if (existing) {
      const existingView = toParticipantView(existing, session.revealed)
      res.status(200).json(existingView)
      return
    }

    // Mutating server state directly is fine here (push, splice, ...).
    // React state, however, must NEVER be mutated; always create new copies there.
    const participant = addParticipant(session, name)
    const view = toParticipantView(participant, session.revealed)
    res.status(201).json(view)
  },
)

// A participant leaves a session.
sessionsRouter.delete(
  '/sessions/:sessionId/participants/:participantId',
  // On success (204) there is no body, so only the error type appears.
  (req: Request<ParticipantParams>, res: Response<ErrorResponse>) => {
    const session = findSession(req.params.sessionId)
    if (!session) {
      res.status(404).json({ error: 'Session not found.' })
      return
    }
    const wasRemoved = removeParticipant(session, req.params.participantId)
    if (!wasRemoved) {
      res.status(404).json({ error: 'Participant not found.' })
      return
    }
    res.status(204).end()
  },
)

// Pick, change or retract a card. Body: { "vote": "5" } or { "vote": null }.
// PUT, because the client replaces the whole value of the "vote" resource.
// Sending the same card twice changes nothing (idempotent).
sessionsRouter.put(
  '/sessions/:sessionId/participants/:participantId/vote',
  (
    req: Request<ParticipantParams>,
    res: Response<ParticipantView | ErrorResponse>,
  ) => {
    const session = findSession(req.params.sessionId)
    if (!session) {
      res.status(404).json({ error: 'Session not found.' })
      return
    }
    const participant = findParticipant(session, req.params.participantId)
    if (!participant) {
      res.status(404).json({ error: 'Participant not found.' })
      return
    }
    // 409 Conflict: the request is valid but does not fit the current state.
    if (session.revealed) {
      res
        .status(409)
        .json({ error: 'The cards are revealed. Start a new round.' })
      return
    }

    const vote = readField(req.body, 'vote')
    if (vote === null) {
      participant.vote = null
      const retractedView = toParticipantView(participant, session.revealed)
      res.status(200).json(retractedView)
      return
    }
    if (typeof vote !== 'string') {
      res.status(400).json({ error: 'The card must be a string or null.' })
      return
    }
    const cards = DECKS[session.deck]
    if (!cards.includes(vote)) {
      res.status(400).json({ error: 'This card is not in the deck.' })
      return
    }

    participant.vote = vote
    const view = toParticipantView(participant, session.revealed)
    res.status(200).json(view)
  },
)

// Reveal or start a new round. Body: { "revealed": true } or { "revealed": false }.
// false starts a new round: all votes are cleared.
sessionsRouter.put(
  '/sessions/:sessionId/revealed',
  (req: Request<SessionParams>, res: Response<SessionView | ErrorResponse>) => {
    const session = findSession(req.params.sessionId)
    if (!session) {
      res.status(404).json({ error: 'Session not found.' })
      return
    }
    const revealed = readField(req.body, 'revealed')
    if (typeof revealed !== 'boolean') {
      res.status(400).json({ error: 'revealed must be true or false.' })
      return
    }

    session.revealed = revealed
    if (!revealed) {
      clearVotes(session)
    }
    const view = toSessionView(session)
    res.status(200).json(view)
  },
)

// Switch the deck. Body: { "deck": "tshirt" }.
// Old votes do not fit the new deck ('8' does not exist for T-shirts),
// so a switch always starts a new, hidden round.
sessionsRouter.put(
  '/sessions/:sessionId/deck',
  (req: Request<SessionParams>, res: Response<SessionView | ErrorResponse>) => {
    const session = findSession(req.params.sessionId)
    if (!session) {
      res.status(404).json({ error: 'Session not found.' })
      return
    }
    const deck = readField(req.body, 'deck')
    if (!isDeckId(deck)) {
      res.status(400).json({ error: 'Unknown deck.' })
      return
    }

    session.deck = deck
    session.revealed = false
    clearVotes(session)
    const view = toSessionView(session)
    res.status(200).json(view)
  },
)
