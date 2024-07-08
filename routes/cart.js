const express = require ('express');
const router = express.Router();
const path = require('path');
const fs = require ('fs');
const { v4: uuidv4 } = require('uuid');

const cartFilePath = path.join(__dirname, '../data/cart.json');
const productFilePath = path.join(__dirname, '../data/product.json');
const readCarts= () => JSON.parse(fs.readFileSync(cartFilePath, 'utf8')) ;
const readProducts= () => JSON.parse(fs.readFileSync(productFilePath, 'utf8')) ;
const writeCarts = (data) => fs.writeFileSync(cartFilePath, JSON.stringify(data, null, 2));

router.get( '/:cid', (req,res) => {
    const carts = readCarts();
    const cart = carts.find((el)=>{
        return el.id === req.params.cid
    })
    if(cart){
        res.status(200).json(cart);
    } else {
        res.status(404).send("No se encontró el carro")
    }
});

router.post( '/', (req,res) => {
        const carts = readCarts();
        const newCart = {
            id: uuidv4(),
            products: []
        }
        carts.push(newCart);
        writeCarts(carts);
        res.status(201).json(newCart);


});

router.post( '/:cid/product/:pid', (req,res) => {
    const carts = readCarts();
    const products = readProducts();
    const cart = carts.find((el)=>{
        return el.id === req.params.cid
    })
    if(!cart){
       return res.status(404).send("Carro no encontrado");
    }
    const product = cart.products.findIndex((el)=>{
        return el.product === req.params.pid
    })
    if(product !== -1) {
       cart.products[product].quantity += 1;
    } else {
        cart.products.push({
            product: req.params.pid,
            quantity:1
        })
    }
    writeCarts(carts)
    res.status(201).json(cart)
});

module.exports = router;