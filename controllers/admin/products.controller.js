const Products = require("../../models/product.model")
const filterStatusHelper = require("../../helpers/filterStatus")
const searchHelper = require("../../helpers/search")
const paginationHelper = require("../../helpers/pagination")


// [GET] /admin/products
module.exports.index = async (req, res) => {
    let find = {
        deleted : false
    }
//(Filter Status) Tính năng lọc trạng thái sản phẩm 
    if (req.query.status){
        find.status = req.query.status;
    }
    const filterStatus = filterStatusHelper(req.query)
// End filerStatus

// Search
    const objectSearch = searchHelper(req.query);
    if(objectSearch.regex){
        find.title = objectSearch.regex;
    }
// End Search

// Pagination
    const totalProduct = await Products.countDocuments(find);
    let objectPagination = paginationHelper(
        {
            limitItem : 5, // tránh truyền cứng số 5 khi ứng dụng vào các trang khác 
            currentPage : 1,
        },
        req.query, totalProduct);
// End Pagination

    const products = await Products.find(find)
                            .sort({position : "desc"})
                            .limit(objectPagination.limitItem)
                            .skip(objectPagination.skip)

    res.render("admin/page/products/index.pug",{
        pageTitle : "Trang products",
        products : products,
        filterStatus : filterStatus,
        keyword : objectSearch.keyword,
        objectPagination : objectPagination
    })
}

// [PATCH] /admin/products/change-status/:status/:id
module.exports.changeStatus = async (req, res) => {
    const status = req.params.status;
    const id = req.params.id;
    await Products.updateOne({_id : id}, {status : status});
    req.flash("success", "Thay đổi trạng thái sản phẩm thành công")
    res.redirect('back');
}

// [PATCH] /admin/products/change-multi
module.exports.changeMulti = async (req, res) => {
    const type = req.body.type;
    const ids = req.body.ids.split(",");
    switch(type){
        case "active":
            await Products.updateMany(
                { _id : {$in : ids} },
                { $set: {status : type} },
            )
            req.flash("success", `Cập nhật thành công trạng thái ${ids.length} sản phẩm`);
            break;
        case "inactive":
            await Products.updateMany(
                { _id : {$in : ids} },
                { $set : {status : type} },
            )
            req.flash("success", `Cập nhật thành công trạng thái ${ids.length} sản phẩm`);
            break;
        case "delete-all":
            await Products.updateMany(
                { _id : {$in : ids} },
                { $set : {
                    deleted : true,
                    deleteAt : new Date()
                } },
            )
            req.flash("success", `Xóa thành công ${ids.length} sản phẩm`);
            break;
        default:
            break;
    }
    res.redirect("back");
}
    
// [DELETE] /admin/products/delete/:id
module.exports.deleteItem = async (req, res) => {
    const id = req.params.id;
    await Products.updateOne(
        {_id : id},
        {deleted : true},
    )
    req.flash("Success", "Xóa sản phẩm thành công.")
    res.redirect("back");
} 

// [GET] /admin/products/create
module.exports.create = (req, res) => {
    res.render("admin/page/products/create.pug");
}

// [POST] /admin/products/create
module.exports.createPost = async (req, res) => {
    req.body.price = parseInt(req.body.price);
    req.body.discountPercentage = parseInt(req.body.discountPercentage);
    req.body.stock = parseInt(req.body.stock);

    const positon = req.body.position;
    if(positon == ""){
        const count = await Products.countDocuments();
        req.body.position = count + 1;
    }else{
        req.body.position = parseInt(positon);
    }

    const product = new Products(req.body);
    product.save();

    res.redirect(`/admin/products`)
}