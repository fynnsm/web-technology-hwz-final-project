// Domain types: how the server stores the data.

export type DeckId = 'fibonacci' | 'tshirt'

export interface Participant {
  id: string
  name: string
  // null = not voted yet
  vote: string | null
}

export interface Session {
  id: string
  deck: DeckId
  name: string
  revealed: boolean
  participants: Participant[]
}

// Response types (DTOs): how the client sees the data.

export interface SessionSummary {
  id: string
  name: string
  deck: DeckId
  participantCount: number
}

export interface ParticipantView {
  id: string
  name: string
  hasVoted: boolean
  // Always null until the round is revealed (see views.ts)
  vote: string | null
}

export interface SessionView {
  id: string
  deck: DeckId
  revealed: boolean
  name: string
  participants: ParticipantView[]
}

export interface ErrorResponse {
  error: string
}
