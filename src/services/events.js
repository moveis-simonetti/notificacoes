import pusher from './pusher';

const RESOURCE = 'events';

export function dispatchEvento(evento) {
    return new Promise((fulfill, reject) => {
        try {
            pusher.trigger(RESOURCE, evento.identificacao, evento);

            fulfill(evento);
        } catch (err) {
            reject(err);
        }
    });
}