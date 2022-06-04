import React, { useReducer, useEffect } from 'react'
import { Link } from 'react-router-dom'
import data from '../data'
import axios from 'axios'
import logger from 'use-reducer-logger'

const reducer = (state, action) => {
  switch (action.type) {
    case 'FETCH_REQUEST':
      return { ...state, loading: true }
    case 'FETCH_SUCCESS':
      return { ...state, loading: false, products: action.payload }
    case 'FETCH_FAIL':
      return { ...state, loading: false, error: action.payload }

    default:
      return state
  }
}

const HomeScreen = () => {
  //const [products, setProducts] = useState([])
  const [{ loading, products, error }, dispatch] = useReducer(logger(reducer), {
    loading: false,
    products: [],
    error: ''
  })

  useEffect(() => {
    const fetchProducts = async () => {
      dispatch({ type: 'FETCH_REQUEST' })
      try {
        const result = await axios.get('api/products/')
        dispatch({ type: 'FETCH_SUCCESS', payload: result.data })
      } catch (error) {
        dispatch({ type: 'FETCH_FAIL', payload: error.message })
      }
    }
    fetchProducts()
  }, [])

  return (
    <main>
      <h1>Featured Items</h1>
      <div className='products'>
        {loading ? (
          <div>Loading...</div>
        ) : error ? (
          <div>{error}</div>  
        ) : (
          products.map(product => (
            <div key={product.slug} className='product'>
              <Link to={`/product/${product.slug}`}>
                <img src={product.images} alt={product.slug} />
              </Link>
              <div className='product_info'>
                <Link to={`/product/${product.slug}`}>
                  <h4>{product.name}</h4>
                </Link>
                {/* <p> {product.category} </p> */}
                <p>
                  <strong>${product.price}</strong>
                </p>
                <button>Add to Cart</button>
              </div>
            </div>
          ))
        )}
      </div>
    </main>
  )
}

export default HomeScreen
