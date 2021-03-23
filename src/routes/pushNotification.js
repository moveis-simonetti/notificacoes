import { Router } from "express";
import beamsClient from "../services/pushNotification";

export default Router().get("/", function (req, res) {
  try {
    if (!beamsClient) throw "Browser Push API needs keys";

    const userId = req.query["user_id"];
    const beamsToken = beamsClient.generateToken(userId);
    res.send(JSON.stringify(beamsToken));
  } catch (err) {
    console.error(err);
    res.status(401).send("");
  }
});
