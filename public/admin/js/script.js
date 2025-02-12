// Button Status
const buttonsStatus = document.querySelectorAll("[btn-status]");
if(buttonsStatus.length > 0) {
    var url = new URL(window.location.href);
    
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