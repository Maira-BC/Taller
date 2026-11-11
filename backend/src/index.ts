import 'dotenv/config'
import { app } from './app.js'
import { conectarMongo } from './db/mongo.js'

const PORT = Number(process.env.PORT ?? 3000)

await conectarMongo()
app.listen(PORT, () =>
  console.log(`API en http://localhost:${PORT} — docs en http://localhost:${PORT}/docs`))
