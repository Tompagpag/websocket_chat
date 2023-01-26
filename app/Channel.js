export default class Channel {
    constructor(name) {
        this.name = name;
        this.messages = [];
    }


    addMessage(message) {
        // on limite à 100 messages par channel
        while(this.messages.length >= 100) {
            this.messages.shift();
        }
        this.messages.push(message);
    }

}
