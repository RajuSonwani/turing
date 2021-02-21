const { join } = require("../pool");
const knex = require("../pool");
const jwt = require("jsonwebtoken");

module.exports = {
    product:(req, res) => {
        knex.select().from("product").then(data => {
            res.json({count:data.length,rows:data})
        }).catch(err => {
            console.log(err);
            res.send(err)
        })
    },
    productBySearch:(req, res) => {
        console.log(req.query.name)
        knex.select().from("product").where("name","like","%"+req.query.q+"%").orWhere("description","like","%"+req.query.q+"%").orWhere("price","like","%"+req.query.q+"%").then(data => {
            res.send(data)
        }).catch(err => {
            console.log(err);
            res.send(err)
        })
    },
    productById:(req,res)=>{
        knex.select().from("category").join("department","department.department_id","=","category.department_id").where("category.department_id", req.params.department_id).then(data => {
            res.send(data)
        }).catch(err => {
            console.log(err);
            res.send(err)
        })
    },
    productProductByCategoryId:(req, res) => {
        knex.select("product.product_id","name","description","price","discounted_price","thumbnail").from("product").join("product_category","product.product_id","=","product_category.product_id").where("product.product_id", req.params.category_id).then(data => {
            res.json({count:data.length,rows:data})
        }).catch(err => {
            console.log(err);
            res.send(err)
        })
    },
    productDepartmentByDepartmentId:(req,res)=>{
        knex.select("product.product_id","product.name","product.price","product.discounted_price","product.description","product.thumbnail").from("product_category").join("product","product_category.product_id","=","product.product_id").join("category","product_category.category_id","=","category.category_id").join("department","category.department_id","=","department.department_id").where("department.department_id", req.params.department_id).then(data => {
            res.json({count:data.length,rows:data})
        }).catch(err => {
            console.log(err);
            res.send(err)
        })
    },
    product_detail:(req,res)=>{
        knex.select().from("product").where("product_id",req.params.product_id).then(data=>{
            res.send(data[0])
        }).catch(err=>{
            res.send(err)
        })
    },
    product_location:(req,res)=>{
        knex.select("category.category_id","category.name as category_name","department.department_id","department.name as department_name").from("product").join("product_category","product.product_id","=","product_category.product_id").join("category","product_category.category_id","=","category.category_id").join("department","category.department_id","=","department.department_id").where("product.product_id",req.params.product_id).then(data=>{
            res.send(data[0])
        }).catch(err=>{
            res.send(err)
        })
    },
    product_review_get:(req,res)=>{
        knex.select("product.product_id","review.review","review.rating","review.created_on", "review.customer_id").from("product").join("review","product.product_id","=","review.product_id").where("product.product_id",req.params.product_id).then(data=>{
            res.send(data[0])
        }).catch(err=>{
            res.send(err)
        })
    },
    product_review_post:(req,res)=>{
        //auth
        const authHead = req.headers["authorization"];
        const token = authHead && authHead.split(" ")[1]
        if (token == null) return res.sendStatus(401);
        const review = req.body.review;
        const rating = req.body.rating;
        const product_id = req.params.product_id;
        jwt.verify(token,process.env.SECRET_KEY,(err, tokendata) =>{
            if (!err){
                knex.select().from("customer").where("customer.customer_id",tokendata.customer_id).then(data=>{
                    knex("review").insert({"review":review,"rating":rating,"product_id":product_id,"created_on":new Date,"customer_id":data[0].customer_id}).then(data0=>{
                        console.log(data0);
                        res.send("data inserted successfully..!")
                    }).catch(err=>{
                        res.send(err)
                    })
                }).catch(err=>{
                    res.send(err)
                })
            }else{
                res.send(err)
            }
        })
    }
        

};