export function toCamelCase(notification) {
    const {
      url_destino = null,
      lida_em = null,
      excluida_em = null,
      ...rest
    } = notification;

    return {
        ...rest,
        urlDestino: url_destino,
        lidaEm: lida_em,
        excluidaEm: excluida_em,
    };
}
