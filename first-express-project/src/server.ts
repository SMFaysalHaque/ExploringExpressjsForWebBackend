import express, { type Application, type Request, type Response } from "express"
import { appendFile } from "fs";
import {Pool} from "pg"
const app: Application = express()
// app.set('etag', false);
const port = 5000

app.use(express.json());
app.use(express.text());
app.use(express.urlencoded({ extended: true }))

const pool = new Pool({
    connectionString: "postgresql://neondb_owner:npg_zx2QaPkDpn3N@ep-weathered-queen-b3e6lqve.c-4.ap-southeast-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require"
})
console.log(pool)

app.get('/', (req: Request, res: Response) => {
//   res.send('Hello World!')
    res.status(200).json({
        success: true,
        message: "This is root route",
        author: "Faysal"
    })
})

app.post("/", async(req: Request, res: Response) => {
    // console.log(req.body)
    const { name, age, password } = req.body
    // console.log(password);

    res.status(200).json({
        success: true,
        message: "This is a test api!",
        data: { name, age }
    })
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})