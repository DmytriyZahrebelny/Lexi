# Lexi — Product Requirements Document

## 1. Overview

Lexi is an app for learning English vocabulary. A user adds words they want to
learn, and the app schedules spaced-repetition review sessions so words they
struggle with come back sooner and words they know well come back later.

## 2. Goals

- Make it fast to capture a new word (with minimal manual data entry) and
  turn it into something reviewable.
- Use a proven spaced-repetition algorithm (SM-2) to schedule reviews, rather
  than a simple fixed-interval or random-order review list.
- Ship a usable MVP as a web app first; design choices should not preclude
  adding a mobile app later.

## 3. Core user story

A user signs up, adds English words/phrases they want to learn (typing a
word triggers automatic lookup of its definition, part of speech, an example
sentence, and audio pronunciation), and then reviews due words in short
flashcard sessions. Grading recall on each card (Again / Hard / Good / Easy)
updates that word's schedule per SM-2.

## 4. MVP feature set

1. **Auth** — register, login, logout, persistent session.
2. **Word management** — add a word to a personal list; the backend enriches
   it automatically (definition, part of speech, example sentence, audio
   pronunciation) via a dictionary lookup; edit a personal note; remove a
   word from the list.
3. **Review engine (SM-2)** — a due queue of cards; a flashcard review flow
   (show word → reveal answer → grade recall); grading updates the card's
   ease factor, interval, and due date.
4. **Dashboard** — count of words due today, total words learned, a simple
   streak.
5. **Audio playback** — play pronunciation audio during review, when
   available for that word.

## 5. Explicitly out of scope for MVP

- Pre-built curriculum/decks — words come only from the user's own list.
- Multi-language support / translation.
- Social or sharing features.
- Mobile app (planned for later, not built in the MVP).
- Offline mode.
- Gamification beyond a basic streak.

## 6. Future (post-MVP, not planned in detail yet)

- Mobile app (Expo/React Native), reusing shared API contracts.
- Deck sharing / community word lists.
- Richer stats (retention over time, per-word history).

## 7. Key product decisions

| Decision | Choice | Why |
|---|---|---|
| Learning mechanic | Spaced-repetition flashcards (SM-2) | Well-understood algorithm, effective for vocab retention. |
| Word source | User-curated personal lists | Matches the target use case: capturing words encountered in the wild, not working through a fixed course. |
| Auth | Full authentication from day one | Needed for a personal word list to persist per user across sessions/devices. |
| Word data | Definition, part of speech, example sentence, audio pronunciation | Sourced automatically from a free dictionary API rather than hand-authored, to keep entry effortless and scope realistic. |

## 8. Tech stack (decided)

- **Monorepo:** pnpm workspaces.
- **Backend:** Hono, Drizzle ORM, `pg`, TypeScript, PostgreSQL.
- **Frontend:** Next.js, TanStack Query, TypeScript.
- **Testing:** Vitest for both backend and frontend.
- **Mobile:** planned as a later addition to the same monorepo.

Detailed architecture (data model, API surface, SM-2 implementation, roadmap)
is tracked separately as an implementation plan once building begins.
