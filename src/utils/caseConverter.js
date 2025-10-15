export function toCamelCase(notification) {
    const {url_destino, ...rest} = notification;

    return {
        ...rest,
        urlDestino: url_destino,
    };
}
