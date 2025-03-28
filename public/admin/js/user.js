// Chức năng gửi yêu cầu 
const bntsAddfirend = document.querySelectorAll("[btn-add-friend]");
if(bntsAddfirend.length > 0) {
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
if(btnsCancelFriend.length > 0){
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
