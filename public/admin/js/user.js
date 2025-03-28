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