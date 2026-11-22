
import express, { type Application } from "express"
import { userRoute } from "./modules/users/user.route";
import { profileRoute } from "./modules/profile/profile.route";
import { authRouter } from "./modules/auth/auth.route";


const app: Application = express()
// app.set('etag', false);
// const port = 8000

app.use(express.json());
app.use(express.text());
app.use(express.urlencoded({ extended: true }))

app.use("/api/v1/users", userRoute);
app.use("/api/v1/profiles", profileRoute);
app.use("/api/v1/auth", authRouter);

export default app