const express = require("express");
const app = express();
const morgan = require("morgan");
const mongoose = require("mongoose");
const cors = require("cors");
const authJwt = require('./helpers/jwt');
const errorHandler = require('./helpers/error-handler');
require("dotenv/config");

app.use(cors());
app.options("*", cors());

//middleware
app.use(express.json());
app.use(morgan('tiny'));

app.use(errorHandler);
app.use("/public/uploads", express.static(__dirname + "/public/uploads"));

const usersRoutes = require("./routes/user");
const brandsRoutes = require("./routes/brand");
const productsRoutes = require("./routes/product");
const orderRoutes = require("./routes/order");

app.use(`/api/v1/users`, usersRoutes);
app.use(`/api/v1/brands`, brandsRoutes);
app.use(`/api/v1/products`, productsRoutes);
app.use(`/api/v1/orders`, orderRoutes);

module.exports = app;

//Routes
// const categoriesRoutes = require("./routes/categories");
// const productsRoutes = require("./routes/products");

// const ordersRoutes = require("./routes/orders");



// app.use(`${api}/categories`, categoriesRoutes);
// app.use(`${api}/products`, productsRoutes);

// app.use(`${api}/orders`, ordersRoutes);

//Database
// mongoose
//   .connect(process.env.CONNECTION_STRING, {
//     useNewUrlParser: true,
//     useUnifiedTopology: true,
//     // dbName: "eshop",
//   })
//   .then(() => {
//     console.log("Database Connection is ready...");
//   })
//   .catch((err) => {
//     console.log(err);
//   });

// //Server
// app.listen(4000, () => {
//   console.log("server is running http://localhost:4000");
// });