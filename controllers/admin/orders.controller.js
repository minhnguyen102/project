const Order = require("../../models/order.model")
const Product = require("../../models/product.model")
const productHelper = require("../../helpers/product")

// [GET] /admin/order/index
module.exports.index = async (req, res) => {

    const orders = await Order.find({
        accept : false
    });
    for(const order of orders){
        for(const item of order.products){
            item.totalPrice = productHelper.priceNew(item) * item.quantity;
        }
        order.totalPrice = order.products.reduce((sum, item) => sum + item.totalPrice, 0)
    }

    const countOrderAccept = await Order.countDocuments({
        accept : true
    })

    res.render('admin/page/orders/index', {
        pageTitle : "Trang danh sách đơn hàng",
        orders : orders,
        countOrderAccept : countOrderAccept
    });
}

// [GET] /admin/detail/:orderId
module.exports.detail = async (req, res) => {
    // console.log(req.params.orderId);
    const order = await Order.findOne({
        _id : req.params.orderId
    })
    
    for(const item of order.products){
        item.priceNew = productHelper.priceNew(item);
        item.totalPrice = item.priceNew * item.quantity;
        const productId = item.product_id;
        const productInfo = await Product.findOne({
            _id : productId,
            deleted : false,
            status : "active"
        })
        item.productInfo = productInfo;
    }
    order.totalPrice = order.products.reduce((sum, item) => sum + item.totalPrice, 0);

    res.render('admin/page/orders/detail', {
        pageTitle : "Chi tiết đơn hàng",
        order : order
    });
}

// [GET] /admin/orders/accept
module.exports.accept = async(req, res) =>{
    const ordersAccept = await Order.find({
        accept : true
    })

    for(const orderAccept of ordersAccept){
        for(const item of orderAccept.products){
            item.totalPrice = productHelper.priceNew(item) * item.quantity;
        }
        orderAccept.totalPrice = orderAccept.products.reduce((sum, item) => sum + item.totalPrice, 0)
    }

    res.render('admin/page/orders/accept', {
        pageTitle : "Trang danh sách đơn hàng đã xác nhận",
        ordersAccept : ordersAccept,
    })
}


// [POST] /admin/orders/accept
module.exports.acceptPost = async (req, res) => {
    const orderId = req.body.accept
    if(orderId){
        await Order.updateOne(
            {_id : orderId},
            {accept : true}
        )
    }
    res.redirect("back")
}