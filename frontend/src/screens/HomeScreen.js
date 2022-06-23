import { useReducer, useEffect } from 'react'
import axios from 'axios'
import logger from 'use-reducer-logger'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import Product from '../components/Product'
import SpinnerBox from '../components/SpinnerBox'
import MessageBox from '../components/MessageBox'
import { Store } from '../Store'

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
      } catch (err) {
        dispatch({ type: 'FETCH_FAIL', payload: err.message })
      }
    }
    fetchProducts()
  }, [])

  return (
    <main>
      <h1>Featured Items</h1>
      <div className='products'>
        {loading ? (
          <SpinnerBox />
        ) : error ? (
          <MessageBox variant='danger'> {error} </MessageBox>
        ) : (
          <Row>
            {products.map(product => (
              <Col sm={6} md={4} lg={3} key={product._id}>
                <Product product={product}></Product>
              </Col>
            ))}
          </Row>
        )}
      </div>
    </main>
  )
}

export default HomeScreen
