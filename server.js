const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const cors = require('cors')
require('dotenv').config()
const connectDB = require('./config/db')

app.use(cors())
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))
app.use(express.json())

const port = process.env.PORT || 3000

connectDB()
app.get('/', (req, res) => {
    res.status(200).send('Hello World!')
})
app.use('/admin', require('./routes/adminRoutes'))
app.use('/', require('./routes/userRoutes'))
app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
})

