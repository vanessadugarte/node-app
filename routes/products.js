const express = require ('express');
const router = express.Router();
const path = require('path');
const fs = require ('fs');

const productFilePath = path.join(__dirname, '../data/product.json');
const readProducts= () => JSON.parse(fs.readFileSync(productFilePath, 'utf8')) ;
const writeProducts = (data) => fs.writeFileSync(productFilePath, JSON.stringify(data, null, 2));

router.get('/', (req,res) => {
    const products = readProducts();
    const limit = req.query.limit ? parseInt(req.query.limit) : products.length;
    res.json(products.slice(0, limit));
})

module.exports = router;

