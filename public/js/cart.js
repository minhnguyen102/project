console.log("Ok")

// CẬp nhật số lượng sản phầm trong gỉo hàng
const inputsQuantity = document.querySelectorAll("input[name='quantity']")
// console.log(inputsQuantity)

if(inputsQuantity.length > 0){
    inputsQuantity.forEach(input => {
        input.addEventListener("change", (e) =>{
            const productId = input.getAttribute("item-id")
            const quantity = parseInt(input.value)

            if (quantity > 1){
                window.location.href = `/cart/update/${productId}/${quantity}`;
            }
        })
    })
}
// End CẬp nhật số lượng sản phầm trong gỉo hàng