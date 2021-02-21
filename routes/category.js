const { join } = require("../pool");
const knex = require("../pool");

module.exports = {
    category:(req, res) => {
        knex.select().from("category").then(data => {
            res.json({count:data.length,rows:data})
        }).catch(err => {
            console.log(err);
            res.send(err)
        })
    },
    categoryById:(req, res) => {
        knex.select().from("category").where("category_id", req.params.id).then(data => {
            res.send(data[0])
        }).catch(err => {
            console.log(err);
            res.send(err)
        })
    },
    categoryByDepartmentId:(req,res)=>{
        knex.select().from("category").join("department","department.department_id","=","category.department_id").where("category.department_id", req.params.department_id).then(data => {
            res.send(data)
        }).catch(err => {
            console.log(err);
            res.send(err)
        })
    },
    categoryByProductId:(req,res)=>{
        knex.select("category.category_id","category.department_id","name").from("category").join("product_category","product_category.category_id","=","category.category_id").where("product_category.product_id", req.params.product_id).then(data => {
            res.send(data)
        }).catch(err => {
            console.log(err);
            res.send(err)
        })
    }
};