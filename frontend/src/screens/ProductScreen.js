import { useReducer, useEffect, useContext } from 'react'
import { useParams } from 'react-router-dom'
import axios from 'axios'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import Badge from 'react-bootstrap/Badge'
import ListGroup from 'react-bootstrap/ListGroup'
import Rating from '../components/Rating'
import { Helmet } from 'react-helmet-async'
import SpinnerBox from '../components/SpinnerBox'
import { getError } from '../utils.js'
import MessageBox from '../components/MessageBox'
import { Store } from '../Store'

// creating a reducer function to handle the fetching one product
const reducer = (state, action) => {
  switch (action.type) {
    case 'FETCH_REQUEST':
      return { ...state, loading: true }
    case 'FETCH_SUCCESS':
      return { ...state, product: action.payload, loading: false }
    case 'FETCH_FAIL':
      return { ...state, loading: false, error: action.payload }
    default:
      return state
  }
}

const ProductScreen = () => {
  // initializing contex
  const { state, dispatch: ctxDispatch } = useContext(Store)
  const { cart } = state

  const params = useParams()
  const { slug } = params

  const [{ product, loading, error }, dispatch] = useReducer(reducer, {
    product: [],
    loading: false,
    error: ''
  })

  useEffect(() => {
    const fetchProduct = async () => {
      dispatch({ type: 'FETCH_REQUEST' })
      try {
        const result = await axios.get(`/api/products/slug/${slug}`)
        dispatch({ type: 'FETCH_SUCCESS', payload: result.data })
      } catch (err) {
        dispatch({ type: 'FETCH_FAIL', payload: getError(err) })
      }
    }
    fetchProduct()
  }, [slug])

  // Add to cart function
  const addToCart = async () => {
  
    // checnking if item exits
    const exitsItem = cart.cartItems.find(x => x._id === product._id)
    const quantity = exitsItem ? exitsItem.quantity + 1 : 1
    // checking the item stock qty
    const { data } = await axios.get(`/api/products/${product._id}`)
    if (data.countInStock < quantity) {
      window.alert('Sorry product is out of stock')
      return;
    }
    ctxDispatch({ type: 'CART_ADD_ITEM', payload: { ...product, quantity} })
  }

  return (
    <div className='mt-4'>
      {loading ? (
        <SpinnerBox />
      ) : error ? (
        <MessageBox variant='danger'>{error}</MessageBox>
      ) : (
        <Row>
          <Helmet>
            <title>{product.name}</title>
          </Helmet>
          <Col md={5}>
            <img
              className='img-large'
              src={product.images}
              alt={product.name}
            />
          </Col>
          <Col md={4}>
            <ListGroup variant='flush'>
              <ListGroup.Item>
                <h1>{product.name}</h1>
              </ListGroup.Item>
              <ListGroup.Item>
                <Rating reviews={product.numReviews} rating={product.rating} />
              </ListGroup.Item>
              <ListGroup.Item>
                <Row>
                  <Col md={2}>
                    <strong>Price: </strong>
                  </Col>
                  <Col md={10}>${product.price}</Col>
                </Row>
              </ListGroup.Item>
              <ListGroup.Item>
                <Row>
                  <Col md={5}>
                    <strong>Description:</strong>
                  </Col>
                  <Col md={7}>{product.description}</Col>
                </Row>
              </ListGroup.Item>
            </ListGroup>
          </Col>
          <Col md={3}>
            <ListGroup>
              <ListGroup.Item>
                <Row>
                  <Col md={2}>
                    <strong>Price: </strong>
                  </Col>
                  <Col md={10}>$ {product.price}</Col>
                </Row>
              </ListGroup.Item>
              <ListGroup.Item>
                <Row>
                  <Col md={4}>
                    <strong>Status:</strong>
                  </Col>
                  <Col md={8}>
                    {product.countInStock > 0 ? (
                      <Badge variant='success'>In stock</Badge>
                    ) : (
                      <Badge variant='danger'>Out of stock</Badge>
                    )}
                  </Col>
                </Row>
              </ListGroup.Item>
              {product.countInStock > 0 && (
                <ListGroup.Item>
                  <div className='d-grid'>
                    <button
                      onClick={addToCart}
                      className='btn_primary'
                      variant='primary'
                    >
                      Add to cart
                    </button>
                  </div>
                </ListGroup.Item>
              )}
            </ListGroup>
          </Col>
        </Row>
      )}
    </div>
  )
}

export default ProductScreen
