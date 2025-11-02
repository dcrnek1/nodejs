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

    let imageBuffer = "";
    let imageName = "";
    let imagePath = "";
    if (req.files?.image?.[0]) {
      imageBuffer = req.files.image?.[0]?.buffer;
      imageName = req.files.image?.[0]?.originalname;
    }

    try {
      if (imageBuffer) {
        imagePath = await saveFileToDisk(imageBuffer, imageName);
        columns.push("image_path");
        values.push(imagePath);
        params.push(`$${paramCount}`);
        paramCount++;
      }

      const { rows } = await db(
        `INSERT INTO category (${columns}) VALUES (${params}) RETURNING *`,
        values
      );
      res.json(rows?.[0]);
    } catch (error) {
      console.log(error);
      await deleteFileFromDisk(imagePath);
      res.status(400).json({
        errors: [{ message: "Error saving category." }],
      });
    }
  },

  updateCategory: async (req, res) => {
    const { category_id } = req.params ? req.params : {};
    const newImage = req?.files?.image?.[0];
    let currentImagePath = "";
    let newImagePath = "";

    const columns = [];
    const values = [];
    let paramsCounter = 1;

    try {
      const { rows } = await db(
        `SELECT * FROM category WHERE category_id = $1 LIMIT 1`,
        [category_id]
      );
      currentImagePath = rows?.[0]?.image_path;
      if (rows.length === 0)
        return res.status(404).json({ error: "Non existant category." });
    } catch (error) {
      console.log(error);
      return res.status(500).json({ error: "Database error." });
    }

    for (const key in matchedData(req)) {
      columns.push(`${key} = $${paramsCounter}`);
      values.push(matchedData(req)?.[key]);
      paramsCounter++;
    }

    try {
      if (newImage) {
        newImagePath = await saveFileToDisk(
          newImage.buffer,
          newImage.originalname
        );
        columns.push(`image_path = $${paramsCounter}`);
        values.push(newImagePath);
        paramsCounter++;
      }

      if (columns.length !== 0) {
        values.push(category_id);
        const { rows } = await db(
          `UPDATE category SET ${columns.join(
            ", "
          )} WHERE category_id = $${paramsCounter} RETURNING *`,
          values
        );

        if (newImage) {
          try {
            await deleteFileFromDisk(currentImagePath);
          } catch (error) {
            console.log(error);
          }
        }

        res.json(rows?.[0]);
      }
    } catch (error) {
      console.log(error);
      try {
        deleteFileFromDisk(newImagePath);
      } catch (error) {
        console.log(error);
      }
      res.status(400).json({ error: "Error while updating category." });
    }
  },
};
