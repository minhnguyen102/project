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
    }
    next();
}