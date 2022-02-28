"use strict"

const messageSchema = require("../schemas/messageSchema");
const mongoose = require("mongoose")

module.exports = io => {
    io.on("connection", client => {
        console.log("new connection");
        client.on("test", data => {
            console.log(data)
            const ioPass = data.ioPass
            const Message = mongoose.model(`${ioPass}`, messageSchema)

            Message.find({})
                .sort({ createdAt: 1 })
                .then(messages => {
                    client.emit(`${ioPass}:load all messages`, {messages:messages, firstNum:0});
                    client.emit(`${ioPass}:load 50 messages`, {messages:messages, firstNum:(messages.length <= 50)? 0: messages.length - 50})
                });

            client.on(`${ioPass}:message`, data => {
                const messageAttributes = {
                        content: data.content,
                        userName: data.userName,
                        user: data.userId,
                        delete: 0
                    },
                    m = new Message(messageAttributes);
                m.save()
                    .then(() => {
                        Message.findOne(messageAttributes)
                            .then(message => {
                                io.emit(`${ioPass}:message`, message);
                            })
                    })
                    .catch(error => console.log(`error: ${error.message}`));
            });
        })
    });
};
