
const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const cors = require('cors')
require('dotenv').config()
const connectDB = require('./config/db')

/* Allowing the server to accept requests from other domains. */
app.use(cors())

/* Parsing the body of the request. */
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))

/* A middleware that parses the body of the request. */
app.use(express.json())

/* Getting the port from the .env file. */
const port = process.env.PORT

/* Connecting to the database. */
connectDB()

/* This is a route that is used to test if the server is running. */
app.get('/', (req, res) => {
    res.status(200).send('Hello World!')
})
/* Importing the adminRoutes.js file and using it as a middleware. */
app.use('/admin', require('./routes/adminRoutes'))

/* Importing the userRoutes.js file and using it as a middleware. */
app.use('/', require('./routes/userRoutes'))

/* Listening to the port that is defined in the .env file. */
app.listen(port, () => {
    console.log(`Server is running on port ${port}`)
})

