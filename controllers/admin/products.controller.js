const Products = require("../../models/product.model")

// [GET] /admin/products
module.exports.index = async (req, res) => {
    let filterStatus = [
        {
            name: "Tất cả",
            status : "",
            class : ""
        },
        {
            name: "Hoạt động",
            status : "active",
            class : ""
        },
        {
            name: "Dừng hoạt động",
            status : "inactive",
            class : ""
        }
    ]
    // console.log(req.query.status)
    let find = {
        deleted : false
    }

//(Filter Status) Tính năng lọc trạng thái sản phẩm 
    // Nếu tồn tại query status 
    if (req.query.status){
        find.status = req.query.status;
    } /* <=> find {
            deleted : false,
            status : ["active" - "inactive" - ""]
        }*/
    // Tìm ra vị trí button hiện tại đang active
    if(req.query.status){
        const index = filterStatus.findIndex(item => item.status == req.query.status);
        filterStatus[index].class = "active";
    }else{
        const index = filterStatus.findIndex(item => item.status == "");
        filterStatus[index].class = "active";
    }
// End filerStatus

// Search
    let keyword = "";
    if(req.query.keyword){
        keyword = req.query.keyword;
        const regex = new RegExp(keyword, "i");
        find.title = regex;
    }
// End Search

    const products = await Products.find(find)
    res.render("admin/page/products/index.pug",{
        pageTitle : "Trang products",
        products : products,
        filterStatus : filterStatus,
        keyword:keyword
    })
}