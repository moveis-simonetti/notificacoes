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

export function newDate() {
    const preDate = new Intl.DateTimeFormat('en-US', {
        timeZone: 'America/Sao_Paulo',
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false,
    }).format(new Date());

    const [mes, dia, ano, hora, minuto, segundo] = preDate.match(/\d+/g);

    return new Date(`${ano}-${mes}-${dia}T${hora}:${minuto}:${segundo}`);
}
