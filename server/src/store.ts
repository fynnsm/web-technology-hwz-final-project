import type { Participant, Session } from './types.ts'

// All sessions in memory. Key = session ID.
// Everything is gone after a server restart.
const sessions = new Map<string, Session>()

export function listSessions(): Session[] {
  const allSessions = Array.from(sessions.values())
  return allSessions
}

export function createSession(name: string): Session {
  const session: Session = {
    id: crypto.randomUUID(),
    deck: 'fibonacci',
    name,
    revealed: false,
    participants: [],
  }
  sessions.set(session.id, session)
  return session
}

export function findSession(id: string): Session | undefined {
  return sessions.get(id)
}

export function deleteSession(id: string): boolean {
  const wasDeleted = sessions.delete(id)
  return wasDeleted
}

export function addParticipant(session: Session, name: string): Participant {
  const participant: Participant = {
    id: crypto.randomUUID(),
    name,
    vote: null,
  }
  session.participants.push(participant)
  return participant
}

export function findParticipant(
  session: Session,
  participantId: string,
): Participant | undefined {
  const participant = session.participants.find((p) => p.id === participantId)
  return participant
}

// The name is the key for joining: same name = same seat.
// The comparison is exact (case-sensitive); surrounding whitespace
// has already been trimmed.
export function findParticipantByName(
  session: Session,
  name: string,
): Participant | undefined {
  const participant = session.participants.find((p) => p.name === name)
  return participant
}

export function clearVotes(session: Session): void {
  for (const participant of session.participants) {
    participant.vote = null
  }
}

export function removeParticipant(
  session: Session,
  participantId: string,
): boolean {
  const index = session.participants.findIndex((p) => p.id === participantId)
  if (index === -1) {
    return false
  }
  session.participants.splice(index, 1)
  return true
}
