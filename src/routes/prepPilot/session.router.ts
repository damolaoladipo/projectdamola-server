import { Router } from "express";
import { createSession } from "../../controllers/prepPilot/session.controller";


const sessionRouter = Router({ mergeParams: true });

sessionRouter.post("/question", createSession);


export default sessionRouter;
