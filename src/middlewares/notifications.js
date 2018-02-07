import {Router} from 'express';

function isInvalid(req) {
    let {method, body, params, query} = req;

    if (['POST', 'PUT'].includes(method) && !body.login) {
        return true;
    }

    if ('GET' === method && !(params.login || query.login)) {
        return true;
    }

    return 'DELETE' === method && !params.login;
}

function validate(req, res, next) {
    if (isInvalid(req)) {
        return res.status(400).send({error: true, message: "Login is required!"});
    }

    next();
}

export default Router()
    .get("/", validate)
    .put("/", validate)
    .post("/", validate)
    .get("/:login", validate)
    .get("/:login/status", validate)
    .delete("/:login/:key", validate);
