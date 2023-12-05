import pusher from './pusher';

const RESOURCE = 'events';

export function dispatchEvento(evento) {
    return new Promise((fulfill, reject) => {
        try {
            pusher.trigger(
                evento.channel || RESOURCE,
                evento.identificacao,
                evento.data || evento.payload || evento
            );

            fulfill(evento);
        } catch (err) {
            reject(err);
        }
    });
}