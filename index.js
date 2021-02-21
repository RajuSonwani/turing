require("dotenv").config();
const router = require("./router");
const express = require("express");
const app = express();

app.use(express.json());
app.use(express.urlencoded({extended:false}))

app.use("/",router)

app.get("/",(req,res)=>{
    res.status(200).send("Hello World..!")
});

// deferenct approch for routing
// const knex = require("./pool")
// require("./routes/tax")(app, knex)


app.listen(process.env.PORT,()=>{
    console.log("server is running..!")
})