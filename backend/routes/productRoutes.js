import express from 'express'
import Product from '../models/ProductModel.js'

const productRouter = express.Router()

// get all products
productRouter.get('/', async (req, res) => {
  let products
  try {
    products = await Product.find({})
    if (products) {
      res.send(products)
    } else {
      res.status(404).json({ message: 'No product found' })
    }
  } catch (error) {
    res.status(401).send(error)
  }
})

// fetch all products by slug
productRouter.get('/slug/:slug', async (req, res) => {
  const { slug } = req.params
  const product = await Product.findOne({ slug })
  if (product) {
    res.send(product)
  } else {
    res.status(404).send({ message: 'No product found' })
  }
})

// fetch indivual product by id
productRouter.get('/:id', async (req, res) => {
  const { id } = req.params
  try {
    const product = await Product.findById(id)
    if (product) {
      res.send(product)
    } else {
      res.status(404).send({ message: 'No product found' })
    }
  } catch (error) {
    res.send(error.message)
  }
})

export default productRouter
