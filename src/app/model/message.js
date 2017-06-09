"use strict";
/**
 * Created by Sanjaya on 10/03/2017.
 */
Object.defineProperty(exports, "__esModule", { value: true });
var Message = (function () {
    function Message(senderId, title, content, time) {
        this.senderId = senderId;
        this.title = title;
        this.content = content;
        this.time = time;
    }
    return Message;
}());
exports.Message = Message;
