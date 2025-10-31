const db = require("../db/db");
const fs = require('fs');
const { matchedData } = require('express-validator');
const { saveFileToDisk } = require('../middleware/multer');

module.exports = {
  getAllCategories: async (req, res) => {
    try {
      const { rows } = await db(`select c.*, count(*) as product_count
            from category c
            join category_product cp on cp.category_id = c.category_id
            group by c.category_id
            order by product_count desc`);
      res.json(rows);
    } catch (error) {
      res.status(400).json({ error: error, message: "Database error." });
    }
  },
  deleteCategory: (req, res) => {
    const { id } = req.params;
    db("DELETE FROM category WHERE category_id = $1", [id])
      .then(({ result }) => {
        result.rowCount > 0
          ? res.json({ message: "Succesfully deleted category." })
          : res.status(404).json({ error: "Category not found." });
      })
      .catch(() => {
        res.status(500).json({ error: "Database error." });
      });
  },
  createCategory: (req, res) => {

    const {name} = matchedData(req);

    if (req.files?.image?.[0]) {
      const imageBuffer = req.files.image[0]?.buffer;
      const imageName = req.files.image[0]?.originalname;

      const imagePath = saveFileToDisk(imageBuffer, imageName);
    }
    console.log(name);


    res.json({ message: "Entered create category" });
    // const name = req.body ? req.body.name : undefined;
    // if (name && typeof req.body.name === "string") {
    //   const image_path = req.file
    //     ? req.file.path.replace(/\\/g, "/")
    //     : undefined;
    //   db(
    //     `INSERT INTO category (name${req.file ? ", image_path" : ""})
    //             VALUES ($1${req.file ? ", $2" : ""}) RETURNING *`,
    //     req.file ? [name, image_path] : [name]
    //   )
    //     .then(({ rows }) => {
    //       res.json({
    //         message: "Category succesfully created.",
    //         category: rows[0],
    //       });
    //     })
    //     .catch(() => {
    //       res.status(404).json({ error: "Database error." });
    //     });
    // } else {
    //   res.status(404).json({ error: "Creating category was not successful." });
    // }
  },
  updateCategory: (req, res) => {
    const { name } = req.body ? req.body : {};
    const { category_id } = req.params ? req.params : {};
    const image_path = req.file
      ? req.file.path.replace(/\\/g, "/")
      : undefined;

    console.log(image_path);

    const updateQuery = `UPDATE category SET
    name = $1, image_path = $2 WHERE category_id = $3 RETURNING *`;

    db(updateQuery, [name, image_path ? image_path : null, category_id])
      .then(({ rows }) => {
        console.log(rows);
        res.json({ message: "Succesfully updated category", category: rows[0] })
      }).catch(() => {
        res.status(404).json({ error: "Category not succesfully updated" });
      })
  },
};
