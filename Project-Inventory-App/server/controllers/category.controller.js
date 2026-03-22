const db = require("../db/db");
const fs = require("fs");
const { matchedData } = require("express-validator");
const { saveFileToDisk, deleteFileFromDisk } = require("../middleware/multer");
const { match } = require("assert");

module.exports = {
  getCategoryById: async (req, res) => {
    const category_id = req?.params?.category_id;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 5;
    try {
      const { rows } = await db(
        `select * from category where category_id = $1 limit 1`,
        [category_id]
      );
      if (rows.length > 0) {
        res.json(rows?.[0]);
      } else {
        res.status(404).json({ message: "Category not found." });
      }
    } catch (error) {
      res.status(400).json({ error: error, message: "Database error." });
    }
  },

  getAllCategories: async (req, res) => {
    const orderColumn = req?.query?.orderColumn;
    const order = req?.query?.order;

    
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 5;
    const offset = (page - 1) * limit;
  
    try {
      const { rows } = await db(`select c.*, count(cp.*) as product_count
            from category c
            left join category_product cp on cp.category_id = c.category_id
            group by c.category_id
            ORDER BY ${orderColumn ? orderColumn : 'product_count'} ${order ? order : 'desc'}
            LIMIT $1 OFFSET $2`,
            [limit, offset]);
      
      const total = await db(`select count(*) from category`);
      const totalCount = parseInt(total.rows[0].count);
      const hasMore = page * limit < totalCount; 

       res.json({result: rows, total:totalCount, nextPage: hasMore ? page + 1 : null, hasMore})

    } catch (error) {
      res.status(400).json({ error: error, message: "Database error." });
    }
  },

  deleteCategory: async (req, res) => {
    const { category_id } = req?.params;

    const { result, rows } = await db(
      "DELETE FROM category WHERE category_id = $1 RETURNING *",
      [category_id],
      res
    );
    const imagePath = rows?.["0"]?.image_path;
    if (result.rowCount > 0) {
      if (imagePath) {
        try {
          await deleteFileFromDisk(imagePath);
        } catch (error) {
          console.log(error);
        }
      }

      res.json({ message: "Succesfully deleted category." });
    } else {
      res.status(404).json({ error: "Category not found." });
    }
  },

  createCategory: async (req, res) => {
    const columns = [];
    const params = [];
    const values = [];
    let paramCount = 1;

    for (const key in matchedData(req)) {
      if (key === 'product_ids') continue;
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
        try {
          imagePath = await saveFileToDisk(imageBuffer, imageName);
        } catch (error) {
          console.log(error);
          return res
            .status(500)
            .json({ error: error, message: "Error saving file" });
        }
        columns.push("image_path");
        values.push(imagePath);
        params.push(`$${paramCount}`);
        paramCount++;
      }

      const { rows } = await db(
        `INSERT INTO category (${columns}) VALUES (${params}) RETURNING *`,
        values,
        res
      );
      const createdCategory = rows?.[0];

      if (matchedData(req)?.product_ids) {
        const product_ids = matchedData(req).product_ids;
        await db.transaction(async (client) => {
          product_ids.map(async (product_id) => {
            await client.query(
              `INSERT INTO category_product (category_id, product_id) 
              VALUES ($1, $2)`,
              [createdCategory.category_id, product_id]
            );
          });
        });
      }
      
      res.json(rows?.[0])
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

    const columns = ['tstamp = $1'];
    const values = ['NOW()'];
    let paramsCounter = 2;

    const { rows } = await db(
      `SELECT * FROM category WHERE category_id = $1 LIMIT 1`,
      [category_id],
      res
    );
    currentImagePath = rows?.[0]?.image_path;
    if (rows.length === 0)
      return res.status(404).json({ error: "Non existant category." });

    for (const key in matchedData(req)) {
      if (key === "product_ids") continue;
      columns.push(`${key} = $${paramsCounter}`);
      values.push(matchedData(req)?.[key]);
      paramsCounter++;
    }

    try {
      if (newImage) {
        try {
          newImagePath = await saveFileToDisk(
            newImage.buffer,
            newImage.originalname
          );
        } catch (error) {
          console.log(error);
          return res
            .status(500)
            .json({ error: error, message: "Error saving file" });
        }

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

      if (matchedData(req)?.product_ids) {
        const product_ids = matchedData(req).product_ids;
        await db.transaction(async (client) => {
          await client.query(
            `DELETE FROM category_product WHERE category_id = $1`,
            [category_id]
          );

          product_ids.map(async (product_id) => {
            await client.query(
              `INSERT INTO category_product (category_id, product_id) 
              VALUES ($1, $2)`,
              [category_id, product_id]
            );
          });
        });
      } else {
        await db(`DELETE FROM category_product WHERE category_id = $1`, [
          category_id,
        ]);
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
