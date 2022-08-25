const config = require("config");

module.exports = function(req, res, next){
    req.query.page = parseInt(req.query.page, 10) || 1;
    req.query.size = parseInt(req.query.size, 10) || config.get("itemsInPage");
    console.log(req.query.page);
    next();
}