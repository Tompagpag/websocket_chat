
export default class UserInterface {

    listenInterface()
    {
        //----------------------------------------------------------
        // Ecoutes sur l'interface
        //----------------------------------------------------------
        // quand on clique sur le bouton "Se connecter sans s'authentifier"
        document.querySelector("#btnConnect").addEventListener('click', this.pseudoChoice );
        // quand on clique sur le bouton "Se déconnecter"
        document.querySelector("#btnDisconnect").addEventListener('click', this.disconnectUi.bind(this) );
        document.querySelector('#createMessage').addEventListener('keyup', this.messagesUi);
    }

    pseudoChoice(alertPseudo = false)
    {
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

    messagesUi(e) {
        // si l'utilisateur envoi le message (touche entrée)
        if(e.keyCode == 13) {
          let message = document.querySelector('#createMessage').value;
          document.dispatchEvent(new CustomEvent(
              'local:message:send', {detail : { message }}
          ));
          // on vide le champs du message
          document.querySelector('#createMessage').value = '';
      }
    }

    listMessages(message) {
        if ("content" in document.createElement("template")) {
            let template = document.querySelector("#messagesTpl");
            let clone = document.importNode(template.content, true);
            clone.querySelector("td.time").innerHTML = message.time;
            clone.querySelector("td.author").innerHTML = message.author;
            clone.querySelector("td.message").innerHTML = message.message;
            document.querySelector("#listingMessages").appendChild(clone);
        }
      }

}