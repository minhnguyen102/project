const { createServer } = require('node:http');
const { join } = require('node:path');
const { Server } = require('socket.io');
const express = require('express')
var path = require('path');
const database = require("./config/database")
const router = require("./routes/client/index.router") // router client (severSide)
var cors = require('cors')
const routerApi = require("./api/v1/routes/index.router")
const routerAdmin = require("./routes/admin/index.router") // router client(clientSide)
const app = express()
const port = 3000
const methodOverride = require("method-override") 
const flash = require("express-flash")
const cookieParser = require('cookie-parser')
const session = require('express-session')
const bodyParser = require('body-parser')
const moment = require("moment");



database.connect();

// tiny MCE
app.use('/tinymce', express.static(path.join(__dirname, 'node_modules', 'tinymce')));
// End tiny MCE

//socketIO
const server = createServer(app);
const io = new Server(server);

io.on("connection", (socket) => {
  console.log('a user connected', socket.id)
})

app.use(cors())

// methodOverride 
app.use(methodOverride("_method"))

// flash 
app.use(cookieParser('NKMTTL'));
app.use(session({ cookie: { maxAge: 60000 }}));
app.use(flash());;

// body-parser
app.use(bodyParser.urlencoded({ extended: false }))

// parse application/json
app.use(bodyParser.json())

// pugjs
app.set("views", `${__dirname}/views`)
app.set("view engine", "pug")

// moment
app.locals.moment = moment;

// STATIC FILE : 
app.use(express.static(`${__dirname}/public`))

// router
// router(app);
routerApi(app);
routerAdmin(app)

// ENV 
require("dotenv").config();
const PORT = process.env.PORT;


// App locals variables 
const systemConfig = require("./config/system")
app.locals.prefixAdmin = systemConfig.prefixAdmin;



server.listen(port, () => {
  console.log(`Example app listening on port ${PORT}`)
})
