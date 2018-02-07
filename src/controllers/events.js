import {dispatchEvento} from "../services/events";

export function dispatch(req, res) {
    dispatchEvento(req.body).then(res.json.bind(res));
}