import Pusher from 'pusher';

const config = {
    appId: process.env.PUSHER_APP_ID,
    key: process.env.PUSHER_KEY,
    secret: process.env.PUSHER_SECRET,
    cluster: process.env.PUSHER_CLUSTER,
    encrypted: process.env.PUSHER_ENCRYPTED && JSON.parse(process.env.PUSHER_ENCRYPTED)
};

if (process.env.PUSHER_HOST) {
    config.host = process.env.PUSHER_HOST;
}

const pusher = new Pusher(config);

export default pusher;