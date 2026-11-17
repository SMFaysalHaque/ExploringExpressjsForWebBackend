import express, { type Application, type Request, type Response } from "express"
import { appendFile } from "fs";
const app: Application = express()
// app.set('etag', false);
const port = 5000

app.use(express.json());
app.use(express.text());
app.use(express.urlencoded({ extended: true }))


app.get('/', (req: Request, res: Response) => {
//   res.send('Hello World!')
    res.status(200).json({
        success: true,
        message: "This is root route",
        author: "Faysal"
    })
})

app.post("/", async(req: Request, res: Response) => {
    console.log(req.body)
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})