module.exports = (objectPagination, query, totalProduct) => {
    if(query.page){
        objectPagination.currentPage = parseInt(query.page);
    }
    objectPagination.skip = (objectPagination.currentPage - 1) * objectPagination.limitItem;
    const totalPage = Math.ceil(totalProduct / objectPagination.limitItem);
    objectPagination.totalPage = totalPage;
    return objectPagination;
}