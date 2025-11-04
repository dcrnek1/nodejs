const db = require("../db/db");
const { matchedData } = require("express-validator");
const { saveFileToDisk, deleteFileFromDisk } = require("../middleware/multer");

module.exports = {
  getProductById: async (req, res) => {
    const product_id = req?.params?.product_id;

    const { rows } = await db(
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
            where p.product_id = $1
            GROUP BY p.product_id
            ORDER BY p.product_id`,
      [product_id],
      res
    );
    rows.length > 0
      ? res.json(rows?.[0])
      : res.status(404).json({ message: "Product not found." });
  },

  getAllProducts: async (req, res) => {
    const { rows } = await db(
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
        ORDER BY p.product_id`,
      []
    );

    rows?.length > 0
      ? res.json(rows?.[0])
      : res.status(404).json({ message: "Product not found" });
  },

  createProduct: async (req, res) => {
    if (!req?.files?.image) {
      return res
        .status(400)
        .json({ errors: [{ path: "image", msg: "Image can not be empty." }] });
    }
    const validatedData = matchedData(req);

    const columns = [];
    const values = [];
    const parameters = [];
    let parametersCounter = 1;

    //Map validated data to query builder vars
    Object.keys(validatedData).forEach((key) => {
      if (key === "categories") return;
      columns.push(key);
      values.push(validatedData[key]);
      parameters.push(`$${parametersCounter}`);
      parametersCounter++;
    });

    //Upload image and save path to query builder vars
    let image_path = "";
    try {
      image_path = await saveFileToDisk(
        req.files.image[0].buffer,
        req.files.image[0].originalname
      );
      columns.push("image_path");
      values.push(image_path);
      parameters.push(`$${parametersCounter}`);
      parametersCounter++;
    } catch (error) {
      return res.status(500).json({ error: error, message: "File upload failed." });
      
    }

    try {
      const createdProduct = await db(
        `INSERT INTO product (${columns.join(", ")}) VALUES (${parameters.join(
          ", "
        )}) RETURNING *`,
        values
      );
      //Insert categories into category_product
      let categoriesInsertError = false;
      if (validatedData.categories) {
        const categoryValues = [createdProduct.rows[0].product_id];
        const categoryParams = [];
        let categoryParamsCounter = 2;

        validatedData.categories.forEach((value) => {
            categoryParams.push(`($1, $${categoryParamsCounter})`)
            categoryValues.push(value);
            categoryParamsCounter++;
        })

        try {
            await db(`INSERT INTO category_product (product_id, category_id)
            VALUES ${categoryParams.join(', ')} RETURNING *`, categoryValues);
        } catch (error) {
            console.log(error);
            categoriesInsertError = true;
        }
      }

      res.json({...createdProduct.rows[0], warning: categoriesInsertError ? 'Product created but categories could not be linked' : null})
    } catch (error) {
      console.log(error);
      deleteFileFromDisk(image_path);
      res.status(500).json({ error: error, message: "Internal server error." });
    }
  },

  deleteProduct: (req, res) => {},
};
