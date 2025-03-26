import * as Popper from 'https://cdn.jsdelivr.net/npm/@popperjs/core@^2/dist/esm/index.js'

// CLIENT_SEND_MESSAGE
const formSendMessage = document.querySelector(".chat .inner-form");
formSendMessage.addEventListener("submit", (e) => {
    e.preventDefault();
    const content = e.target.elements.content.value;
    if (content) {
        socket.emit("CLIENT_SEND_MESSAGE", content);
        e.target.elements.content.value = "";
    }
})
// END CLIENT_SEND_MESSAGE

// SERVER_RETURN_MESSAGE
socket.on("SERVER_RETURN_MESSAGE", (data) => {
    if (data) {
        const bodyChat = document.querySelector(".chat .inner-body"); // sau sẽ từ bodyChat.appendChild
        const my_id = document.querySelector("[my-id]").getAttribute("my-id");
        let htmlFullName = ""

        const div = document.createElement("div");
        if (my_id == data.user_id) {
            div.classList.add("inner-outgoing")
        } else {
            div.classList.add("inner-comming")
            htmlFullName = `<div class="inner-name">${data.fullname}</div>`
        }

        div.innerHTML = `
            ${htmlFullName}
            <div class="inner-content">${data.content}</div>
        `
        bodyChat.appendChild(div);
        bodyChat.scrollTop = bodyChat.scrollHeight;
    }
})
// END SERVER_RETURN_MESSAGE

// Scroll
const bodyChat = document.querySelector(".chat .inner-body");
if (bodyChat) {
    bodyChat.scrollTop = bodyChat.scrollHeight;
}
// End Scroll

// emoji-picker
const buttonIcon = document.querySelector(".chat .inner-form .btn-icon")
if (buttonIcon) {
    const tooltip = document.querySelector('.tooltip')
    Popper.createPopper(buttonIcon, tooltip)

    buttonIcon.onclick = () => {
        tooltip.classList.toggle('shown')
    }
}


const emojiPicker = document.querySelector('emoji-picker');
if (emojiPicker) {
    const inputContent = document.querySelector(".chat input[name='content']");
    emojiPicker.addEventListener('emoji-click', (event) => {
        const icont = event.detail.unicode;
        inputContent.value += icont;
    });

}

// end emoji-picker