const Joi = require('joi');


module.exports.addRestaurantToBookMarSchemaValidator = Joi.object({
    locationAlias: Joi.string().required(),
    globalATRank: Joi.string().required(),
    localATRank: Joi.string().required(),
    city: Joi.string().required(),
    locationCategoryName: Joi.string().required(),
    locationCategoryID: Joi.string().required(),
});