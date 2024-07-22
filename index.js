const express = require ('express');
const http = require ('http');
const app = express();
const productsRouter = require ("./routes/products");
const cartsRouter = require ("./routes/cart");
const viewsRouter = require ("./routes/views");
const path = require("path")
const fs = require ('fs');
const { Server } = require('socket.io');
const handlebars = require("handlebars");
const {engine} = require("express-handlebars");

const server = http.createServer(app);
const io = new Server(server);

app.engine("handlebars",engine());
app.set("view engine", "handlebars");
app.set("views", path.join(__dirname,"views"))

app.use(express.json());
app.use(express.urlencoded({extended:true}))
app.use(express.static(path.join(__dirname, 'public')));

app.use('/api/products', require('./routes/products')(io));
app.use('/api/carts', cartsRouter)
app.use('/', viewsRouter)



const PORT = 8080;
app.listen(PORT, () => {
    console.log(`server is running on port ${PORT} by Vanessa`)
})
