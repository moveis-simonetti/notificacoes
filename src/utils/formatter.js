export function formatNotification(notification) {
    const {urlDestino, criacao, ...rest} = notification;

    let criacaoObj = !(criacao instanceof Date)
        ? new Date(criacao)
        : criacao;

    return {
        ...rest,
        url_destino: urlDestino,
        criacao: criacaoObj
            .toISOString()
            .replace('T', ' ')
            .replace('Z', '')
            .split('.')[0],
    };
}
