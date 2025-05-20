import { Request, Response, NextFunction } from "express";
import { createSessionDTO } from "../../dtos/prepPilot.dto";
import asyncHandler from "../../middlewares/async.mdw";
import User from "../../models/User.model";
import ErrorResponse from "../../utils/error.util";

export const createSession = asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
      const body = req.body as createSessionDTO;
      const { email, session } = body;
      
      const userInfo = await User.findOne({ email: email });

      if (!userInfo) {
        return next(
          new ErrorResponse("User not found", 404, [] ));
      }

      const sessionInfo = await User.findOne({ session: session });

      if (!sessionInfo) {
        return next(
          new ErrorResponse("Session not found", 404, [] ));
      }
 
      res.status(201).json({
        error: false,
        errors: [],
        data: userInfo,
        message: "Session created successfully",
        status: 201,
      });
    }
);