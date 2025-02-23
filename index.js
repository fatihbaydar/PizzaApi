"use strict"

/*
    $ cp .env-sample .env
    $ npm init -y
    $ npm i express dotenv mongoose express-async-errors
    $ npm i morgan swagger-autogen swagger-ui-express redoc-express
    $ mkdir logs
    $ nodemon
*/
const express = require('express')
const app = express()

/* ------------------------------------------------------- */
// Required Modules:

// envVariables to process.env:
require('dotenv').config()
const PORT = process.env?.PORT || 8000
/* ------------------------------------------------------- */

//* JSON
const path = require("path");
app.use("/documents/json", (req, res) => { 
    res.sendFile(path.join(__dirname, "src/configs/swagger.json"));
});

//* SWAGGER

const swaggerUi = require("swagger-ui-express")
const swaggerJson = require("./src/configs/swagger.json")
app.use("/documents/swagger", swaggerUi.serve, swaggerUi.setup(swaggerJson, { swaggerOptions: { persistAuthorization: true } }))

//* REDOC

const redoc = require("redoc-express")
app.use("/documents/redoc", redoc({ specUrl: "/documents/json", title: "Redoc UI" }))
/* ------------------------------------------------------- */

// asyncErrors to errorHandler:
require('express-async-errors')

/* ------------------------------------------------------- */
// Configrations:

// Connect to DB:
const { dbConnection } = require('./src/configs/dbConnection')
dbConnection()

/* ------------------------------------------------------- */
// Middlewares:

// Accept JSON:
app.use(express.json())

// Logger:
app.use(require('./src/middlewares/logger'))

// Auhentication:
app.use(require('./src/middlewares/authentication'))

// findSearchSortPage / res.getModelList:
app.use(require('./src/middlewares/queryHandler'))

/* ------------------------------------------------------- */
// Routes:

// Static Files
// app.use("/url", express.static("./folder"))
app.use("/upload", express.static("./upload"))
// routes/index.js:
app.use('/', require('./src/routes/'))

// HomePath:
app.all('/', (req, res) => {
    res.send({
        error: false,
        message: 'Welcome to PIZZA API',
        docs: {
            swagger: "/documents/swagger",
            redoc: "/documents/redoc",
            json: "/documents/json",
        },
        user: req.user,
    })
})

/* ------------------------------------------------------- */

// errorHandler:
app.use(require('./src/middlewares/errorHandler'))

// RUN SERVER:
app.listen(PORT, () => console.log('http://127.0.0.1:' + PORT))

/* ------------------------------------------------------- */
// Syncronization (must be in commentLine):
// require('./src/helpers/sync')() // !!! It clears database.