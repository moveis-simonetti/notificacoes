import {createClient} from 'redis';
import md5 from 'md5';

const redis = createClient({
    url: process.env.REDIS_URL,
});

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

export function setData(resource, group, data) {
    return new Promise((fulfill, reject) => {
        redis.set(getRedisKey(resource, group), JSON.stringify(data), callback.bind(null, fulfill, reject));
    });
}

export function getData(resource, group) {
    return new Promise((fulfill, reject) => {
        redis.get(getRedisKey(resource, group), callback.bind(null, data => fulfill(JSON.parse(data || "[]")), reject));
    });
}

export function updateEntry(resource, group, entry) {
    let callback = data => {
        setData(
            resource, group, data.map(
                data => data._$key === entry._$key ? entry : data
            )
        );

        return entry;
    };

    return getData(resource, group).then(callback);
}

export function insertEntry(resource, group, entry) {
    entry._$key = generateMd5(group);

    return getData(resource, group)
        .then(data => setData(resource, group, data.concat(entry)))
        .then(() => entry);
}

export function saveEntry(resource, group, entry) {
    if (entry._$key) {
        return updateEntry(resource, group, entry);
    }

    return insertEntry(resource, group, entry);
}

export function deleteEntry(resource, group, entry) {
    return getData(resource, group)
        .then(data => setData(
            resource, group, data.filter(
                dbEntry => dbEntry._$key !== entry._$key)
            )
        );
}

export function getEntry(resource, group, uniqKey) {
    return getData(resource, group)
        .then(data => data.find(entry => entry._$key === uniqKey));
}