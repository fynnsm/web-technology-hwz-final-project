import express from 'express'
import type { ErrorResponse } from './types.ts'
import type { NextFunction, Request, Response } from 'express'
import { sessionsRouter } from './routes/sessions.ts'

const app = express()

// Parses JSON bodies and exposes them as req.body.
// No CORS needed: the Vite proxy forwards /api to this server.
app.use(express.json())

app.use('/api', sessionsRouter)

// Unknown route -> JSON instead of HTML, so the frontend can read the response.
app.use((_req: Request, res: Response<ErrorResponse>) => {
  res.status(404).json({ error: 'Route not found.' })
})

// Error handler (needs 4 parameters, otherwise Express does not recognise it).
// Broken JSON in the body is a client error (400), anything else is a server bug (500).
app.use(
  (
    err: unknown,
    _req: Request,
    res: Response<ErrorResponse>,
    _next: NextFunction,
  ) => {
    const isObject = typeof err === 'object' && err !== null
    const hasType = isObject && 'type' in err
    const isBadJson = hasType && err.type === 'entity.parse.failed'
    if (isBadJson) {
      res
        .status(400)
        .json({ error: 'The request body must be a valid JSON object.' })
      return
    }
    console.error(err)
    res.status(500).json({ error: 'Internal server error.' })
  },
)

const rawPort = process.env.PORT ?? '3000'
const port = Number(rawPort)

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`)
})
