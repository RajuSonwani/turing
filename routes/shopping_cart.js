const knex = require("../pool");

module.exports = {
    generateUniqueId:(req,res)=>{
        let text = "";
        let char_list = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz1234567890";
        for(var i=0; i<11; i++){
            text += char_list.charAt(Math.floor(Math.random() * char_list.length))
        };
        const cart_id = {
            "cart_id": text
        };
        // console.log(cart_id);
        res.send(cart_id);
    },
    addShoppingCart:(req,res)=>{
        req.body.added_on = new Date;
        console.log(req.body);
        knex
        .select('quantity')
        .from('shopping_cart')
        .where('shopping_cart.cart_id', req.body.cart_id)
        .andWhere('shopping_cart.product_id', req.body.product_id)
        .andWhere('shopping_cart.attributes', req.body.attributes)
        .then((data) =>{
            console.log('quantity', data);
            if(data.length==0){
                // for quantity
                knex('shopping_cart')
                .insert(req.body)
                .then(() =>{
                    knex
                    .select(
                        'item_id',
                        'name',
                        'attributes',
                        'shopping_cart.product_id',
                        'price',
                        'quantity',
                        'image'
                    )
                    .from('shopping_cart')
                    .join('product',function(){
                        this.on('shopping_cart.product_id','product.product_id')
                    })
                    .then(data => {
                        res.send(data);
                    }).catch(err => console.log(err));
                }).catch((err) => console.log(err))
            }else{
                // quantity increase
                let quantity = data[0].quantity+1;
                knex('shopping_cart')
                .update({quantity: quantity})
                .where('shopping_cart.cart_id', req.body.cart_id)
                .andWhere('shopping_cart.product_id', req.body.product_id)
                .andWhere('shopping_cart.attributes', req.body.attributes)
                .then(() => {
                    knex
                    .select(
                        'item_id',
                        'name',
                        'attributes',
                        'shopping_cart.product_id',
                        'price',
                        'quantity',
                        'image'
                    )
                    .from('shopping_cart')
                    .join('product', function() {
                        this.on('product.product_id', 'shopping_cart.product_id')
                    })
                    .then(updatedata => {
                        console.log(updatedata);
                        console.log('data updated!')
    
                        let updated_list = [];
                        for (let i of updatedata){
                            let subtotal = i.price* i.quantity;
                            i.subtotal = subtotal;
                            updated_list.push(i);
                        }
                        
                        res.send(updated_list);
                    })
                    .catch(err => console.log(err));
                })
            }
        })

    },
    shoppingCartById:(req,res)=>{
        knex
        .select('item_id','image','shopping_cart.product_id','product.product_id','price','name','attributes','quantity')
        .from('shopping_cart')
        .join('product', function(){
            this.on('shopping_cart.product_id', 'product.product_id')
        })
        .where('shopping_cart.cart_id',req.params.cart_id)
        .then((data1)=>{
            let array = data1.map(x=>{
                x.subtotal = x.price*x.quantity
                return x
            })
            // console.log(array);
            res.send(array) 
        })
        .catch((err)=>{
            console.log(err);
            res.send(err)
            
        })
    },
    updateShoppingCartById:(req,res)=>{
        knex('shopping_cart').update({'quantity': req.body.quantity})
        .where('shopping_cart.item_id',req.params.item_id)
        .then(() =>{
            knex
            .select(
                'item_id',
                'product.name',
                'shopping_cart.attributes',
                'shopping_cart.product_id',
                'product.price',
                'shopping_cart.quantity',
                'product.image'
            )
            .from('shopping_cart')
            .where('shopping_cart.item_id', req.params.item_id)
            .join('product', function() {
                this.on('shopping_cart.product_id', 'product.product_id')
            })
            .then((data) =>{
                let result = [];
                for (let i of data){
                    let subtotal = i.price * i.quantity;
                    i.subtotal = subtotal;
                    result.push(i);
                }
                res.send(result);
            }).catch(err => console.log(err));
        }).catch((err) =>{
            console.log(err)
        })
    },
    deleteShoppingCartById:(req,res)=>{
        knex('*')
        .from('shopping_cart')
        .where('shopping_cart.cart_id',req.params.cart_id)
        .del()
        .then((data) =>{
            res.send({delete: 'data deleted successfully!!!'})
        }).catch(err => console.log(err));
    },
    moveCartById:(req,res)=>{
        knex.select('*').from('save_for_later').where('save_for_later.item_id', req.params.item_id)
        .then((data) =>{
            // console.log(data);
            if (data.length>0){
                knex('shopping_cart')
                .insert(data[0])
                .then((result) =>{
                    knex
                    .select('*')
                    .from('save_for_later')
                    .where('save_for_later.item_id', req.params.item_id)
                    .delete()
                    .then((done) =>{
                        res.send({"Good": "data move from save_for_later to shopping_cart successfully!"})
                    })
                }).catch((err) =>{
                    console.log(err);
                })
    
            }else{
                res.send({"Error": "this id is not available in shopping_cart"})
            }
        
        }).catch((err) => {
            console.log(err);
        })
    },
    saveForLater:(req,res)=>{
        knex.schema.createTable('save_for_later', function(table){
            table.increments('item_id').primary();
            table.string('cart_id');
            table.integer('product_id');
            table.string('attributes');
            table.integer('quantity');
            table.datetime('added_on');
        }).then(() =>{
            console.log("table 'save_for_later' created successfully....!")
        }).catch((err) =>{
            console.log("table 'save_for_later' is already exists")
        });
        req.body.added_on = new Date;
        knex("save_for_later").insert(req.body).then(()=>{
            res.send({msg:"data saved for later..!"})
        }).catch(err=>{
            console.log(err)
        })

    },
    removeProductById:(req,res)=>{
        knex.select().from("save_for_later").where("item_id",req.params.item_id).delete().then(()=>{
            res.send("selected_item removed from shopping_cart successfully..!")
        }).catch(err=>{
            console.log(err)
        })
    },
    getProductFromSavedForLater:(req,res)=>{
        knex.select().from("save_for_later").where("item_id",req.params.cart_id).then((data)=>{
            res.send(data)
        }).catch(err=>{
            console.log(err)
        })
    },
    totalAmount:(req,res)=>{
        knex
        .select(
            'price',
            'quantity'
        )
        .from('shopping_cart')
        .join('product', function(){
            this.on('shopping_cart.product_id', 'product.product_id')
        })
        .where('shopping_cart.item_id', req.params.item_id)
        .then((data) =>{
            console.log(data);
            for (let i of data){
                let result = [];
                let total_Amount = i.quantity * i.price;
                i.total_Amount = total_Amount;
                // console.log(i);
                result.push(i);
                res.send(result);
            }
        }).catch((err) =>{
            console.log(err);
        })
    }

}