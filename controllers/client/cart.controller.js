const Cart = require("../../models/cart.model")
const Product = require("../../models/product.model");
const ProductHelper = require("../../helpers/product")

// [GET] /cart/
module.exports.index = async (req, res) =>{
    const cartId = req.cookies.cartId;

    const cart = await Cart.findOne({
        _id : cartId
    })

    if(cart.products.length > 0){
        // Mỗi object sẽ có thêm 2 trường productInfo và totalPrice của 1 object
        for(const item of cart.products){
            const productId = item.product_id;

            let productInfo = await Product.findOne({
                _id : productId
            })
            productInfo.priceNew = ProductHelper.priceNew(productInfo)
            item.productInfo = productInfo;
            item.totalPrice = item.quantity * productInfo.priceNew;
        }
    }

    // đây là totalPrice của cả cái cart
    cart.totalPrice = cart.products.reduce((sum, item) => sum + item.totalPrice, 0)

    res.render('client/pages/cart/index', {
        pageTitle : "Trang giỏ hàng",
        cartDetail : cart
    });
}

// [POST] /cart/add/:productId
module.exports.addPost = async (req, res) =>{
    const cartId = req.cookies.cartId;
    const product_id = req.params.productId;
    const quantity = parseInt(req.body.quantity);
    
    const cart = await Cart.findOne({_id : cartId});
    console.log(cart)

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

// [GET] /cart/delete/:productId
module.exports.delete = async (req, res) =>{
    const productId = req.params.productId;
    const cartId = req.cookies.cartId;

    await Cart.updateOne(
        { _id : cartId }, 
        { "$pull": { products: { "product_id": productId }}}
    );

    req.flash('success', `Xóa sản phẩm thành công`);
    res.redirect(`back`)
}

// [GET] /cart/update/:productId/:quantity
module.exports.update = async (req, res) =>{
    const cartId = req.cookies.cartId;
    const productId = req.params.productId;
    const quantity = req.params.quantity;

    // const updateCorrect = 
    const product = await Product.findOne({_id : productId});
    const stock = product.stock;
    if(quantity > stock){
        req.flash("error", "Vượt quá số lượng còn lại")
    }else{
        await Cart.updateOne({
            _id : cartId,
            'products.product_id' : productId
        },{
            'products.$.quantity' : quantity
        })    
    
        req.flash('success', `Cập nhật số lượng sản phẩm thành công`);
    }
    res.redirect(`back`)
}




// delete bản ghi rác (Cân nhắc khi sử dụng đoạn này)
module.exports.deleteCart = async (req, res) =>{
    const carts = await Cart.find() 
    for (const cart of carts) {
        if(cart.products.length == 0){
            const cart_id = cart.id;
            res.clearCookie("cartId");
            await Cart.deleteOne({_id : cart_id})
        }
    }
    res.redirect("back")
}