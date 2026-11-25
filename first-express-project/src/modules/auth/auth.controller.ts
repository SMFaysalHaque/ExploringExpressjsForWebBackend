import type { Request, Response } from "express";
import { authService } from "./auth.service";
import { sendResponse } from "../../utils/sendResponse";

const loginUser = async (req: Request, res: Response) => {
    try {
        const result = await authService.loginUserInToDB(req.body);

        const { refreshToken } = result

        res.cookie("refreshToken", refreshToken, {
            secure: false, // http -> false, https -> true / In production -> true
            httpOnly: true, // prevent xss attack
            sameSite: "lax", // "none", "strict", "lax" -> CSRF
            // maxAge:
            path: "/",
            domain: "localhost" // example.com
        })

        sendResponse(res, {
            statusCode: 200,
            success: true,
            message: "User login successfully!",
            data: result,   
        })

    } catch (error: any) {
        sendResponse(res, {
            statusCode: 401,
            success: false,
            message: error?.message,
            error: error,
        })
    }
}

const generateToken = async (req: Request, res: Response) => {
    try {
        const result = await authService.generateAccessToken(req.cookies.refreshToken);

        sendResponse(res, {
            statusCode: 200,
            success: true,
            message: "Access token generated successfully!",
            data: result,
        })

    } catch (error: any) {
        sendResponse(res, {
            statusCode: 401,
            success: false,
            message: error?.message,
            error: error,
        })
    }
}

export const authController = {
    loginUser,
    generateToken
}