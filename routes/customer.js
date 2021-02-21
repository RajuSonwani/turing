const { join } = require("../pool");
const knex = require("../pool");
const jwt = require("jsonwebtoken");

module.exports = {
    register_customer:(req, res) => {
        const email = req.body.email;      
        knex.select().from("customer").where("email",email).then(data => {
            if(data.length<1){
                knex("customer").insert(req.body).then(data=>{
                    res.json("data inserted successfully..!")
                }).catch(err=>{
                    console.log(err);
                    res.send(err)
                })
            }else{
                res.send("email already exists..!")
            }
        }).catch(err => {
            console.log(err);
            res.send(err)
        })
    },
    login_customer:(req,res)=>{
        const email = req.body.email;
        const pass = req.body.password;
        knex.select().from("customer").where("email",email).then(data=>{
            if(data.length>0){
                if(pass === data[0].password){
                    delete data[0].password;
                    const token = jwt.sign({customer_id:data[0].customer_id,name:data[0].name},process.env.SECRET_KEY,{expiresIn:"24h"});
                    res.json({"customer":{"schema":data[0]},"excessToken":token,"expireIn":"24h"})
                }else{
                    res.send("Incorrect Password..!")
                }
            }else{
                res.send("sign_up first..!")
            }
        }).catch(err=>{
            res.send(err)
        })
    },
    customerById:(req,res)=>{
        knex.select().from("customer").where("customer_id",req.params.id).then(data=>{
            delete data[0].password;
            res.send(data[0])
        }).catch(err=>{
            res.send(err)
        })

    },
    update_customer:(req,res)=>{
        const authHead = req.headers["authorization"];
        const token = authHead && authHead.split(" ")[1]
        if (token == null) return res.sendStatus(401);
        jwt.verify(token,process.env.SECRET_KEY,(err, tokendata) =>{
            if (!err){
                // console.log(tokendata);
                knex("customer").update(req.body).where("customer_id",tokendata.customer_id).then(data=>{
                    // console.log(data)
                    res.send("data updated successfully..!")
                }).catch(err=>{
                    res.send(err)
                })
            }else{
                res.send(err)
            }
        })
    },
    update_address:(req,res)=>{
        const authHead = req.headers["authorization"];
        const token = authHead && authHead.split(" ")[1]
        if (token == null) return res.sendStatus(401);
        jwt.verify(token,process.env.SECRET_KEY,(err, tokendata) =>{
            if (!err){
                knex("customer").update(req.body).where("customer_id",tokendata.customer_id).then(data=>{
                    console.log(data)
                    res.send({"Done": "data updated successfully!"})
                }).catch(err=>{
                    res.send({"Msg":err})
                })
            }else{
                res.send({"Msg":err})
            }
        })
    },
    update_credit_card:(req,res)=>{
        const authHead = req.headers["authorization"];
        const token = authHead && authHead.split(" ")[1]
        if (token == null) return res.sendStatus(401);
        jwt.verify(token,process.env.SECRET_KEY,(err, tokendata) =>{
            if (!err){
                knex("customer").update(req.body).where("customer_id",tokendata.customer_id).then(data=>{
                    console.log(data)
                    res.send({"Done": "data updated successfully!"})
                }).catch(err=>{
                    res.send({"Msg":err})
                })
            }else{
                res.send({"Msg":err})
            }
        })
    }
    
};