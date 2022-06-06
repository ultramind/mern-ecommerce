import React, { useReducer, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import axios from 'axios'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import Badge from 'react-bootstrap/Badge'
import ListGroup from 'react-bootstrap/ListGroup'
import Rating from '../components/Rating'

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
      } catch (error) {
        dispatch({ type: 'FETCH_FAIL', payload: error.data })
      }
    }
    fetchProduct()
  }, [slug])

  return loading ? (
    <div>Loading...</div>
  ) : error ? (
    <div>{error}</div>
  ) : (
    <div className='mt-4'>
      <Row>
        <Col md={5}>
          <img className='img-large' src={product.images} alt={product.name} />
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
                  <button className='btn_primary' variant='primary'>
                    Add to cart
                  </button>
                </div>
              </ListGroup.Item>
            )}
          </ListGroup>
        </Col>
      </Row>
    </div>
  )
}

export default ProductScreen
