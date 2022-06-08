import express from 'express'
import data from '../data.js'
import Product from '../models/ProductModel.js'

const seedRouter = express.Router()

seedRouter.get('/', async (req, res) => {
  await Product.deleteMany({})
  try {
    const createdSeed = await Product.insertMany(data.products)
    res.send(createdSeed)
  } catch (error) {
    res.status(401).send(error)
  }
})

export default seedRouter
