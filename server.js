import http from 'http';
import path from 'path';
import { dirname } from "path";
import { fileURLToPath } from "url";
import serveStatic from 'serve-static';
import finalhandler from 'finalhandler';
import { Server } from "socket.io";


const __dirname = dirname(fileURLToPath(import.meta.url));

const serve =  serveStatic(path.join(__dirname, 'public'), {index: 'index.html'});
const server = http.createServer((req,res) =>
    serve(req, res, finalhandler(req, res))
);


server.listen(9000, () => { console.log(`http://localhost:9000`); });

const io = new Server(server);
io.on('connection', (socket) => {
    socket.on('message', (message) => {
        console.log(message)
    })
});
