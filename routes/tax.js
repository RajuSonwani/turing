module.exports = (router, knex) => {

    router.get('/tax', (req, res) => {
        knex
            .select('*')
            .from('tax')
            .then((data) => {
                console.log(data);
                res.send(data)

            })
            .catch((err) => {
                console.log(err);
                res.send(err)

            })
    })

    router.get('/tax/:tax_id', (req, res) => {
        knex('tax')
            .select('*')
            .where('tax_id', req.params.tax_id)
            .then((data1) => {
                console.log(data1);
                res.send(data1)

            })
            .catch((err) => {
                console.log(err);
                res.send(err)
            })
    })
}