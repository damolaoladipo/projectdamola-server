import { Router } from "express";
import { createSession } from "../../controller/prepPilot/session.controller";


const sessionRouter = Router({ mergeParams: true });

sessionRouter.post("/question", createSession);


export default sessionRouter;
