import express, { Request, Response, NextFunction } from "express";
import sessionRoutes from "./session.router";


const  router = express.Router()

router.use('/session', sessionRoutes)


router.get("/", (req: Request, res: Response, next: NextFunction) => {

    res.status(200).json({
        error: false,
        errors: [],
        data: {
            name: "PrepPilot API",
            version: "1.0.0",

        },
        message: 'PrepPilot api v1.0.0 is healthy',
        status: 200

    })


})

export default router
