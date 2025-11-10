const db = require("../db/db");
const { matchedData } = require("express-validator");
const { saveFileToDisk, deleteFileFromDisk } = require("../middleware/multer");

function buildCategoryProductInsertValues(product_id, category_ids = []) {
  const categoryValues = [product_id];
  const categoryParams = [];
  let categoryParamsCounter = 2;

  category_ids.forEach((value) => {
    categoryParams.push(`($1, $${categoryParamsCounter})`);
    categoryValues.push(value);
    categoryParamsCounter++;
  });

  return { categoryParams, categoryValues };
}

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
      : res.status(404).json({ message: "Product not found." });
  },

  getAllProductsByCategory: async (req, res) => {
    const category_id = req?.params?.category_id;
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
        WHERE EXISTS (
            SELECT 1
            FROM category_product cp2
            WHERE cp2.product_id = p.product_id
              AND cp2.category_id = $1
        )
        GROUP BY p.product_id
        ORDER BY p.product_id`,
      [category_id]
    );

    rows?.length > 0
      ? res.json(rows)
      : res.status(204).json({message: "test"});
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
      return res
        .status(500)
        .json({ error: error, message: "File upload failed." });
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
        const { categoryParams, categoryValues } =
          buildCategoryProductInsertValues(
            createdProduct.rows[0].product_id,
            validatedData.categories
          );

        try {
          await db(
            `INSERT INTO category_product (product_id, category_id)
            VALUES ${categoryParams.join(", ")} RETURNING *`,
            categoryValues
          );
        } catch (error) {
          console.log(error);
          categoriesInsertError = true;
        }
      }

      res.json({
        ...createdProduct.rows[0],
        warning: categoriesInsertError
          ? "Product created but categories could not be linked"
          : null,
      });
    } catch (error) {
      console.log(error);
      deleteFileFromDisk(image_path);
      return res
        .status(500)
        .json({ error: error, message: "Internal server error." });
    }
  },

  updateProduct: async (req, res, next) => {
    // Get product id of product we want to update
    const product_id = req?.params?.product_id;

    //If that product doesnt exist return res 404 not found
    let existingProduct = await db(
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
        ORDER BY p.product_id desc`,
      [product_id]
    ).catch((err) =>
      res.status(500).json({ error: err, message: "Internal server error" })
    );
    existingProduct = existingProduct?.rows?.[0];
    if (!existingProduct)
      return res.status(404).json({ message: "Product not found." });

    //Get new image and Save it if uploaded
    const newImagePath = req?.files?.image?.[0]
      ? await saveFileToDisk(
          req?.files?.image?.[0].buffer,
          req?.files?.image?.[0].originalname
        ).catch((err) => {
          console.log(err);
          res
            .status(500)
            .json({ error: err, message: "Internal server error" });
        })
      : false;
    //Data for updating
    const newData = matchedData(req);
    const newCategories = newData?.categories || [];
    //Build query for updateing PRODUCT values
    const parameters = [];
    const values = [product_id];
    let parametersCounter = 2;

    Object.entries(newData).forEach(([key, value]) => {
      if (key === "categories") return;
      parameters.push(`${key} = $${parametersCounter}`);
      values.push(value);
      parametersCounter++;
    });
    //Add image if exists
    if (newImagePath) {
      parameters.push(`image_path = $${parametersCounter}`);
      values.push(newImagePath);
      parametersCounter++;
    }

    //Execute query for update if there are fields to update
    let updatedProduct = null;
    if (parameters.length > 0) {
      try {
        updatedProduct = await db(
          `UPDATE product SET ${parameters} WHERE product_id = $1 RETURNING *`,
          values
        ).then(({ rows }) => rows?.[0]);
        //If succeeds then
        // remove from disk existingProduct.image_path if newimage exists
        if (newImagePath) await deleteFileFromDisk(existingProduct.image_path);
      } catch (error) {
        //If fails
        // remove from disk newImagePath if it exists
        if (newImagePath) await deleteFileFromDisk(newImagePath);
        return res
          .status(500)
          .json({ error: error, message: "Internal server error." });
      }
    }

    // If categories are sent
    let insertedCategories = null;
    let categoriesInsertError = false;

    // delete existing categories always
    await db(`DELETE FROM category_product WHERE product_id = $1`, [
      existingProduct.product_id,
    ]);

    if (newCategories.length > 0) {
      // Build query for inserting new categories
      const { categoryParams, categoryValues } =
        buildCategoryProductInsertValues(
          existingProduct.product_id,
          newCategories
        );
      try {
        // execute new categories
        insertedCategories = await db(
          `WITH inserted AS (
            INSERT INTO category_product (product_id, category_id)
            VALUES ${categoryParams.join(", ")}
            RETURNING category_id
            )
            SELECT c.*
            FROM category c
            JOIN inserted i ON c.category_id = i.category_id`,
          categoryValues
        ).then(({ rows }) => rows);
      } catch (error) {
        console.log(error);
        categoriesInsertError = true;
        console.log("insert error", categoriesInsertError);
      }
    }

    if (updatedProduct) {
      return res.json({
        ...updatedProduct,
        categories: insertedCategories
          ? insertedCategories
          : categoriesInsertError
          ? []
          : existingProduct.categories,
        warning: categoriesInsertError
          ? "Product updated, but saving of categories failed."
          : null,
      });
    } else {
      return res.json({
        ...existingProduct,
        categories: insertedCategories
          ? insertedCategories
          : categoriesInsertError
          ? []
          : existingProduct.categories,
        warning: categoriesInsertError
          ? "Product updated, but saving of categories failed."
          : null,
      });
    }
  },

  deleteProduct: async (req, res) => {
    const product_id = req.params.product_id;

    try {
      await db.transaction(async (client) => {
        const {
          rows: [{ image_path: existingImagePath } = { image_path: null }],
        } = await client.query(
          `SELECT image_path FROM product WHERE product_id = $1`,
          [product_id]
        );
        const deletedProductResult = await client.query(
          `DELETE FROM product where product_id = $1`,
          [product_id]
        );
        await client.query(
          `DELETE FROM category_product where product_id = $1`,
          [product_id]
        );

        if (existingImagePath) await deleteFileFromDisk(existingImagePath);

        deletedProductResult.rowCount === 0
          ? res.status(404).json({ message: "Product not found." })
          : res.json({ message: "Product succesfully deleted." });
      });
    } catch (error) {
      console.log(error);
      res.status(500).json({ error: error, message: "Internal server error." });
    }
  },
};
