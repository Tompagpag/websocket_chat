const socket = io.connect(document.location.host);


function pseudoChoice(alertPseudo = false)
{
    if(alertPseudo === true) alert(`Choisissez un autre pseudo, celui ci est déjà utilisé !`);

    let user;
    do {
        user = window.prompt(`Choisissez un pseudo`);
    } while(user === '');

    if(user !== null) socket.emit('client:user:pseudo', user);
}

function uiShowChat() {
    document.querySelectorAll('.not_authenticated').forEach((el) => el.classList.add('hide'));
    document.querySelectorAll('.authenticated').forEach((el) => el.classList.remove('hide'));
}

// Ecoutes sur l'interface
document.querySelector("#btnConnect").addEventListener('click', pseudoChoice );


// Ecoutes du serveur
socket.on('server:user:pseudo_exists',() => { pseudoChoice(true); } );
socket.on('server:user:connected',() => { uiShowChat(); } );
