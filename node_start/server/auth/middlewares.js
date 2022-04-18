function isAuth(req, res, next) {
    if(req.user) return next();
    res.status(403).end("Access Forbiden")
}

module.exports = {
    isAuth,
}
