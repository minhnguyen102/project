const formAccept = document.querySelector("#form-accept")
if (formAccept) {
    const buttonsAccess = document.querySelectorAll("[button-access]")
    const inputForm = formAccept.querySelector("input");
    buttonsAccess.forEach((button) => {
        const idItem = button.getAttribute("id-item");
        button.addEventListener("click", () => {
            const isConfirm = confirm("Bạn muốn xác nhận đơn hàng này ?")
            if (confirm) {
                console.log(idItem);
                inputForm.value = idItem
                formAccept.submit();
            }
        })
    })
}