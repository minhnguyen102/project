const productsCategory = require("../models/productsCategory.model")
 
 module.exports.getSubCategory = async (parentId) => {
    const getCategory = async (parentId) => {
        const subs = await productsCategory.find({
            parent_id : parentId,
            status : "active",
            deleted : false
        })
    
        let allSub = [...subs];
    
        for(const sub of subs) {
            const childs = await getCategory(sub.id);
            allSub = allSub.concat(childs); // Nếu phần tử được duyệt có các danh mục con thì thêm các danh mục ấy vào sau mảng và tiếp tục duyệt
        }
    
        return allSub;
    }
 
    const result = await getCategory(parentId);
    return result;
 }