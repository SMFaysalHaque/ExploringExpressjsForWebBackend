import type { NextFunction, Request, Response } from "express";
import jwt, { type JwtPayload } from "jsonwebtoken"
import config from "../config";
import { pool } from "../db";
import type { Role } from "../types";

const auth = (...roles: Role[]) => {
    return async (req: Request, res: Response, next: NextFunction) => {
        try {
            // 1. check if the token exist
            // 2-> Verify token
            // 3-> Check if the user exist 
            // 4-> Is the user status active
            // console.log("This is protected route!");
            const token = req.headers.authorization;
            if (!token) {
                return res.status(401).json({
                    success: false,
                    message: "Unauthorized access!",
                })
            }

            const decode = jwt.verify(token as string, config.jwt_secret) as JwtPayload;

            const user = await pool.query(`
                SELECT * FROM users WHERE email=$1`,
            [decode.email]
            )

            // console.log(user.rows[0])
            if (user.rowCount === 0) {
                return res.status(404).json({
                    success: false,
                    message: "User not found!",
                })
            }

            if (!user.rows[0].is_active) {
                return res.status(403).json({
                    success: false,
                    message: "Forbidden!",
                })
            }

            if (roles.length && !roles.includes(user.rows[0])) {
                return res.status(401).json({
                    success: false,
                    message: "Unauthorized access!",
                })
            }

            req.user = decode;

            // console.log(req)

            next()
        } catch (error) {
            next(error)
        }
    }
}

export default auth