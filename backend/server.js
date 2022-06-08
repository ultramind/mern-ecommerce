import express from 'express'
import mongoose from 'mongoose'
import dotenv from 'dotenv'
import data from './data.js'
import seedRouter from './routes/seedRoutes.js'
import productRouter from './routes/productRoutes.js'
import userRouter from './routes/usersRoutes.js'

const app = express()
dotenv.config()
app.use(express.json())

mongoose
  .connect(process.env.MONGODB_URL)
  .then(() => console.log('DB connected...'))
  .catch(err => console.log(err))

// routes
app.use('/api/seed/', seedRouter)
app.use('/api/products/', productRouter)
app.use('/api/user/', userRouter)

const port = process.env.PORT || 5000

// error handler
app.use((err, req, res, next) => {
  res.status(500).send({ message: err.message })
})

// server listing at port
app.listen(port, () => {
  console.log(`Server up and runing on port: ${port}`)
})
