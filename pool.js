require("dotenv").config();
const knex = require("knex");

module.exports = knex({
    client:'mysql',
    connection:{
        host:process.env.HOST,
        user:process.env.DB_USER,
        password:process.env.DB_PASS,
        database:process.env.DB_NAME
    },pool:{min:0,max:4}
});
