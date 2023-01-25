import User from './User.js'
import { Server } from "socket.io";


export default class ServerChat {

    constructor(serverHttp) {
      this.users = [];
      this.io = new Server(serverHttp);
      //this.io.on('connection', function(socket) { this.onConnection.bind(this, socket)});
      // Détection d'une nouvelle connexion au socket
      this.io.on('connection', (socket) => { this.onConnection(socket); } );
    }

    onConnection(socket) {
      console.log(`client ${socket.id} is connected via WebSockets   `);
        // écouteur d'évenement sur l'envoi d'un choix de pseudo
        socket.on('client:user:pseudo', (pseudo) => this.choicePseudo(socket, pseudo) );
        // écouteur d'évenement sur le bouton de déconnexion sur l'interface
        socket.on('client:user:ui_disconnect',  () => this.disconnectSocket(socket));
        // écouteur d'évenement sur la déconnexion du socket (actualisation de page, fermeture d'onglet / navigateur)
        socket.on('disconnect', () => this.disconnectSocket(socket));
        // réception d'un message
        socket.on('client:message:send', this.receiveMessage.bind(this, socket));
    }

    choicePseudo(socket, pseudo) {
        // vérifie si le pseudo existe déjà dans notre liste d'utilisateur
        if(this.users.find(user => user.pseudo == pseudo)) {
            // Envoi un message d'information de pseudo djà utilisé au socket en cours
            socket.emit('server:user:pseudo_exists');
        }
        else {
            // mémorise dans le so=cket en cours le pseudo de l'utilisateur
            socket.user = new User(socket.id, pseudo);
            // ajoute le pseudo de l'utilisateur à la liste des utilisateurs
            this.users.push(socket.user);
            // Envoi un message d'information de connexion au socket en cours
            socket.emit('server:user:connected');
            // Envoie la liste des utilisateurs à tous les sockets
            this.io.emit('server:user:list', this.users.map(user => user.pseudo));
        }
    }

    disconnectSocket(socket) {
        // si le socket.pseudo existe
        if(socket.user != undefined && socket.user.pseudo != undefined) {
            // On recherche le pseudo dans la liste des utilisateurs
            let index = this.users.findIndex(user => user.pseudo == socket.user.pseudo);
            // si l'index est différent de -1 (-1 = pseudo non trouvé)
            if(index != -1) {
                // on retire  1 élément depuis l'index
                this.users.splice(index,1);
                // On renvoi la liste complete d'utilisateurs à tous les sockets connectés
                this.io.emit('server:user:list', this.users.map(user => user.pseudo));
            }
        }
    }
    receiveMessage(socket, message) {
        let author = socket.user.pseudo;
        let date = new Date();
        let min = date.getMinutes();
        let time = date.getHours() +':'+(min < 10 ? "0"+min : min);
        this.io.emit('server:message:send', { author, time, message });
    }

}
