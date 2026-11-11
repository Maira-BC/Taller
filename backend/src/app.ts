import express from 'express'
import cors from 'cors'
import fs from 'node:fs'
import YAML from 'yaml'
import swaggerUi from 'swagger-ui-express'
import * as OpenApiValidator from 'express-openapi-validator'
import sucursales from './routes/sucursales.js'
import turnos from './routes/turnos.js'

const spec = YAML.parse(fs.readFileSync('openapi.yaml', 'utf8'))
export const app = express()

app.use(cors())
app.use(express.json())
app.use('/docs', swaggerUi.serve, swaggerUi.setup(spec))
app.use(OpenApiValidator.middleware({ apiSpec: 'openapi.yaml', validateRequests: true }))

app.use('/api/sucursales', sucursales)
app.use('/api', turnos)

app.use((err: any, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
  res.status(err.status ?? 500).json({ message: err.message, errors: err.errors })
})