module.exports.registerPost = (req, res, next) => {
    if(!req.body.fullName){
        res.json({
            code : 400,
            message : `Vui lòng nhập họ tên`
        })
        return;
    }
    if(!req.body.email){
        res.json({
            code : 400,
            message : `Vui lòng nhập email`
        })
        return;
    }

    if(!req.body.password){
        res.json({
            code : 400,
            message : `Vui lòng nhập mật khẩu`
        })
        return;
    }
    if(!req.body.repassword){
        res.json({
            code : 400,
            message : `Vui lòng nhập xác nhận mật khẩu`
        })
        return;
    }

    if(req.body.repassword != req.body.password){
        res.json({
            code : 400,
            message : `Mật khẩu nhập lại không chính xác`
        })
        return;
    }
    next();
}

module.exports.loginPost = (req, res, next) => {
    if(!req.body.email){
        res.json({
            code : 400,
            message : `Vui lòng nhập email`
        })
        return;
    }
    if(!req.body.password){
        res.json({
            code : 400,
            message : `Vui lòng nhập mật khẩu`
        })
        return;
    }
    next();
}

module.exports.forgotPasswordPost = (req, res, next) => {
    if(!req.body.email){
        res.json({
            code : 400,
            message : `Vui lòng nhập email`
        })
        return;
    }
    next();
}

module.exports.otpPost = (req, res, next) => {
    if(!req.body.otp){
        res.json({
            code : 400,
            message : `Vui lòng nhập mã otp`
        })
        return;
    }
    next();
}

module.exports.repassword = (req, res, next) => {
    if(!req.body.password){
        res.json({
            code : 400,
            message : `Vui lòng nhập mật khẩu`
        })
        return;
    }
    if(!req.body.repassword){
        res.json({
            code : 400,
            message : `Vui lòng nhập xác nhận lại mật khẩu`
        })
        return;
    }
    if(req.body.password !== req.body.repassword){
        res.json({
            code : 400,
            message : `Mật khẩu nhập lại không khớp`
        })
        return;
    }
    next();
}

