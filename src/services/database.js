import {PrismaClient} from '@prisma/client';
import {v4 as uuidv4} from 'uuid';
import {formatNotification, newDate} from "../utils/formatter";

const prisma = new PrismaClient();

function getWhereClause(group, context) {
    return {
        login: {
            equals: group,
        },
        ativa: true,
        ...(context ? { OR: [{context}, {context: null}] } : {}),
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
            ...(limit !== undefined && {take: limit}),
            orderBy: {criacao: 'asc'},
        });

        return notifications.map(notification => formatNotification(notification));
    } catch (err) {
        throw err;
    }
}

export async function updateEntry(entry) {
    try {
        const notification = await prisma.notificacao.update({
            where: {id: entry.id},
            data: entry,
        });

        return formatNotification(notification);
    } catch (err) {
        throw err;
    }
}

export async function insertEntry(group, entry) {
    entry.id = generateUUID();

    try {
        const createdNotificacao = await prisma.notificacao.create({
            data: {
                ...entry,
                criacao: newDate(),
            },
        });

        return formatNotification(createdNotificacao);
    } catch (err) {
        throw err;
    }
}

export async function inactivateEntry(id) {
    try {
        await prisma.notificacao.update({
            where: {id: id},
            data: {ativa: false},
        });
    } catch (err) {
        throw err;
    }
}

export async function inactivateAllEntry(login, context) {
    try {
        await prisma.notificacao.updateMany({
            where: getWhereClause(login, context),
            data: {ativa: false},
        });
    } catch (err) {
        throw err;
    }
}

export async function getQuantity(group, context) {
    try {
        const [qtde, sonoros] = await Promise.all([
            prisma.notificacao.count({
                where: getWhereClause(group, context),
            }),
            prisma.notificacao.count({
                where: {
                    ...getWhereClause(group, context),
                    sonoro: true,
                },
            }),
        ]);

        return {qtde, registros_sonoros: sonoros};
    } catch (err) {
        throw err;
    }
}
