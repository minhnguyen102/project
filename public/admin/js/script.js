// Button Status
const buttonsStatus = document.querySelectorAll("[btn-status]");
var url = new URL(window.location.href);
if(buttonsStatus.length > 0) {
    buttonsStatus.forEach(item => {
        item.addEventListener("click", () => {
            const status = item.getAttribute("btn-status");
            if(status){
                url.searchParams.set("status", status)
            }else{
                url.searchParams.delete("status")
            }
            window.location.href = url.href;
        })
    })
}
// Button Status

// Search
const formSearch = document.querySelector("#form-search");
if(formSearch){

    let url = new URL(window.location.href);

    formSearch.addEventListener("submit", (e) =>{
        e.preventDefault();

        const keyword = e.target.elements.keyword.value;
        // console.log(keyword);
        if(keyword){
            url.searchParams.set("keyword", keyword)
        }else{
            url.searchParams.delete("keyword")
        }
        window.location.href = url.href;
    })
}
// End Search

// Pagination
const buttonsPagination = document.querySelectorAll("[button-pagination]")
if(buttonsPagination){
    buttonsPagination.forEach(buttom => {
        buttom.addEventListener("click", () =>{
            const page = buttom.getAttribute("button-pagination");
            url.searchParams.set("page", page);
            window.location.href = url.href;
        })
    })
}
// End Pagination

// Flash
const showAlert = document.querySelector("[show-alert]");
const closeAlert = document.querySelector("[close-alert]");
if(showAlert){
    const time = parseInt(showAlert.getAttribute("data-time"));
    
    setTimeout(() => {
        showAlert.classList.add("alert-hidden");
    }, time);

    closeAlert.addEventListener("click", () => {
        showAlert.classList.add("alert-hidden");
    })
}
// End Flash

// Upload-image-preview
const uploadImage = document.querySelector("[upload-image]")
if(uploadImage){
    const uploadImageInput = document.querySelector("[upload-image-imput]");
    const uploadImagePreview = document.querySelector("[upload-image-preview]");
    const buttonClose = document.querySelector("#button-close-image")

    uploadImageInput.addEventListener("change", (e) => {
        const [file] =  e.target.files;
        if(file){
            uploadImagePreview.src = URL.createObjectURL(file)
            buttonClose.style.display = "block"
        }
    })
    if(buttonClose){
        buttonClose.addEventListener("click", () => {
            uploadImagePreview.src = "";
            uploadImageInput.value = "";
            buttonClose.style.display = "none"
        })
    }
    
}
// End Upload-image-preview


// Sort
const sort = document.querySelector("[sort]");
if(sort){
    const sortSelect = sort.querySelector("[sort-select]");
    const sortClear = document.querySelector("[sort-clear]");
    const url = new URL(window.location.href);
    
    sortSelect.addEventListener("change", (e) => {
        const value = e.target.value;
        let sortKey, valueKey;
        [sortKey, valueKey] = value.split("-");
        url.searchParams.set("sortKey", sortKey);
        url.searchParams.set("valueKey", valueKey);

        window.location.href = url.href;
    })

    // Button clear
    sortClear.addEventListener("click", (e) => {
        url.searchParams.delete("sortKey");
        url.searchParams.delete("valueKey");
        window.location.href = url.href;
    })
    // End Button clear

    // Selected
    const sortKey = url.searchParams.get("sortKey");
    const valueKey = url.searchParams.get("valueKey");
    const stringSort = `${sortKey}-${valueKey}`;
    const optionSelected = sort.querySelector(`option[value = ${stringSort}]`);
    optionSelected.selected = true;
    // End Selected
}
// End Sort 

