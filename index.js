const express = require ('express');
const app = express();
const productsRouter = require ("./routes/products");
const cartsRouter = require ("./routes/cart");

app.use(express.json());
app.use('/api/products', productsRouter)
//app.use('/api/carts', cartsRouter)


const PORT = 8080;
app.listen(PORT, () => {
    console.log(`server is running on port ${PORT} by Vanessa`)
})
