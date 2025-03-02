const buttonsDelete = document.querySelectorAll("[button-delete]");
if(buttonsDelete.length > 0){
    const formDeleteItem = document.querySelector("#form-button-delete");
    const path = formDeleteItem.getAttribute("data-path");

    buttonsDelete.forEach(buttonDelete => {
        buttonDelete.addEventListener("click", () => {
            const confirmDelete = confirm("Bạn chắc chắn muốn xóa danh mục này ?");
            if(confirmDelete){
                const id = buttonDelete.getAttribute("id-item");
                const action = `${path}/${id}?_method=DELETE`;
                formDeleteItem.action = action;
                formDeleteItem.submit();
            }
        })
    })
}