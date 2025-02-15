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
