const express = require ('express');
const bodyParser = require('body-parser');
const http = require ('http');
const app = express();
const productsRouter = require ("./routes/products");
const cartsRouter = require ("./routes/cart");
const path = require("path")
const {Server} = require('socket.io');
const handlebars = require("express-handlebars");

const server = http.createServer(app);
const io = new Server(server);

app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));

app.engine("handlebars",handlebars.engine());
app.set("view engine", "handlebars");
app.set("views", path.join(__dirname,"views"))

/*app.use(express.json());
app.use(express.urlencoded({extended:true}))
*/

app.use('/api/products', productsRouter(io));
app.use('/api/carts', cartsRouter)
app.use('/', require('./routes/views'));

io.on('connection', (socket) => {
    console.log('New client connected');

    socket.on('disconnect', () => {
        console.log('Client disconnected');
    });

});

const PORT = 8080;
server.listen(PORT, () => {
    console.log(`server is running on port ${PORT} by Vanessa`)
})

module.exports = { app, server, io };