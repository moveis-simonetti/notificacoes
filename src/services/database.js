import {PrismaClient} from '@prisma/client';
import {v4 as uuidv4} from 'uuid';
import {criacaoRecebidaOuAgora, formatNotification, newDate} from "../utils/formatter";

const prisma = new PrismaClient();

function getWhereClause(group, context) {
    return {
        login: {
            equals: group,
        },
        ativa: true,
        ...(context ? { OR: [{ context }, { context: null }] } : {}),
    };
}

function generateUUID() {
    return uuidv4();
}

export async function getData(group, context, skip = 0, limit = undefined) {
    try {
        const notifications = await prisma.notificacao.findMany({
            where: getWhereClause(group, context),
            skip,
            ...(limit !== undefined && { take: limit }),
            orderBy: { criacao: 'asc' },
        });

        return notifications.map(notification => formatNotification(notification));
    } catch (err) {
        throw err;
    }
}

export async function updateEntry(entry) {
    try {
        const notification = await prisma.notificacao.update({
            where: { id: entry.id },
            data: entry,
        });

        return formatNotification(notification);
    } catch (err) {
        throw err;
    }
}

function montarDados(entry, context) {
    const mobile = entry.mobile === true;

    return {
        id: generateUUID(),
        assunto: entry.assunto,
        conteudo: entry.conteudo,
        icone: entry.icone ?? null,
        context: context || null,
        login: entry.login,
        pendente: entry.pendente ?? true,
        sonoro: entry.sonoro ?? false,
        identificacao: entry.identificacao ?? null,
        urlDestino: entry.urlDestino ?? null,
        criacao: criacaoRecebidaOuAgora(entry.criacao),
        ativa: entry.ativa ?? true,
        subtitulo: entry.subtitulo ?? null,
        mobile,
        lidaEm: entry.lidaEm ?? null,
        excluidaEm: entry.excluidaEm ?? null,
        agrupamento: mobile ? (entry.agrupamento || null) : null,
        idempotencia: entry.idempotencia || null,
    };
}

export async function insertEntry(group, entry, context, client = prisma) {
    try {
        const createdNotificacao = await client.notificacao.create({
            data: montarDados(entry, context),
        });

        return formatNotification(createdNotificacao);
    } catch (err) {
        throw err;
    }
}

export async function findByIdempotencia(login, idempotencia) {
    const notificacao = await prisma.notificacao.findFirst({
        where: { login, idempotencia },
    });

    return notificacao ? formatNotification(notificacao) : null;
}

export async function markAsDispatchedEntry(id) {
    await prisma.notificacao.update({
        where: { id },
        data: { disparadaEm: newDate() },
    });
}

export function isIdempotenciaDuplicada(err) {
    return err?.code === 'P2002';
}

export async function inactivateEntry(id) {
    try {
        await prisma.notificacao.update({
            where: { id: id },
            data: { ativa: false },
        });
    } catch (err) {
        throw err;
    }
}

export async function inactivateAllEntry(login, context) {
    try {
        await prisma.notificacao.updateMany({
            where: getWhereClause(login, context),
            data: { ativa: false },
        });
    } catch (err) {
        throw err;
    }
}

export async function getQuantity(group, context, client = prisma) {
    try {
        const [qtde, sonoros] = await Promise.all([
            client.notificacao.count({
                where: getWhereClause(group, context),
            }),
            client.notificacao.count({
                where: {
                    ...getWhereClause(group, context),
                    sonoro: true,
                },
            }),
        ]);

        return { qtde, registros_sonoros: sonoros };
    } catch (err) {
        throw err;
    }
}

export async function markAsReadEntry(id) {
    try {
        const notificacao = await prisma.notificacao.update({
            where: { id },
            data: {
                lidaEm: newDate(),
            },
        });

        return formatNotification(notificacao);
    } catch (err) {
        throw err;
    }
}

export async function markAsExcludedEntry(id) {
    try {
        const notificacao = await prisma.notificacao.update({
            where: { id },
            data: {
                ativa: false,
                excluidaEm: newDate(),
            },
        });

        return formatNotification(notificacao);
    } catch (err) {
        throw err;
    }
}
