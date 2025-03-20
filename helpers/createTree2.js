let count = 1;
const createTree = (arr, parent_id = "") => {
    if (!Array.isArray(arr)) return [];
    
    const tree = [];
    arr.forEach((item) => {
        // Kiểm tra item có tồn tại và có các thuộc tính cần thiết
        if (!item || typeof item !== 'object') return;
        
        // Chuyển đổi ObjectId thành string nếu cần
        const itemParentId = item.parent_id ? item.parent_id.toString() : "";
        const itemId = item._id ? item._id.toString() : item.id;
        
        if(itemParentId === parent_id){
            count++;
            const newItem = { ...item };
            newItem.index = count;
            const children = createTree(arr, itemId);
            if(children.length > 0){
                newItem.children = children;
            }
            tree.push(newItem)
        }
    })
    return tree;
}

module.exports.tree = (arr, parent_id = "") => {
    count = 0;
    const tree = createTree(arr, parent_id);
    return tree;
}