import Pusher from 'pusher';

const config = {
    appId: process.env.PUSHER_APP_ID,
    key: process.env.PUSHER_KEY,
    secret: process.env.PUSHER_SECRET,
    cluster: process.env.PUSHER_CLUSTER,
    encrypted: process.env.PUSHER_ENCRYPTED && JSON.parse(process.env.PUSHER_ENCRYPTED)
};

if (process.env.PUSHER_HOST) {
    const endpoint = new URL(process.env.PUSHER_HOST);
    config.host = endpoint.hostname;
    config.scheme = endpoint.protocol.replace(':', '');
    config.useTLS = endpoint.protocol === 'https:';
}

const pusher = new Pusher(config);

export default pusher;