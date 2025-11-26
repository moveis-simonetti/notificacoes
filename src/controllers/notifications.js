import {
    addNotification,
    deleteAllNotifications,
    deleteNotification,
    getNotificationsByUser,
    getNotificationsQtde,
    getQttyPending,
    updateNotification,
    markAsReadNotification,
} from "../services/notification";
import {toCamelCase} from "../utils/caseConverter";

const helper = (res, next, promise, then) => {
    return promise
        .then(then)
        .catch(err => {
            res.status(500).send({
                err: true,
                message: err.message
            })
        })
        .then(() => next());
};

export const create = (req, res, next) => (
    helper(
        res,
        next,
        addNotification(req.headers.context, toCamelCase(req.body)),
        notification => res.status(201).send(notification)
    )
);

export const update = (req, res, next) => (
    helper(
        res,
        next,
        updateNotification(toCamelCase(req.body)),
        notification => res.status(200).send(notification)
    )
);

export const fetch = (req, res, next) => {
    const login = req.params.login || req.query.login;

    helper(
        res,
        next,
        getNotificationsByUser(login, req.headers.context),
        notifications => res.status(200).send(notifications)
    )
};

export const remove = (req, res, next) => {
    let {key} = req.params;

    return helper(
        res,
        next,
        deleteNotification(key),
        () => res.status(204).send()
    )
};

export const removeAll = (req, res, next) => {
    let {login} = req.params;

    return helper(
        res,
        next,
        deleteAllNotifications(login),
        () => res.status(204).send()
    )
};

export const getStatus = (req, res, next) => (
    helper(
        res,
        next,
        getQttyPending(req.params.login, req.headers.context),
        qtty => res.status(200).send(qtty)
    )
);

export const fetchPaginated = (req, res, next) => {
    const login = req.params.login || req.query.login;
    const context = req.headers.context;
    const page = parseInt(req.params.page || req.query.page) || 1;
    const limit = parseInt(req.params.limit || req.query.limit) || 10;

    if (page < 1 || limit < 1) {
        return res.status(400).send({
            err: true,
            message: 'Parâmetros de página ou limite inválidos.'
        })
    }

    const skip = (page - 1) * limit;

    return Promise.all([
        getNotificationsByUser(login, context, skip, limit),
        getNotificationsQtde(login, context),
    ]).then(([notifications, totalItems]) => {
        const totalPages = Math.ceil(totalItems / limit);

        res.status(200).send({
            page,
            limit,
            total_items: totalItems,
            total_pages: totalPages,
            data: notifications,
        });
    }).catch((err) => {
        res.status(500).send({
            err: true,
            message: err.message,
        });

        next();
    });
};

export const markAsRead = (req, res, next) => {
    const { id } = req.params

    return helper(
        res,
        next,
        markAsReadNotification(id),
        () => res.status(204).send()
    )
}
