const express = require ('express');
const router = express.Router();
const path = require('path');
const fs = require ('fs');

const productFilePath = path.join(__dirname, '../data/products.json');
const readProducts= () => JSON.parse(fs.readFileSync(productFilePath, 'utf8')) ;
const writeProducts = (data) => fs.writeFileSync(productFilePath, JSON.stringify(data, null, 2));



