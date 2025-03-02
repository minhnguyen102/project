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

// Permissions
const tablePermissions = document.querySelector("[table-permissions]");
if(tablePermissions){
    const buttonSubmit = document.querySelector("[button-submit]");
    // console.log(buttonSubmit);
    buttonSubmit.addEventListener("click", () => {
        const permissions = [];

        const rows = tablePermissions.querySelectorAll("[data-name]");
        rows.forEach(row => {
            const name = row.getAttribute("data-name");
            const inputs = row.querySelectorAll("input");

            if(name == "id"){
                inputs.forEach(input => {
                    const id_permission = input.value;
                    permissions.push({
                        _id : id_permission,
                        permissions : []
                    })
                })
            }else{
                inputs.forEach((input, index) => {
                    const checked = input.checked;
                    if(checked){
                        permissions[index].permissions.push(name);
                    }
                })
            }
        })
        if(permissions.length > 0) {
            const formChangePermissions = document.querySelector("#form-change-permissions");
            const inputPermission = formChangePermissions.querySelector("input");
            console.log(JSON.stringify(permissions));
            inputPermission.value = JSON.stringify(permissions);
            formChangePermissions.submit();
        }
    })
}
// End Permissions

// Permission checked 
const dataRecords = document.querySelector("[data-records]");
if(dataRecords){
    const records = JSON.parse(dataRecords.getAttribute("data-records"));
    const tablePermissions = document.querySelector("[table-permissions]");
    records.forEach((record, index) => {
        const permissions = record.permissions;

        permissions.forEach(permission => {
            const row = tablePermissions.querySelector(`[data-name = "${permission}"]`);
            const input = row.querySelectorAll("input")[index];

            input.checked = true;
        })
    })
}
// End Permission checked