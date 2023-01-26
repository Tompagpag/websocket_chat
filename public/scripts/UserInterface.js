
export default class UserInterface {

    constructor() {
      this.typing = false;
    }

    listenInterface() {
        //----------------------------------------------------------
        // Ecoutes sur l'interface
        //----------------------------------------------------------
        // quand on clique sur le bouton "Se connecter sans s'authentifier"
        document.querySelector("#btnConnect").addEventListener('click', this.pseudoChoice );
        // document.querySelector("#btnDirectName").addEventListener('click', this.pseudoChoice2);

        // quand on soumet un message
        document.querySelector('#createMessage').addEventListener('keyup', this.sendMessage);

        // quand on clique sur le bouton "Se déconnecter"
        document.querySelector("#btnDisconnect").addEventListener('click', this.disconnectUi.bind(this) );
    }

    sendMessage(e) {
        // si l'utilisateur envoi le message (touche entrée)
        if(e.keyCode == 13) {
            let message = document.querySelector('#createMessage').value;
            document.dispatchEvent(new CustomEvent('local:message:send', {detail :{message}}));
            // on vide le champs du message
            document.querySelector('#createMessage').value = '';
            // l'utilisateur arrête la saisie
            this.typing = false;
            window.clearTimeout(this.timerTyping);
            document.dispatchEvent(new CustomEvent('local:message:typing', {detail : { status : this.typing }}));
        } else {
            if(this.typing !== true) {
                this.typing = true;
                document.dispatchEvent(new CustomEvent('local:message:typing', {detail : { status : this.typing }}));

            } else {
                // sinon on supprime le précédent timer
                window.clearTimeout(this.timerTyping);
            }
            // on crée un nouveau timer au bout de 3 secondes on changera le statut à false
            this.timerTyping = window.setTimeout(() => {
                this.typing = false;
                document.dispatchEvent(new CustomEvent('local:message:typing', {detail : { status : this.typing }}));
            }, 3000);
        }
    }

    listMessages(messages, clean = false) {
      if(clean) document.querySelector("#listingMessages").innerHTML = '';
      if ("content" in document.createElement("template")) {
          let template = document.querySelector("#messagesTpl");
          messages.forEach((message) => {
              let clone = document.importNode(template.content, true);
              clone.querySelector("td.time").innerHTML = message.time;
              clone.querySelector("td.author").innerHTML = message.author;
              clone.querySelector("td.message").innerHTML = message.message;
              document.querySelector("#listingMessages").appendChild(clone);
            });
        }
    }

    // pseudoChoice2(e) {
    //     let user = document.querySelector('#directName').value;
    //     if(user !== '')  {
    //         document.dispatchEvent(new CustomEvent('local:user:pseudo', {detail : { user }}));
    //     }
    // }

    pseudoChoice(alertPseudo = false) {
        if(alertPseudo === true) alert(`Choisissez un autre pseudo, celui ci est déjà utilisé !`);

        let user;
        do {
            user = window.prompt(`Choisissez un pseudo`);
        } while(user === '');

        if(user !== null)  {
            document.dispatchEvent(new CustomEvent('local:user:pseudo', {detail : { user }}));
            // socket.emit('client:user:pseudo', user);
        }
    }

    // Gestion de l'affichage de l'interface
    uiShowChat(show = true) {
        // Si on est connecté
        if(show) {
            // on cache la zone de "connexion"
            document.querySelectorAll('.not_authenticated').forEach((el) => el.classList.add('hide'));
            // on cache la zone de "chat"
            document.querySelectorAll('.authenticated').forEach((el) => el.classList.remove('hide'));
        }
        else {
            // on cache la zone de "chat"
            document.querySelectorAll('.not_authenticated').forEach((el) => el.classList.remove('hide'));
            // on cache la zone de "connexion"
            document.querySelectorAll('.authenticated').forEach((el) => el.classList.add('hide'));
        }
    }


    // déconnexion
    disconnectUi() {
        // on envoie l'information de déconnexion au serveur WebSocket
        document.dispatchEvent(new CustomEvent('local:user:ui_disconnect'));
        // On modifie l'interface
        this.uiShowChat(false);
    }


    listingUsers(users) {
        document.querySelector("#listingUsers").innerHTML = "";
        if ("content" in document.createElement("template")) {
            let template = document.querySelector("#usersTpl");
            users.forEach(pseudo => {
                let clone = document.importNode(template.content, true);
                clone.querySelector("li").innerText = pseudo;
                document.querySelector("#listingUsers").appendChild(clone);
            });
        }
    }

    listingChannels(channels) {
        document.querySelector("#listingChannels").innerHTML = "";
        if ("content" in document.createElement("template")) {
           let template = document.querySelector("#channelsTpl");
           channels.forEach(name => {
               let clone = document.importNode(template.content, true);
               clone.querySelector("li").innerText = name;
               document.querySelector("#listingChannels").appendChild(clone);
            });
            // par défaut on est sur le salon Général
            document.querySelector('#listingChannels li').classList.add('active');
            this.listenChannelChange();
        }
    }

    listenChannelChange()  {
        document.querySelectorAll('#listingChannels li').forEach((element) => {
            element.addEventListener('click', (e) => {
                let channel = e.currentTarget.textContent;
                document.querySelectorAll('#listingChannels li').forEach(el => el.classList.remove('active'));
                e.currentTarget.classList.add('active');
                document.dispatchEvent(new CustomEvent(
                    'local:channel:change', {detail : { channel }}
                ));
            })
        });
    }

    listUsersTyping(users) {
        document.querySelector("#typingUsers").innerHTML = '';
        if(users.length > 0) {
            document.querySelector("#typingUsers").innerHTML = `${users.join(', ')} ${(users.length > 1 ? " sont" :  " est")} en train d'écrire`;
        }
    }

}
