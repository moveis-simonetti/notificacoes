export function toCamelCase(notification) {
    const {
      url_destino = null,
      ...rest
    } = notification;

    return {
        ...rest,
        urlDestino: url_destino,
    };
}
