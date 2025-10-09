import {Router} from 'express';
import {create, update, fetch, remove, removeAll, getStatus, fetchPaginated} from "../controllers/notifications";

export default Router()
    .post("/", create)
    .put("/", update)
    .delete("/:login/:key", remove)
    .delete("/:login", removeAll)
    .get("/:login", fetch)
    .get("/", fetch)
    .get("/:login/status", getStatus)
    .get("/:login/:page/:limit", fetchPaginated);
