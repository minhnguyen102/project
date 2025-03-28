// Change Status
const buttonsChangeStatus = document.querySelectorAll("[button-change-status]")
if(buttonsChangeStatus.length > 0 ){
    const formChangeStatus = document.querySelector("#form-change-status");
    const dataPath = formChangeStatus.getAttribute("data-path");

    buttonsChangeStatus.forEach((item) => {
        item.addEventListener("click", () => {
            const currentStatus = item.getAttribute("data-status");
            const idItem = item.getAttribute("data-id");
            let newStatus = (currentStatus == "active" ? "inactive" : "active");


            const action = dataPath + `/${newStatus}/${idItem}?_method=PATCH`;
            formChangeStatus.action = action;
            formChangeStatus.submit();
        })
    })
}
// End Change Status

// Change multi
// checkBox
    const checkboxMulti = document.querySelector("[checkbox-multi]")
    if(checkboxMulti){
        const inputCheckAll = document.querySelector("input[name='checkall']")
        const inputsId = document.querySelectorAll("input[name='id']")
        
        // checkAll => all check 
        inputCheckAll.addEventListener("click", () =>{
            if(inputCheckAll.checked){
                inputsId.forEach(item => item.checked = true)
            }else{
                inputsId.forEach(item => item.checked = false)
            }
        })

        // all check => checkAll
        inputsId.forEach((inputId) => {
            inputId.addEventListener("click", () =>{
                const countChecked = checkboxMulti.querySelectorAll("input[name='id']:checked").length;
                (countChecked == inputsId.length ? inputCheckAll.checked = true : inputCheckAll.checked = false);
            })
        })
    }

    const formChangeMulti = document.querySelector("[form-change-multi]")
    if(formChangeMulti){
        formChangeMulti.addEventListener("submit", (e) =>{
            e.preventDefault();
            const checkBoxMulti = document.querySelector("[checkbox-multi]");
            const inputsChecked = checkBoxMulti.querySelectorAll("input[name='id']:checked");
            const typeChange = e.target.elements.type.value;

            if(typeChange == "delete-all"){
                const isConfirm = confirm("Bạn có muốn xóa những sản phẩm này ? ");
                if(!isConfirm){
                    return;
                }
            }
            if(inputsChecked.length > 0){
                let ids = []
                let idsInput = formChangeMulti.querySelector("input[name='ids']");
                inputsChecked.forEach(item => {
                    const id = item.getAttribute("value");
                    ids.push(id);
                })
                idsInput.value = ids.join(",");
                formChangeMulti.submit();
            }else{
                alert("Bạn phải chọn ít nhất một sản phẩm");
            }

        })
    }
// End Change multi

// Delete product
const buttonsDelete = document.querySelectorAll("[button-delete]");
if(buttonsDelete) {
    const formButtonDelete = document.querySelector("#form-button-delete");
    const dataPath = formButtonDelete.getAttribute("data-path");
    buttonsDelete.forEach(buttonDelete => {
        buttonDelete.addEventListener("click", () => {
            const isConfirm = confirm("Bạn muốn xóa sản phẩm này ?");
            if(isConfirm){
                const id = buttonDelete.getAttribute("id-item");
                const action = `${dataPath}/${id}?_method=DELETE`;
                formButtonDelete.action = action;
                formButtonDelete.submit();
            }
        })
    })
}
// End Delete product

