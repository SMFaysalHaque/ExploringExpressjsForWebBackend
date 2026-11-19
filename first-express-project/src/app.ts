
import express, { type Application } from "express"
import { userRoute } from "./modules/users/user.route";


const app: Application = express()
// app.set('etag', false);
// const port = 8000

app.use(express.json());
app.use(express.text());
app.use(express.urlencoded({ extended: true }))

app.use("/api/v1/users", userRoute);

export default app