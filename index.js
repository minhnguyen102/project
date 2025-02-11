const express = require('express')
const mongoose = require("mongoose")
const database = require("./config/database")
const router = require("./routes/client/index.router")
const routerAdmin = require("./routes/admin/index.router")
const app = express()
const port = 3000

database.connect();

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
