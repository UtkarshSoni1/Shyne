const express = require('express');
const app = express();
const ownersRouter = require("./routes/ownersRouter");
const usersRouter = require("./routes/usersRouter");
const productsRouter = require("./routes/productsRouter");
const indexRouter = require('./routes/index');
const session = require('express-session');
const flash = require('connect-flash');

const db = require("./config/mongoose-connection")

const cookieParser = require('cookie-parser');
const path = require('path');

require('dotenv').config();

app.use(express.json());
app.use(express.urlencoded({extended : true}));
app.use(cookieParser());
// app.use(express.static('public'));
app.use(express.static(path.join(__dirname, 'public')));
app.set("view engine","ejs");

app.use(session({
  secret: 'shyneSecret', // use a strong secret
  resave: false,
  saveUninitialized: false
}));
app.use(flash());

app.use((req, res, next) => {
  res.locals.messages = req.flash();
  next();
});

app.use("/owners",ownersRouter);
app.use("/users",usersRouter);
app.use("/products",productsRouter);
app.use("/", indexRouter);


app.listen(3000);