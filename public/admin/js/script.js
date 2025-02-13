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
    formSearch.addEventListener("submit", (e) =>{
        e.preventDefault();
        // console.log(e.target.elements.keyword.value);

        const keyword = e.target.elements.keyword.value;
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
