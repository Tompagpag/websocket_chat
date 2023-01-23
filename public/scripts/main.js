const button = document.querySelector("button");
const socket = io.connect(document.location.host);

button.addEventListener('click', (e) => {
  socket.emit('message',`Message test pour le serveur`);
})
