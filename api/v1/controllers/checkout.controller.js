const Cart = require("../../../models/cart.model")
const Product = require("../../../models/product.model")
const User = require("../../../models/user.model")
const Order = require("../../../models/order.model")
const ProductHelper = require("../../../helpers/product")

// [GET] /checkout
module.exports.index = async (req, res) =>{
    const cartId = req.cookies.cartId;
    const cart = await Cart.findOne({
        _id : cartId
    }).lean()

    if(cart && cart.products.length > 0){
        // Mỗi object sẽ có thêm 2 trường productInfo và totalPrice của 1 object
        for(const item of cart.products){
            const productId = item.product_id;

            let productInfo = await Product.findOne({
                _id : productId
            }).lean().select("-updateBy -createBy")

            if(productInfo){
                productInfo.priceNew = ProductHelper.priceNew(productInfo)
                item.productInfo = productInfo;
                item.totalPrice = item.quantity * productInfo.priceNew;
            }else{
                item.productInfo = null;
                item.totalPrice = 0;
            }
        }
    }

    // đây là totalPrice của cả cái cart
    cart.totalPrice = cart.products.reduce((sum, item) => sum + item.totalPrice, 0)

    res.json({
        code : 200,
        message : "Success",
        cart : cart
    })
}

// [POST] /checkout/order
module.exports.order = async (req, res) =>{ 
    const token_user = req.cookies.tokenUser
    const cartId = req.cookies.cartId;
    const userInfo = req.body;

    const user = await User.findOne({
        tokenUser : token_user
    })
    const user_id = user.id;

    const cart = await Cart.findOne({
        _id : cartId
    })
    let products = []
    for(const product of cart.products ){
        const objectProduct = {
            product_id : product.product_id,
            price : 0,
            discountPercentage : 0,
            quantity : product.quantity
        }
        const productInfo = await Product.findOne({
            _id : product.product_id
        })

        objectProduct.price = productInfo.price;
        objectProduct.discountPercentage = productInfo.discountPercentage;
        products.push(objectProduct);

// Cap nhat lai sp con lai

        const newStock = productInfo.stock - product.quantity;
        await Product.updateOne({
            _id : product.product_id
        },{
            stock : newStock
        })
    }
// End

    const objectOrder = {
        user_id : user_id,
        cart_id :cartId,
        userInfo :userInfo,
        products : products
    }

    const order = new Order(objectOrder);
    await order.save();

    await Cart.updateOne({
        _id : cartId
    },{
        products : []
    })
    
    res.json({
        code : 200,
        message : "Đặt hàng thành công",
        order : order
    })
}

// [GET] /checkout/success/:orderId
module.exports.success = async (req, res) =>{
    const order_id = req.params.orderId;
    const order = await Order.findOne({
        _id : order_id
    }).lean();
    // console.log(order)

    for (const product of order.products){
        const productInfo = await Product.findOne({
            _id : product.product_id
        }).select("title thumbnail");

        product.productInfo = productInfo;
        product.priceNew = ProductHelper.priceNew(product);
        product.totalPrice = product.priceNew * product.quantity;
    }

    order.totalPrice = order.products.reduce((sum, item) => sum + item.totalPrice, 0)

    res.json({
        code : 200,
        message : "Trang đặt hàng thành công",
        order : order
    })
}