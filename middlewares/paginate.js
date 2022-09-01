const config = require("config");

module.exports = function(req, res, next){
    /*
        #swagger.parameters['page'] = {
            in: 'query',
            description: 'the page user is in',
            type: 'integer'
        } 
        #swagger.parameters['size'] = {
                in: 'query',
                description: 'the number of entities in each page.',
                type: 'integer'
        } 
        #swagger.parameters['sort'] = {
                in: 'query',
                description: 'the parameter that entities will be sorted by. options: [createdAt]. for descending sort add - before parmeter.',
                type: 'string'
        } 
    */
    req.query.page = parseInt(req.query.page, 10) || 1;
    req.query.size = parseInt(req.query.size, 10) || config.get("itemsInPage");
    next();
}