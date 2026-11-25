import type { Request, Response } from "express";
import { authService } from "./auth.service";

const loginUser = async (req: Request, res: Response) => {
    try {
        const result = await authService.loginUserInToDB(req.body);

        const { refreshToken } = result

        res.cookie("refreshToken", refreshToken, {
            secure: false, // http -> false, https -> true / In production -> true
            httpOnly: true, //prevent xss attack
            sameSite: "lax", // "none", "strict", "lax" -> CSRF
            // maxAge:
            path: "/",
            domain: "localhost"
        })

        res.status(200).json({
            success: false,
            message: "User login successfully!",
            data: result
        })

    } catch (error: any) {
        res.status(500).json({
            success: false,
            message: error?.message,
            error: error
        })
    }
}

export const authController = {
    loginUser, 
}