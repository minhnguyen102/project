// Chức năng gửi yêu cầu 
const bntsAddfirend = document.querySelectorAll("[btn-add-friend]");
if (bntsAddfirend.length > 0) {
    bntsAddfirend.forEach(btn => {
        btn.addEventListener("click", () => {
            // lấy ra userId + hiển thị nút hủy
            btn.closest(".box-user").classList.add("add")
            const userId = btn.getAttribute("btn-add-friend")

            // tạo 1 sự kiện emit => gửi lên sever id của người muốn kết bạn
            socket.emit("CLIENT_ADD_FRIEND", userId);
        })
    });
}
// End Chức năng gửi yêu cầu 

// Chức năng hủy yêu cầu 
const btnsCancelFriend = document.querySelectorAll("[btn-cancel-friend]")
if (btnsCancelFriend.length > 0) {
    btnsCancelFriend.forEach(btn => {
        btn.addEventListener("click", () => {
            //Ẩn đi khối +  lấy ra userId
            btn.closest(".box-user").classList.remove("add")
            const userId = btn.getAttribute("btn-cancel-friend");

            // tạo sự kiện gửi lên sever userId
            socket.emit("CLIENT_CANCEL_FRIEND", userId);
            console.log("oke")
        })
    })
}
// End Chức năng hủy yêu cầu 

// Chức năng từ chối kết bạn
const btnsRefuseFriend = document.querySelectorAll("[btn-refuse-friend]")
if (btnsRefuseFriend.length > 0) {
    btnsRefuseFriend.forEach(btn => {
        btn.addEventListener("click", () => {
            //Ẩn đi khối +  lấy ra userId
            btn.closest(".box-user").classList.add("refuse")
            const userId = btn.getAttribute("btn-refuse-friend");

            // tạo sự kiện gửi lên sever userId
            socket.emit("CLIENT_REFUSE_FRIEND", userId);
            console.log("oke")
        })
    })
}
// End Chức năng từ chối kết bạn

// Chức năng đồng ý kết bạn
const btnsAcceptFriend = document.querySelectorAll("[btn-accept-friend]")
if (btnsAcceptFriend.length > 0) {
    btnsAcceptFriend.forEach(btn => {
        btn.addEventListener("click", () => {
            //Ẩn đi khối +  lấy ra userId
            btn.closest(".box-user").classList.add("accepted")
            const userId = btn.getAttribute("btn-accept-friend");

            // tạo sự kiện gửi lên sever userId
            socket.emit("CLIENT_ACCEPT_FRIEND", userId);
            console.log("oke")
        })
    })
}
// End Chức năng đồng ý kết bạn

// SERVER_RETURN_LENGTH_ACCPET_FRIEND
socket.on("SERVER_RETURN_LENGTH_ACCPET_FRIEND", (data) => {
    // console.log(data); // thông tin của người được gửi kết bạn
    // Hiển thị số 1 ra ngoài giao diện của user có với điều kiệu trung id => update đúng người
    const {
        lengthAcceptFriendsOfB,
        userId
    } = data;
    const badgeUsersAccept = document.querySelector("[badge-users-accept]")
    const checkUserId = badgeUsersAccept.getAttribute("badge-users-accept")
    if (checkUserId == userId) {
        badgeUsersAccept.innerHTML = lengthAcceptFriendsOfB;
    }
})
// END SERVER_RETURN_LENGTH_ACCPET_FRIEND

// SERVER_RETURN_LENGTH_CANCEL_FRIEND
socket.on("SERVER_RETURN_LENGTH_CANCEL_FRIEND", (data) => {
    // console.log(data); // thông tin của người được gửi kết bạn
    // Hiển thị số 1 ra ngoài giao diện của user có với điều kiệu trung id => update đúng người
    const {
        lengthAcceptFriendsOfB,
        userId
    } = data;
    const badgeUsersAccept = document.querySelector("[badge-users-accept]")
    const checkUserId = badgeUsersAccept.getAttribute("badge-users-accept")
    if (checkUserId == userId) {
        badgeUsersAccept.innerHTML = lengthAcceptFriendsOfB;
    }
})
// END SERVER_RETURN_LENGTH_CANCEL_FRIEND

// SERVER_RETURN_INFO_ACCPET_FRIEND
socket.on("SERVER_RETURN_INFO_ACCPET_FRIEND", (data) => {
    const dataUsersAccept = document.querySelector("[data-users-accept]")
    const check = dataUsersAccept.getAttribute("data-users-accept")
    // lấy thông tin người gửi lời mới đến
    const infoUser = data.infoUserA
    const userId = data.userId

    if (check == userId) {
        //tạo ra thẻ để insert thông tin đó vào 
        const newBoxUser = document.createElement("div");
        newBoxUser.classList.add("col-6");
        newBoxUser.innerHTML = `
            <div class="box-user">
                <div class="inner-avatar">
                    <img src=${infoUser.avatar} alt=${infoUser.fullname}>
                </div>
                <div class="inner-infor">
                    <div class="inner-name">${infoUser.fullname}</div>
                    <div class="inner-buttons">
                        <button class="btn btn-sm btn-success mr-2" btn-accept-friend=${infoUser._id}>Chấp nhận</button>
                        <button class="btn btn-sm btn-danger mr-2" btn-refuse-friend=${infoUser._id}>Từ chối</button>
                        <button class="btn btn-sm btn-danger mr-2" btn-deleted-friend="btn-deleted-friend" disabled="disabled">Đã xóa</button>
                        <button class="btn btn-sm btn-success mr-2" btn-accepted-friend="btn-accepted-friend" disabled="disabled">Đã chấp nhận</button>
                    </div>
                </div>
            </div>
            `

        dataUsersAccept.appendChild(newBoxUser);


        // Làm lại sự kiện xóa => vì đây là nút xóa mới
        const buttonsRefuseFriend = document.querySelectorAll("[btn-refuse-friend]")
        if(buttonsRefuseFriend.length > 0){
            buttonsRefuseFriend.forEach(btn => {
                btn.addEventListener("click", () => {
                    //Ẩn đi khối +  lấy ra userId
                    btn.closest(".box-user").classList.add("refuse")
                    const userId = btn.getAttribute("btn-refuse-friend");
        
                    // tạo sự kiện gửi lên sever userId
                    socket.emit("CLIENT_REFUSE_FRIEND", userId);
                })
            })
        }

        // Làm lại sự kiện chấp nhận => vì đây là nút chấp nhận mới
        const buttonsAcceptFriend = document.querySelectorAll("[btn-accept-friend]")
        if(buttonsAcceptFriend.length > 0){
            buttonsAcceptFriend.forEach(btn => {
                btn.addEventListener("click", () => {
                    //Ẩn đi khối +  lấy ra userId
                    btn.closest(".box-user").classList.add("accepted")
                    const userId = btn.getAttribute("btn-accept-friend");
        
                    // tạo sự kiện gửi lên sever userId
                    socket.emit("CLIENT_ACCEPT_FRIEND", userId);
                })
            })
        }
    }

})
// END SERVER_RETURN_INFO_ACCPET_FRIEND