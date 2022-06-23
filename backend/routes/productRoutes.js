import express, { query } from 'express'
import expressAsyncHandler from 'express-async-handler'
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

// fetch Categories
productRouter.get(
  '/categories',
  expressAsyncHandler(async (req, res) => {
    const categories = await Product.find().distinct('category')
    res.send(categories)
    // console.log(categories)
  })
)

// Fetch product by serach
// search API
const PAGE_SIZE = 3
productRouter.get(
  '/search',
  expressAsyncHandler(async (req, res) => {
    const { query } = req
    const pageSize = query.pageSize || PAGE_SIZE
    const page = query.page || 1
    const category = query.category || ''
    const brand = query.brand || ''
    const price = query.price || ''
    const rating = query.rating || ''
    const order = query.order || ''
    const searchQuery = query.query || ''

    // seach query
    const queryFilter =
      searchQuery && searchQuery !== 'all'
        ? {
            name: {
              $regex: searchQuery,
              $options: 'i'
            }
          }
        : {}

    // search using category
    const categoryFilter = category && category !== 'all' ? { category } : {}

    // search by rating
    const ratingFilter =
      rating && rating !== 'all'
        ? {
            rating: {
              $gte: Number(rating)
            }
          }
        : {}

    // search/Filter by price
    const priceFilter =
      price && price !== 'all'
        ? {
            price: {
              $gte: Number(price.split('-')[0]),
              $lte: Number(price.split('-')[1])
            }
          }
        : {}

    // sort by order
    const sortOrder =
      order === 'featured'
        ? { featured: -1 }
        : order === 'lowest'
        ? { price: -1 }
        : order === 'highest'
        ? { price: -1 }
        : order === 'toprated'
        ? { rating: -1 }
        : order === 'newest'
        ? { createdAt: -1 }
        : { _id: -1 }

    // find in mongoDB model
    const products = await Product.find({
      ...categoryFilter,
      ...priceFilter,
      ...ratingFilter,
      ...queryFilter
    })
      .sort(sortOrder)
      .skip(pageSize * (page - 1))
      .limit(pageSize)

    // count the search items
    const countProducts = await Product.countDocuments({
      ...queryFilter,
      ...priceFilter,
      ...searchQuery,
      ...ratingFilter
    })

    // sending the object to the frontend
    res.send({
      products,
      countProducts,
      page,
      pages: Math.ceil(countProducts / pageSize)
    })
  })
)

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
