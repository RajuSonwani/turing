const { join } = require("../pool");
const knex = require("../pool");

module.exports = {
    attribute:(req, res) => {
        knex.select().from("attribute").then(data => {
            res.send(data)
        }).catch(err => {
            console.log(err);
            res.send(err)
        })
    },
    attributeById:(req, res) => {
        knex.select().from("attribute").where("attribute_id", req.params.id).then(data => {
            res.send(data[0])
        }).catch(err => {
            console.log(err);
            res.send(err)
        })
    },
    attributeByValueAttributeId:(req,res)=>{
        knex.select("attribute_value_id","value")
        .from('attribute_value')
        .where("attribute_value.attribute_id",req.params.attribute_id).then(data => {
            res.send(data)
        }).catch(err => {
            console.log(err);
            res.send(err)
        })
    },
    attributeByProductProductId:(req,res)=>{
        knex.select('name as attribute_name','attribute_value.attribute_value_id','value as attribute_value').from('attribute')
        .join('attribute_value','attribute.attribute_id','=','attribute_value.attribute_id')
        .join('product_attribute','attribute_value.attribute_value_id','=','product_attribute.attribute_value_id')
        .where('product_attribute.product_id',req.params.product_id).then(data => {
            res.send(data)
        }).catch(err => {
            console.log(err);
            res.send(err)
        })
    }
};