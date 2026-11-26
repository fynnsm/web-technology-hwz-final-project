import type { DeckId } from './types.ts'

// Cards are always strings. The frontend computes the average
// (and, for T-shirt sizes, the mapping to numbers).
export const DECKS: Record<DeckId, string[]> = {
  fibonacci: ['0', '1', '2', '3', '5', '8', '13', '21', '?'],
  tshirt: ['XS', 'S', 'M', 'L', 'XL'],
}

// Checks an unknown value (e.g. from the request body) for a valid deck ID.
export function isDeckId(value: unknown): value is DeckId {
  if (typeof value !== 'string') {
    return false
  }
  const isKnownDeck = Object.hasOwn(DECKS, value)
  return isKnownDeck
}
