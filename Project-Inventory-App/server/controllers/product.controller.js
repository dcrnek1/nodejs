
module.exports = {
    getAllProducts: (req, res) => {
        console.log(req.body || "No body data");
        res.json({message: "Get all products"});
    }
}