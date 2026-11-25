
import express, { type Application } from "express"
import { userRoute } from "./modules/users/user.route";
import { profileRoute } from "./modules/profile/profile.route";
import { authRouter } from "./modules/auth/auth.route";
import logger from './middleware/logger';
import { globalErrorHandler } from "./middleware/globalErrorHandler";
import cors from "cors"
import cookieParser from "cookie-parser"



const app: Application = express()
// app.set('etag', false);
// const port = 8000

var corsOptions = {
  origin: ['http://localhost:3000'],
  optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204
}

app.use(cors(corsOptions));
app.use(cookieParser());
app.use(express.json()); // middleware
app.use(express.text()); // middleware
app.use(express.urlencoded({ extended: true })) // middleware
app.use(logger) // custom middleware

// app.use((req, res, next) => {
// //   console.log('Time:', Date.now());

// });

app.use("/api/v1/users", userRoute);
app.use("/api/v1/profiles", profileRoute);
app.use("/api/v1/auth", authRouter);

// Global Error Handling Middleware
app.use(globalErrorHandler);

export default app