import type {
  Participant,
  ParticipantView,
  Session,
  SessionSummary,
  SessionView,
} from './types.ts'

export function toSessionSummary(session: Session): SessionSummary {
  return {
    id: session.id,
    name: session.name,
    deck: session.deck,
    participantCount: session.participants.length,
  }
}

export function toParticipantView(
  participant: Participant,
  revealed: boolean,
): ParticipantView {
  const hasVoted = participant.vote !== null
  // Important: until the round is revealed, the vote is NOT sent.
  // Otherwise anyone could read the other cards in the DevTools "Network" tab.
  if (!revealed) {
    return { id: participant.id, name: participant.name, hasVoted, vote: null }
  }
  return {
    id: participant.id,
    name: participant.name,
    hasVoted,
    vote: participant.vote,
  }
}

export function toSessionView(session: Session): SessionView {
  const participants = session.participants.map((p) =>
    toParticipantView(p, session.revealed),
  )
  return {
    id: session.id,
    deck: session.deck,
    name: session.name,
    revealed: session.revealed,
    participants,
  }
}
