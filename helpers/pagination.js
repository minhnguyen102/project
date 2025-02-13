module.exports = (query, totalProduct) => {
    let objectPagination = {
        limitItem : 5,
        currentPage : 1,
    }

    if(query.page){
        objectPagination.currentPage = parseInt(query.page);
        objectPagination.skip = (objectPagination.currentPage - 1) * objectPagination.limitItem;
        // const totalProduct = await Products.countDocuments(find);
        const totalPage = Math.ceil(totalProduct / objectPagination.limitItem);
        objectPagination.totalPage = totalPage;
    }
    return objectPagination;
}