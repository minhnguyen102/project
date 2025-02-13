module.exports = (query) => {
    // req = req.query
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

    // Tìm ra vị trí button hiện tại đang active
    if(query.status){
        const index = filterStatus.findIndex(item => item.status == query.status);
        filterStatus[index].class = "active";
    }else{
        const index = filterStatus.findIndex(item => item.status == "");
        filterStatus[index].class = "active";
    }

    return filterStatus;
}