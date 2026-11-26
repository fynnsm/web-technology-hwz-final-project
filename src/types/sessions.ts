// Antwort-Types der API. Entsprechen server/src/types.ts.

export type DeckId = 'fibonacci' | 'tshirt'

export type SessionSummary = {
  id: string
  name: string
  deck: DeckId
  participantCount: number
}

export type ParticipantView = {
  id: string
  name: string
  hasVoted: boolean
  // Bleibt null, bis die Runde aufgedeckt ist
  vote: string | null
}

export type SessionView = {
  id: string
  deck: DeckId
  name: string
  revealed: boolean
  participants: ParticipantView[]
}

export type ErrorResponse = {
  error: string
}
