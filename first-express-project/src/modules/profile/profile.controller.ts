import type { Request, Response } from "express";
import { profileService } from "./profile.servce";

const createProfile = async (req: Request, res: Response) => {
    try {
        const result = await profileService.createProfileInToDB(req.body)
        res.status(201).json({
            success: true,
            message: "Profile created successfully!",
            error: result.rows[0]
        })
    } catch (error: any) {
        res.status(500).json({
            success: false,
            message: error?.message,
            error: error
        })
    }
}

export const profileController = {
    createProfile
}