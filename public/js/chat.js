$(document).ready(() => {
    const socket = io({comment:"hello"})

    const category = $("#chat_category").val()
    const thread = $("#chat_thread").val()
    const ioPass = `${category}-${thread}`

    let viewNum = 0

    socket.emit("test", {ioPass: ioPass})

    $("#chat_form").submit(() => {
        const text = $("#chat_input").val()
        const userName = $("#chat_user_name").val()
        const userId = $("#chat_user_id").val()

        $("#chat_input").val('')

        socket.emit(`${ioPass}:message`, {
            content: text,
            userName: userName,
            userId: userId
        })

        $("#chat_input").val("")
        return false
    })

    $("#new_message")
        .fadeOut(0)

    socket.on(`${ioPass}:message`, message => {
        displayMessage(message)
        for (let i = 0; i < 2; i++) {
            $("#new_message")
                .fadeIn(200)
                .fadeOut(200)
        }
    })

    socket.on(`${ioPass}:load all messages`, data => {
        data.messages.forEach(message => {
            displayMessage(message)
        })
    })

    $("#view_all").click(() => {
        for (let i = 0; i < viewNum + 1; i++) {
            $(`#${i}`).css({visibility:"visible", position: "initial"})
        }
    })

    $("#view_50").click(() => {
        for (let i = 0; i < viewNum - 50; i++) {
            $(`#${i}`).css({visibility:"collapse", position: "absolute"})
        }
    })

    const displayMessage = message => {
        viewNum = viewNum + 1
        $("#chat").append(
            $(`<div class='messages' id="${viewNum}">`).html(`
				<strong class="message ${getCurrentUserClass(message.user)}">
					${viewNum} : ${message.userName}
				</strong><br/>
				${getMessage(message)}
                ${getDeleteButton(message)}
			`)
        )
    }

    const getCurrentUserClass = id => {
        const userId = $("#chat_user_id").val()
        return userId === id ? "your_message" : ""
    }

    const getMessage = message => {
        let messageContent = ''
        if (message.delete === 0) {
            messageContent = message.content
        } else if (message.delete === 1) {
            messageContent = "スレッド作成者に削除されました。"
        } else {
            messageContent = "投稿者に削除されました。"
        }
        return messageContent.replace(/\n/g, "<br/>")
    }

    const getDeleteButton = message => {
        if (message.delete !== 0) return ""
        const userId = $("#chat_user_id").val() ? $("#chat_user_id").val(): "unnko"
        const threadCreaterId = $("#thread_creater").val()
        const category = $("#chat_category").val()
        const thread = $("#chat_thread").val()
        if (userId === message.user || threadCreaterId === userId) {
            return "" +
                `<form class='delete_message_div' name='${message._id}' method='POST' action='/${category}/${thread}/delete/${message._id}'>` +
                `   <a type="submit" class='delete_message' onclick='document["${message._id}"].submit();'>` +
                "   Delete" +
                "   </a>" +
                "</form>"
        } else {
            return ""
        }
    }
})
