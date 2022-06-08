import express from 'express'
import mongoose from 'mongoose'
import dotenv from 'dotenv'
import data from './data.js'
import seedRouter from './routes/seedRoutes.js'
import productRouter from './routes/productRoutes.js'

const app = express()
dotenv.config()

mongoose
  .connect(process.env.MONGODB_URL)
  .then(() => console.log('DB connected...'))
  .catch(err => console.log(err))

// routes
app.use('/api/seed/', seedRouter)
app.use('/api/products/', productRouter)





const port = process.env.PORT || 5000

app.listen(port, () => {
  console.log(`Server up and runing on port: ${port}`)
})
