import type {
  ParticipantView,
  SessionSummary,
  SessionView,
} from '../types/sessions.ts'

// Alle Funktionen werfen einen Error, wenn der Server nicht mit 2xx antwortet.
// fetch selbst wirft nur, wenn der Server gar nicht erreichbar ist.

export async function listSessions(): Promise<SessionSummary[]> {
  const response = await fetch('/api/sessions')

  if (!response.ok) {
    throw new Error(`Sessions konnten nicht geladen werden: ${response.status}`)
  }

  return (await response.json()) as SessionSummary[]
}

export async function createSession(name: string): Promise<SessionView> {
  const response = await fetch('/api/sessions', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name }),
  })

  if (!response.ok) {
    throw new Error(`Session konnte nicht erstellt werden: ${response.status}`)
  }

  return (await response.json()) as SessionView
}

export async function deleteSession(id: string): Promise<void> {
  const response = await fetch(`/api/sessions/${id}`, { method: 'DELETE' })

  // 204 hat keinen Body, darum kein response.json()
  if (!response.ok) {
    throw new Error(`Session konnte nicht gelöscht werden: ${response.status}`)
  }
}

// Beitreten ist idempotent: Derselbe Name gibt denselben Teilnehmer zurück.
export async function joinSession(
  sessionId: string,
  name: string,
): Promise<ParticipantView> {
  const response = await fetch(`/api/sessions/${sessionId}/participants`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name }),
  })

  if (!response.ok) {
    throw new Error(`Beitreten fehlgeschlagen: ${response.status}`)
  }

  return (await response.json()) as ParticipantView
}

export async function leaveSession(
  sessionId: string,
  participantId: string,
): Promise<void> {
  const response = await fetch(
    `/api/sessions/${sessionId}/participants/${participantId}`,
    { method: 'DELETE' },
  )

  if (!response.ok) {
    throw new Error(`Verlassen fehlgeschlagen: ${response.status}`)
  }
}
