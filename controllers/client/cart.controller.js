const Cart = require("../../models/cart.model")

// [POST] /cart/add/:productId
module.exports.addPost = async (req, res) =>{
    const cartId = req.cookies.cartId;
    const product_id = req.params.productId;
    const quantity = parseInt(req.body.quantity);

    // console.log("cartId : ", cartId);
    // console.log("product_id : ", product_id);
    // console.log("quantity : ", quantity);

    const cart = await Cart.findOne({_id : cartId});

    const productExit = cart.products.find(item => item.product_id == product_id)
    if(productExit){
        const newQuantity = quantity + productExit.quantity;
        await Cart.updateOne(
            {_id : cartId, "products.product_id": product_id},
            {$set: { "products.$.quantity": newQuantity }}
        )
        req.flash("success", "Cập nhật số lượng sản phẩm thành công");
    }else{
        const objectCart = {
            product_id : product_id,
            quantity : quantity
        }
        await Cart.updateOne(
            {_id : cartId},
            {
                $push : {products : objectCart}
            }
        )
        req.flash("success", "thêm sản phẩm thành công");
    }    
    
    res.redirect("back")
}