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

const users = [];
//----------------------------------------------------------
// Mise en place des WebSockets
//----------------------------------------------------------
const io = new Server(server);
// Détection d'une nouvelle connexion au socket
io.on('connection', (socket) => {
    // Fonction de déconnexion
    function disconnectSocket() {
        // si le socket.pseudo existe
        if(socket.pseudo != undefined) {
            // On recherche le pseudo dans la liste des utilisateurs
            let index = users.indexOf(socket.pseudo);
            // si l'index est différent de -1 (-1 = pseudo non trouvé)
            if(index != -1) {
                // on retire  1 élément depuis l'index
                users.splice(index,1);
                // On renvoi la liste complete d'utilisateurs à tous les sockets connectés
                io.emit('server:user:list', users);
            }
        }
    }
    // écouteur d'évenement sur l'envoi d'un choix de pseudo
    socket.on('client:user:pseudo', (pseudo) => {
        // vérifie si le pseudo existe déjà dans notre liste d'utilisateur
        if(users.includes(pseudo)) {
            // Envoi un message d'information de pseudo djà utilisé au socket en cours
            socket.emit('server:user:pseudo_exists');
        }
        else {
            // mémorise dans le so=cket en cours le pseudo de l'utilisateur
            socket.pseudo = pseudo;
            // ajoute le pseudo de l'utilisateur à la liste des utilisateurs
            users.push(pseudo);
            // Envoi un message d'information de connexion au socket en cours
            socket.emit('server:user:connected');
            // Envoie la liste des utilisateurs à tous les sockets
            io.emit('server:user:list', users);
        }
    });
    // écouteur d'évenement sur le bouton de déconnexion sur l'interface
    socket.on('client:user:ui_disconnect', disconnectSocket);
    // écouteur d'évenement sur la déconnexion du socket (actualisation de page, fermeture d'onglet / navigateur)
    socket.on('disconnect', disconnectSocket);

});
