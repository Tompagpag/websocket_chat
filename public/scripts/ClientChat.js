import UI from './UserInterface.js';

export default class ClientChat {
    constructor() {
        this.socket = io.connect(document.location.host);
        this.UI = new UI();
        this.listenServer();
        this.transmitUiServer();
        this.UI.listenInterface();
    }

    //----------------------------------------------------------
    // Ecoutes du serveur
    //----------------------------------------------------------
    listenServer() {
        // Ecoute le retour de pseudo existant
        this.socket.on('server:user:pseudo_exists', () => { this.UI.pseudoChoice(true); } );
        // Ecoute le retour de connexion validée
        this.socket.on('server:user:connected', () => { this.UI.uiShowChat(); } );
        // Ecoute le retour de la liste complete des utilisateurs
        // socket.on('server:user:list', (users) => this.UI.listingUsers(users)); // (equivalent à la ligne ci dessous)
        this.socket.on('server:user:list', this.UI.listingUsers);
    }

    //----------------------------------------------------------
    // Ecouteur d'évènements locaux (CustomEvent)
    //----------------------------------------------------------
    transmitUiServer() {
        document.addEventListener('local:user:pseudo', (e) => {
            this.socket.emit('client:user:pseudo', e.detail.user);
        });

        document.addEventListener('local:user:ui_disconnect', (e) => {
            this.socket.emit('client:user:ui_disconnect');
        });
    }
}
