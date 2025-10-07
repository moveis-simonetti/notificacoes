import {
    addNotification,
    deleteNotification,
    deleteAllNotifications,
    getNotificationsByUser,
    getQttyPending,
    updateNotification
} from "../services/notification";

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
        addNotification(req.body),
        notification => res.status(201).send(notification)
    )
);

export const update = (req, res, next) => (
    helper(
        res,
        next,
        updateNotification(req.body),
        notification => res.status(200).send(notification)
    )
);

export const fetch = (req, res, next) => (
    helper(
        res,
        next,
        getNotificationsByUser(req.params.login || req.query.login),
        notifications => res.status(200).send(
            notifications.map(
                notification => Object.assign(
                    notification,
                    {id: notification._$key}
                )
            )
        )
    )
);

export const remove = (req, res, next) => {
    let {login, key} = req.params;

    return helper(
        res,
        next,
        deleteNotification(login, key),
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
        getQttyPending(req.params.login),
        qtty => res.status(200).send(qtty)
    )
);

export const fetchPaginated = (req, res, next) => {
    const page = parseInt(req.params.page || req.query.page) || 1;
    const limit = parseInt(req.params.limit || req.query.limit) || 10;

    if (page < 1 || limit < 1) {
        return res.status(400).send({
            err: true,
            message: 'Parâmetros de página ou limite inválidos.'
        })
    }

    helper(
        res,
        next,
        getNotificationsByUser(req.params.login || req.query.login),
        notifications => {
            const start = (page - 1) * limit;
            const end = start + limit;
            const totalItems = notifications.length
            const totalPages = Math.ceil(totalItems / limit);

            const paginatedNotifications = notifications.slice(start, end).map(notification =>
                Object.assign(notification, { id: notification._$key })
            );

            res.status(200).send({
                page,
                limit,
                totalItems,
                totalPages,
                data: paginatedNotifications
            });
        }
    );
};
