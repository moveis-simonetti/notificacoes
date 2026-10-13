export function formatNotification(notification) {
    const {lidaEm, excluidaEm, urlDestino, criacao, ...rest} = notification;

    let criacaoObj = !(criacao instanceof Date)
        ? new Date(criacao)
        : criacao;

    return {
        ...rest,
        lida_em: lidaEm,
        excluida_em: excluidaEm,
        url_destino: urlDestino,
        criacao: criacaoObj
            .toISOString()
            .replace('T', ' ')
            .replace('Z', '')
            .split('.')[0],
        ordem: criacaoObj.getTime(),
    };
}

export function newDate(instante = new Date()) {
    const preDate = new Intl.DateTimeFormat('en-US', {
        timeZone: 'America/Sao_Paulo',
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false,
    }).format(instante);

    const [mes, dia, ano, hora, minuto, segundo] = preDate.match(/\d+/g);
    const milissegundos = String(instante.getMilliseconds()).padStart(3, '0');

    return new Date(`${ano}-${mes}-${dia}T${hora}:${minuto}:${segundo}.${milissegundos}`);
}

export function criacaoRecebidaOuAgora(criacao) {
    const instante = typeof criacao === 'string' ? new Date(criacao) : null;

    return instante && !Number.isNaN(instante.getTime()) ? newDate(instante) : newDate();
}
