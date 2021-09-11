const express      = require("express");
const app          = express();
const bodyParser   = require("body-parser");
const morgan       = require("morgan");
const mongoose     = require("mongoose");
const cors         = require('cors');
const authJwt      = require('./middlewares/jwt');
const errorHandler = require('./middlewares/error-handler');

require("dotenv/config");

app.use(cors());
app.options('*' , cors());

// Middleware for body-parser
app.use(bodyParser.json());

// Middleware to know type of request
app.use(morgan("tiny"));

// Middleware for protect api
app.use(authJwt());

// Middleware for error-Handling
app.use(errorHandler);

const productRouters  = require('./routers/product.route');
const categoryRouters = require('./routers/category.route');
const userRouters     = require('./routers/user.route');
const orderRouters    = require('./routers/order.route');

// Routers
app.use(`${process.env.API_URL}/products` , productRouters);
app.use(`${process.env.API_URL}/categories` , categoryRouters);
app.use(`${process.env.API_URL}/users` , userRouters);
app.use(`${process.env.API_URL}/orders` , orderRouters);

mongoose
  .connect(
    `mongodb+srv://${process.env.DBUSERNAME}:${process.env.DBPASSWORD}@${process.env.DBSERVER}/${process.env.DB}`,
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    }
  )
  .then(() => console.log("Database Connection is ready..."))
  .catch((e) => console.log("Error is : " + e));

// Cloudinary Config
const cloudinary = require('cloudinary');
cloudinary.config({ 
  cloud_name : process.env.CLOUDINARY_CLOUD_NAME,
  api_key    : process.env.CLOUDINARY_CLOUD_KEY ,
  api_secret : process.env.CLOUDINARY_CLOUD_SECRET
});

const PORT = process.env.PORT;
app.listen(PORT, () => {
  console.log("server is running http://localhost:3000");
});
