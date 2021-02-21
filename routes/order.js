const { join } = require("../pool");
const knex = require("../pool");
const jwt = require("jsonwebtoken");

module.exports = {
    post_order:(req,res)=>{
        console.log(req.params);
        const authHead = req.headers["authorization"];
        const token = authHead && authHead.split(" ")[1]
        if (token == null) return res.sendStatus(401);
        jwt.verify(token,process.env.SECRET_KEY,(err, tokendata) =>{
            if (!err){
                knex.select().from("product").where("product.product_id",req.params.product_id).then(data=>{
                    console.log(data);
                    knex("orders").insert({
                        "total_amount":req.params.quantity*data[0].price,
                        "created_on":new Date(),
                        "customer_id":tokendata.customer_id,
                        "shipping_id":req.params.shipping_id,
                        "tax_id":req.params.tax_id
                    }).then(result=>{
                        knex("order_detail").insert({
                            "unit_cost":data[0].price,
                            "quantity":req.params.quantity,
                            "product_name":data[0].name,
                            "attributes":req.params.attributes,
                            "product_id":data[0].product_id,
                            "order_id":result[0]
                        }).then(detail=>{
                            res.send({"order Id":result[0]})
                        }).catch(err=>{
                            console.log(err);
                            res.send({"Msg":err})
                        })
                    }).catch(err=>{
                        console.log(err);
                        res.send({"Msg":err})
                    })
                }).catch(err=>{
                    console.log(err);
                    res.send({"Msg":err})
                })
            }else{
                console.log(err);
                res.send({"Msg":err})
            }
        })
    },
    order_detailsById:(req,res)=>{
        console.log(req.params)
        const authHead = req.headers["authorization"];
        const token = authHead && authHead.split(" ")[1]
        if (token == null) return res.sendStatus(401);
        jwt.verify(token,process.env.SECRET_KEY,(err, tokendata) =>{
            if (!err){
                knex.select("orders.order_id",
                "product.product_id",
                "order_detail.attributes",
                "product.name as product_name",
                "order_detail.quantity",
                "product.price",
                "order_detail.unit_cost").from("orders")
                .join("order_detail","orders.order_id","=","order_detail.order_id")
                .join("product","order_detail.product_id","=","product.product_id")
                .where("orders.order_id",req.params.order_id).then(data=>{
                    console.log(data)
                    res.send(data[0])
                }).catch(err=>{
                    console.log(err);
                    res.send({"Msg":err})
                })
            }else{
                console.log(err);
                res.send({"Msg":err})
            }
        })
    },
    short_order_detailById:(req,res)=>{
        console.log(req.params)
        const authHead = req.headers["authorization"];
        const token = authHead && authHead.split(" ")[1]
        if (token == null) return res.sendStatus(401);
        jwt.verify(token,process.env.SECRET_KEY,(err, tokendata) =>{
            if (!err){
                knex.select( 'orders.order_id',
                'orders.total_amount',
                'orders.created_on',
                'orders.shipped_on',
                'orders.status',
                'order_detail.product_name as name').from("orders")
                .join("order_detail","orders.order_id","=","order_detail.order_id")
                .where("orders.order_id",req.params.order_id).then(data=>{
                    console.log(data)
                    res.send(data[0])
                }).catch(err=>{
                    console.log(err);
                    res.send({"Msg":err})
                })
            }else{
                console.log(err);
                res.send({"Msg":err})
            }
        })
    },
    order_detailsByCustomerId:(req,res)=>{
        const authHead = req.headers["authorization"];
        const token = authHead && authHead.split(" ")[1]
        if (token == null) return res.sendStatus(401);
        jwt.verify(token,process.env.SECRET_KEY,(err, tokendata) =>{
            if (!err){
                knex
                .select('*')
                .from('orders')
                .where('customer_id', tokendata.customer_id)
                .then((data) =>{
                    console.log(data);
                    res.send(data);
                }).catch((err) =>{
                    console.log(err);
                })
            }else{
                res.send({"Error": "please! do login"})
            }
        })
    }
    
};