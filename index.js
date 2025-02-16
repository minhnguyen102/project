const express = require('express')
const mongoose = require("mongoose")
const database = require("./config/database")
const router = require("./routes/client/index.router")
const routerAdmin = require("./routes/admin/index.router")
const app = express()
const port = 3000
const methodOverride = require("method-override") 
const flash = require("express-flash")
const cookieParser = require('cookie-parser')
const session = require('express-session')
const bodyParser = require('body-parser')

database.connect();


// methodOverride 
app.use(methodOverride("_method"))

// flash 
app.use(cookieParser('NKMTTL'));
app.use(session({ cookie: { maxAge: 60000 }}));
app.use(flash());;

// body-parser
app.use(bodyParser.urlencoded({ extended: false }))

// pugjs
app.set("views", "./views")
app.set("view engine", "pug")

// router
router(app);
routerAdmin(app)

// ENV 
require("dotenv").config();
const PORT = process.env.PORT;

// STATIC FILE
app.use(express.static("public"))

// App locals variables 
const systemConfig = require("./config/system")
app.locals.prefixAdmin = systemConfig.prefixAdmin;



app.listen(port, () => {
  console.log(`Example app listening on port ${PORT}`)
})
