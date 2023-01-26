export default class Message {
    constructor(author, message) {
        this.message = message;
        this.author = author;
        this.time = this.getTime();
    }


    getTime() {
        let date = new Date();
        let min = date.getMinutes();
        return date.getHours() +':'+(min < 10 ? "0"+min : min);
    }
}
