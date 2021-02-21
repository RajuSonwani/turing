// const knex = require("../pool")
// const path = require("path");

// const departmentById = (req, res) => {
//     knex.select().from("department").where("department_id", req.params.id).then(data => {
//         res.send(data)
//     }).catch(err => {
//         console.log(err);
//         res.send(err)
//     })
// };

// const departmentById = (req, res) => {
//     knex.select().from("department").then(data => {
//         res.send(data)
//     }).catch(err => {
//         console.log(err);
//         res.send(err)
//     })
// };

// module.exports = {
//     department:department,
//     departmentById:departmentById
// }

// or

const knex = require("../pool");

module.exports = {
    department:(req, res) => {
        knex.select().from("department").then(data => {
            res.send(data)
        }).catch(err => {
            console.log(err);
            res.send(err)
        })
    },
    departmentById:(req, res) => {
        knex.select().from("department").where("department_id", req.params.id).then(data => {
            res.send(data[0])
        }).catch(err => {
            console.log(err);
            res.send(err)
        })
    }
}


