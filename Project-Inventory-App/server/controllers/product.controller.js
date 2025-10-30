const db = require('../db/db')

module.exports = {
    getAllProducts: (req, res) => {
        const query = 
        `SELECT
            p.*,
            COALESCE(
                json_agg(
                json_build_object('category_id', c.category_id, 'name', c.name)
                ) FILTER (WHERE c.category_id IS NOT NULL),
                '[]'
            ) AS categories
        FROM product p
        LEFT JOIN category_product cp ON cp.product_id = p.product_id
        LEFT JOIN category c ON c.category_id = cp.category_id
        GROUP BY p.product_id
        ORDER BY p.product_id`
        db(query).then(({rows}) => {
            res.json(rows)
        }).catch(() => {
            res.status(500).json({ error: 'Database query error.'});
        });
    },
    deleteProduct: (req, res) => {
        const {id} = req.params;
        db('DELETE FROM product WHERE product_id = $1', [id]).then(({result}) => {
            result.rowCount > 0 ? res.json({message: "Succesfully deleted user."})
            : res.status(404).json({error: "User not found."})
        }).catch(() =>{
            res.status(500).json({error: "Database query error."});
        })
    }
}