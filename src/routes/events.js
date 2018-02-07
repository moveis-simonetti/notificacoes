import {Router} from 'express';
import {dispatch} from "../controllers/events";

export default Router().post("/", dispatch)