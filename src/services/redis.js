import {Redis} from 'ioredis';
import md5 from 'md5';

const redis = new Redis(process.env.REDIS_URL);

function callback(fulfill, reject, err, dados) {
    if (err) {
        return reject(err);
    }

    fulfill(dados);
}

function getRedisKey(resource, group) {
    return `${resource}:${group}`;
}

function generateMd5(group) {
    return md5(`${group}${(new Date()).getMilliseconds()}`);
}

export function getData(resource, group, start = 0, end = -1) {
    const key = getRedisKey(resource, group);

    return rectifyEntry(key).then(() =>
        new Promise((fulfill, reject) => {
            redis.lrange(key, start, end, (err, data) =>
                callback(fulfill, reject, err, data.map((item) => JSON.parse(item || '{}')))
            );
        })
    );
}

export function updateEntry(resource, group, entry) {
    const key = getRedisKey(resource, group);

    return rectifyEntry(key).then(() =>
        new Promise((fulfill, reject) => {
            redis.lrange(key, 0, -1, (err, notifications) => {
                if (err) {
                    return reject(err);
                }

                const index = notifications.findIndex((item) => {
                    try {
                        const parsed = JSON.parse(item || '{}');
                        return parsed._$key === entry._$key;
                    } catch {
                        return false;
                    }
                });

                if (index === -1) {
                    return reject(new Error('Notificação não encontrada.'));
                }

                const existingNotification = JSON.parse(notifications[index]);
                const updatedNotification = {
                    ...existingNotification,
                    ...entry,
                    _$key: existingNotification._$key,
                };

                redis.lset(key, index, JSON.stringify(updatedNotification), (err) =>
                    callback(fulfill, reject, err, updatedNotification)
                );
            });
        })
    );
}

export function insertEntry(resource, group, entry) {
    entry._$key = generateMd5(group);
    const key = getRedisKey(resource, group);

    return rectifyEntry(key).then(() =>
        new Promise((fulfill, reject) => {
            redis.rpush(key, JSON.stringify(entry), (err) =>
                callback(fulfill, reject, err, entry)
            );
        })
    );
}

export function deleteEntry(resource, group, entry) {
    const key = getRedisKey(resource, group);

    return rectifyEntry(key).then(() =>
        new Promise((fulfill, reject) => {
            redis.lrange(key, 0, -1, (err, notifications) => {
                if (err) {
                    return reject(err);
                }

                const index = notifications.findIndex((item) => {
                    try {
                        const parsed = JSON.parse(item || '{}');
                        return parsed._$key === entry._$key;
                    } catch {
                        return false;
                    }
                });

                if (index === -1) {
                    return reject(new Error('Notificação não encontrada.'));
                }

                redis.lrem(key, 0, notifications[index], (err) =>
                    callback(fulfill, reject, err)
                );
            });
        })
    );
}

export function getQuantity(resource, group) {
    const key = getRedisKey(resource, group);

    return rectifyEntry(key).then(() =>
        new Promise((fulfill, reject) => {
            redis.llen(key, (err, qtde) => {
                if (err) {
                    return reject(err);
                }

                getData(resource, group).then(data => {
                    fulfill({
                        qtde,
                        registros_sonoros: data.filter(entry => entry.sonoro).length
                    })
                }).catch(reject);
            });
        })
    );
}

export function rectifyEntry(key) {
    return new Promise((fulfill, reject) => {
        redis.type(key, (err, type) => {
            if (err) {
                return reject(err);
            }

            if ('list' === type || 'none' === type) {
                return fulfill();
            }

            if ('string' === type) {
                redis.get(key, (err, jsonData) => {
                    if (err) {
                        return reject(err);
                    }

                    let notifications;

                    try {
                        notifications = JSON.parse(jsonData || '[]');
                    } catch (err) {
                        return reject(err);
                    }

                    redis.del(key, err => {
                        if (err) {
                            return reject(err);
                        }

                        if (notifications.length === 0) {
                            return fulfill();
                        }

                        redis.rpush(key, notifications.map(notification => JSON.stringify(notification)), (err) =>
                            callback(fulfill, reject, err)
                        );
                    });
                });
            } else {
                redis.del(key, (err) =>
                    callback(fulfill, reject, err)
                );
            }
        });
    });
}

export function deleteAllEntry(resource, group) {
    const key = getRedisKey(resource, group);

    return rectifyEntry(key).then(() =>
        new Promise((fulfill, reject) => {
            redis.del(key, (err) =>
                callback(fulfill, reject, err)
            );
        })
    );
}
