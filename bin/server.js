require('dotenv').config();

function normalizaPort(val) {
    const port = parseInt(val, 10);

    if (isNaN(port)) {
        return val;
    }

    if (port >= 0) {
        return port;
    }

    return false;
}

const http = require('http');
const app = require('../dist/app').default;
const port = normalizaPort(process.env.PORT || '3000');

http.createServer(app)
    .listen(port)
    .on('error', e => console.log(e))
    .on('listening', () => {
        console.log(`Server started:\n\tenv: ${process.env.APP_ENV}\n\tport: ${port}`);
    });