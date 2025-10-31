const db = require("../db/db");
const fs = require("fs");
const { matchedData } = require("express-validator");
const { saveFileToDisk } = require("../middleware/multer");

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

  createCategory: async (req, res) => {
    // INSERT INTO category (name, image_path) VALUES ($1, $2)
    const columns = [];
    const parameters = [];
    const values = [];
    let paramCount = 1;

    for (const key in matchedData(req)) {
      columns.push(key);
      values.push(matchedData(req)[key]);
      parameters.push(`$${paramCount}`);
      paramCount++;
    }

    if (req.files?.image?.[0]) {
      const imageBuffer = req.files.image?.[0]?.buffer;
      const imageName = req.files.image?.[0]?.originalname;

      try {
        const imagePath = await saveFileToDisk(imageBuffer, imageName);
        columns.push("image_path");
        values.push(imagePath);
        parameters.push(`$${paramCount}`);
        paramCount++;
      } catch (error) {
        res
          .status(400)
          .json({
            errors: [{ path: "image", msg: "Error uploading the file" }],
          });
      }
    }

    try {
      const { rows } = await db(
        `INSERT INTO category (${columns}) VALUES (${parameters}) RETURNING *`,
        values
      );
      res.json(rows?.[0]);
    } catch (error) {
      console.log(error);

      // TO-DO Implement deletion of file as well if failed query
      res.status(400).json({error: error, message: "Error while saving category."});
    }
  },
  updateCategory: (req, res) => {
    // Refactor
    const { name } = req.body ? req.body : {};
    const { category_id } = req.params ? req.params : {};
    const image_path = req.file ? req.file.path.replace(/\\/g, "/") : undefined;

    console.log(image_path);

    const updateQuery = `UPDATE category SET
    name = $1, image_path = $2 WHERE category_id = $3 RETURNING *`;

    db(updateQuery, [name, image_path ? image_path : null, category_id])
      .then(({ rows }) => {
        console.log(rows);
        res.json({
          message: "Succesfully updated category",
          category: rows[0],
        });
      })
      .catch(() => {
        res.status(404).json({ error: "Category not succesfully updated" });
      });
  },
};
