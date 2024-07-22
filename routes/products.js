const express = require ('express');
const router = express.Router();
const path = require('path');
const fs = require ('fs');
const { v4: uuidv4 } = require('uuid');
const {io} = require ('../index')

const productFilePath = path.join(__dirname, '../data/product.json');
const readProducts = () => {
    try {
        const data = fs.readFileSync(productFilePath);
        return JSON.parse(data);
    } catch (error) {
        if (error.code === 'ENOENT') {
            return [];
        }
        throw error;
    }
};
const writeProducts = (data) => fs.writeFileSync(productFilePath, JSON.stringify(data, null, 2));


module.exports= (io) => {
    router.get('/', (req, res) => {
        const products = readProducts();
        const limit = req.query.limit ? parseInt(req.query.limit) : products.length;
        res.json(products.slice(0, limit));
    })

    router.post('/', (req, res) => {
        const products = readProducts();
        const {title, description, code, price, status = true, stock, category, thumbnails} = req.body;

        if (!title || !description || !code || !price || !stock || !category) {
            return res.status(400).send("Todos los parámetros, excepto thumbnails, son requeridos")
        }

        const obj = {
            id: uuidv4(),
            title: title,
            description: description,
            code: code,
            price: price,
            status: status,
            stock: stock,
            category: category,
            thumbnails: thumbnails
        };

        products.push(obj);
        writeProducts(products);
        res.status(201).json(obj);
        io.emit('updateProducts', products);
    })

    router.get('/:pid', (req, res) => {
        const products = readProducts();
        const product = products.find((el) => {
            return el.id === req.params.pid
        })
        if (product) {
            res.json(product);
        } else {
            res.status(404).send("No se encontró el producto")
        }
    });


    router.put('/:pid', (req, res) => {
        const products = readProducts();
        const product = products.findIndex((el) => {
            return el.id === req.params.pid
        })
        if (product !== -1) {
            const element = products.find((el) => {
                return el.id === req.params.pid
            })
            const updateProduct = {
                id: element.id,
                title: req.body?.title ? req.body.title : element.title,
                description: req?.body.description ? req.body.description : element.description,
                code: req.body?.code ? req.body.code : element.code,
                price: req.body?.price ? req.body.price : element.price,
                status: req.body?.status ? req.body.status : element.status,
                stock: req.body?.stock ? req.body.stock : element.stock,
                category: req?.body.category ? req.body.category : element.category,
                thumbnails: req?.body.thumbnails ? req.body.thumbnails : element.thumbnails
            }
            products[product] = updateProduct;
            writeProducts(products);
            res.status(200).json(updateProduct);
            io.emit('updateProducts', products);
        } else {
            res.status(404).send("No se encontró el producto")
        }

    })

    router.delete('/:pid', (req, res) => {
        const products = readProducts();
        const product = products.findIndex((el) => {
            return el.id === req.params.pid
        })
        if (product === -1) {
            return res.status(404).send("No se encontró el producto")
        }
        products.splice(product, 1);
        writeProducts(products);
        res.status(200).send();
        io.emit('deleteProducts', products);
    })
    return router;
}

