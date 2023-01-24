import User from './User.js'
import { Server } from "socket.io";

export default class ServerChat {

    constructor(server) {
        this.users = [];
        this.io = new Server(server);
        //this.io.on('connection', function(socket) { this.onConnection.bind(this, socket)});
        this.io.on('connection', (socket) => { this.onConnection(socket); } );
    }


    onConnection(socket) {
        console.log(`client ${socket.id} is connected via WebSockets   `);


        // choix du pseudo
        socket.on('client:user:pseudo', this.choicePseudo.bind(this, socket));
        // deconnexion
        socket.on('disconnect', this.disconnected.bind(this,socket));
        socket.on('client:user:disconnect', this.disconnected.bind(this, socket));


    }


    choicePseudo(socket, pseudo) {
        if(this.users.find(user => user.pseudo == pseudo)) {
            socket.emit('server:user:pseudo_exists');
        }
        else {
            socket.user = new User(socket.id, pseudo);
            this.users.push(socket.user);
            socket.emit('server:user:connected');
            this.io.emit('server:user:list', this.users.map(user => user.pseudo));
        }
    }




    disconnected(socket) {
        if(socket.user != undefined && socket.user.pseudo != undefined) {
            let index = this.users.findIndex(user => user.pseudo == socket.user.pseudo);
            if(index != -1) {
                this.users.splice(index,1);
                this.io.emit('server:user:list', this.users.map(user => user.pseudo));
            }
        }
    }
}
