const Cart = require("../../models/cart.model")
module.exports.cardId = async (req, res, next) =>{
    // console.log("Luon chay qua day", req.url);
    if(!req.cookies.cartId){
        // neu chua co cardId
        const cart = new Cart();
        await cart.save();
        // console.log(cart);
        const expires = 1000 * 60  * 60 * 24 * 365;
        res.cookie("cartId", cart.id,{
            expires: new Date(Date.now() + expires)
        })
    }else{
        const cart = await Cart.findOne({
            _id : req.cookies.cartId
        })

        // Mới thêm chỗ này vào khối if này 
        if(cart){
            cart.totalQuantity = cart.products.reduce((sum, item) => sum + item.quantity, 0) // thêm biến totalQuantity vào object cart
            // console.log(cart.totalQuantity);
            // console.log(cart.products.length)
            cart.totalOrder = cart.products.length
    
            res.locals.miniCart = cart;
        }
        // Mới thêm chỗ này vào khối if này 
    }
    next();
}