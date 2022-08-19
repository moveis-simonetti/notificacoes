import { Router } from 'express';

import beamsClient from '../services/pushNotification';

const sendFail = (res, err) => {
    console.error(err);
    res.status(401).send('');
};

export default Router()
    .get('/', function (req, res) {
        console.log('hello', req.query);
        try {
            if (!beamsClient) throw 'Browser Push API needs keys';

            const userId = req.query['user_id'];
            const beamsToken = beamsClient.generateToken(userId);
            res.send(JSON.stringify(beamsToken));
        } catch (err) {
            console.error(err);
            res.status(401).send('');
        }
    })
    .delete('/', function (req, res) {
        console.log('good bye', req.query);
        if (!beamsClient) return sendFail(res, 'Browser Push API needs keys');

        if (!req.query['user_id']) return sendFail(res, 'Missing user_id');

        beamsClient
            .deleteUser(req.query['user_id'])
            .then(() => res.status(204).send(''))
            .catch((err) => sendFail(res, err));
    });
