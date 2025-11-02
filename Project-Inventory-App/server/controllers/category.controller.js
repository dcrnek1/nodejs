const db = require("../db/db");
const fs = require("fs");
const { matchedData } = require("express-validator");
const { saveFileToDisk, deleteFileFromDisk } = require("../middleware/multer");

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

  deleteCategory: async (req, res) => {
    const { category_id } = req?.params;

    try {
      const { result, rows } = await db(
        "DELETE FROM category WHERE category_id = $1 RETURNING *",
        [category_id]
      );
      const imagePath = rows?.["0"]?.image_path;
      if (result.rowCount > 0) {
        try {
          await deleteFileFromDisk(imagePath);
        } catch (error) {
          console.log(error);
        }
        res.json({ message: "Succesfully deleted category." });
      } else {
        res.status(404).json({ error: "Category not found." });
      }
    } catch (error) {
      res.status(400).json({ message: "Category not deleted. Server error." });
    }
  },

  createCategory: async (req, res) => {
    const columns = [];
    const params = [];
    const values = [];
    let paramCount = 1;

    for (const key in matchedData(req)) {
      columns.push(key);
      values.push(matchedData(req)[key]);
      params.push(`$${paramCount}`);
      paramCount++;
    }

    if (req.files?.image?.[0]) {
      const imageBuffer = req.files.image?.[0]?.buffer;
      const imageName = req.files.image?.[0]?.originalname;
      let imagePath = "";

      try {
        imagePath = await saveFileToDisk(imageBuffer, imageName);
        columns.push("image_path");
        values.push(imagePath);
        params.push(`$${paramCount}`);
        paramCount++;

        const { rows } = await db(
          `INSERT INTO category (${columns}) VALUES (${params}) RETURNING *`,
          values
        );
        res.json(rows?.[0]);
      } catch (error) {
        console.log(error);
        deleteFileFromDisk(imagePath);
        res.status(400).json({
          errors: [{ message: "Error saving category." }],
        });
      }
    }
  },
  updateCategory: async (req, res) => {
    const { category_id } = req.params ? req.params : {};
    const newImage = req?.files?.image?.[0];

    let columns = "";
    const params = [];
    const values = [];
    let paramsCount = 1;
    const currentImagePath = "";

    try {
      const { rows } = await db(
        `SELECT * FROM category WHERE category_id = $1 LIMIT 1`,
        [category_id]
      );
      currentImagePath = rows?.[0]?.image_path;
    } catch (error) {
      console.log(error);
    }

    for (const key in matchedData(req)) {
      columns += `${key} = $${paramsCount}`;
      values.push(matchedData(req)?.[key]);
      params.push(`$${paramsCount}`);
      paramsCount++;
    }

    let imagePath = '';
    try {
      imagePath = await saveFileToDisk(
        newImage.buffer,
        newImage.originalname
      );
      columns += `, image_path = $${paramsCount} WHERE category_id = $${
        paramsCount + 1
      }`;
      values.push(imagePath);
      values.push(category_id);
      paramsCount++;

      const { rows } = await db(
        `UPDATE category SET ${columns} RETURNING *`,
        values
      );

      try {
        deleteFileFromDisk(currentImagePath);
      } catch (error) {
        console.log(error);
      }

      res.json("Succesfully updated category.");
    } catch (error) {
      console.log(error);
      try {
        deleteFileFromDisk(imagePath);
      } catch (error) {
        console.log(error);
      }
      res.status(400).json("Error while updating category.");
    }
  },
};
