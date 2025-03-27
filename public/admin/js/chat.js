import * as Popper from 'https://cdn.jsdelivr.net/npm/@popperjs/core@^2/dist/esm/index.js'

// CLIENT_SEND_MESSAGE
const formSendMessage = document.querySelector(".chat .inner-form");
if (formSendMessage) {
    formSendMessage.addEventListener("submit", (e) => {
        e.preventDefault();
        const content = e.target.elements.content.value;
        if (content) {
            socket.emit("CLIENT_SEND_MESSAGE", content);
            e.target.elements.content.value = "";
            socket.emit("CLIENT_SEND_TYPING", "hidden")
            bodyChat.scrollTop = bodyChat.scrollHeight;
        }
    })
}
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
        const listTyping = document.querySelector(".chat .inner-body .inner-list-typing");
        // bodyChat.appendChild(div);
        bodyChat.insertBefore(div, listTyping)

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

// showTyping
var timeOut;
const showTyping = () => {
    socket.emit("CLIENT_SEND_TYPING", "show")

    clearTimeout(timeOut);
    // trong quá trinh gõ => song song với việc hàm emit được gọi thì đồng thời cũng có nhiều hàm timeout sinh ra
    // gán vào 1 biến time out, clear nó liên tục khi ta vẫn đang gõ 
    // khi ta khong gõ nữa sau 3s => không có clear timeout nào trước đó cả => hàm setTimeout cuối cùng sẽ được gọi mà khong bị xóa
    timeOut = setTimeout(() => {
        socket.emit("CLIENT_SEND_TYPING", "hidden")
    }, 3000);
}
//End showTyping

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

        const end = inputContent.value.length;
        inputContent.setSelectionRange(end, end);
        inputContent.focus();
        showTyping();

    });

    inputContent.addEventListener("keyup", () => {
        showTyping();
    })
}
// End emoji-picker

// SEVER_RETURN_TYPING
const listTyping = document.querySelector(".chat .inner-body .inner-list-typing");
if (listTyping) {
    socket.on("SERVER_RETURN_TYPING", (data) => {
        // bắt sự kiện => lấy ra danh sách người đang gõ => thêm typing vào
        if (data.type == "show") {
            const exitTyping = listTyping.querySelector(`[user-id = "${data.user_id}"]`);

            if (!exitTyping) {
                const boxTyping = document.createElement("div");
                boxTyping.classList.add("box-typing")
                boxTyping.setAttribute("user-id", data.user_id)

                boxTyping.innerHTML =
                    `
                        <div class="inner-name">${data.fullname}</div>
                        <div class="inner-dots">
                            <span> </span>
                            <span> </span>
                            <span> </span>
                        </div>
                    `;

                listTyping.appendChild(boxTyping)
                bodyChat.scrollTop = bodyChat.scrollHeight;
            }
        } else { // hidden
            const boxTypingRemove = listTyping.querySelector(`[user-id = "${data.user_id}"]`);
            if (boxTypingRemove) {
                listTyping.removeChild(boxTypingRemove)
            }
        }

    })
}
// END SEVER_RETURN_TYPING

// FileUploadWithPreview
// const upload = new FileUploadWithPreview.FileUploadWithPreview('my-unique-id');
// if(upload){
//     console.log(upload.cachedFileArray)
// }
// End FileUploadWithPreview