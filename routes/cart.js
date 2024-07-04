const express = require ('express');
const router = express.Router();
const path = require('path');
const fs = require ('fs');
const { v4: uuidv4 } = require('uuid');

const cartFilePath = path.join(__dirname, '../data/cart.json');
const readCarts= () => JSON.parse(fs.readFileSync(cartFilePath, 'utf8')) ;
const writeCarts = (data) => fs.writeFileSync(cartFilePath, JSON.stringify(data, null, 2));

router.get( '/:pid', (req,res) => {
    const carts = readCarts();
    const cart = carts.find((el)=>{
        return el.id === req.params.pid
    })
    if(cart){
        res.json(cart);
    } else {
        res.status(404).send("No se encontró el producto")
    }
});