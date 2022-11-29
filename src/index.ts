import http from 'http';
import { app } from './app.js';
import { dbConnect } from './db.connect.js';
import { CustomError } from './interface/error.js';
import createDebug from 'debug';
const debug = createDebug('FP2022:index');

const server = http.createServer(app);

server.on('listening', () => {
    const addr = server.address();
    if (addr === null) return;
    let bind: string;
    if (typeof addr === 'string') {
        bind = 'pipe ' + addr;
    } else {
        bind =
            addr.address === '::'
                ? `http://localhost:${addr?.port}`
                : `port ${addr?.port}`;
    }
    debug(`Listening on ${bind}`);
});

server.on('error', (error: CustomError, response: http.ServerResponse) => {
    response.statusCode = error?.statusCode;
    response.statusMessage = error?.statusMessage;
    response.write(error.message);
    response.end();
});

dbConnect()
    .then(() => server.listen(3900))
    .catch((error) => server.emit(error));
