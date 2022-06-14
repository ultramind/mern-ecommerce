import React, { useContext, useReducer } from 'react'
import Col from 'react-bootstrap/esm/Col'
import Card from 'react-bootstrap/esm/Card'
import Button from 'react-bootstrap/esm/Button'
import ListGroup from 'react-bootstrap/esm/ListGroup'
import Row from 'react-bootstrap/esm/Row'
import { Helmet } from 'react-helmet-async'
import { Store } from '../Store'
import MessageBox from '../components/MessageBox'
import { Link, useNavigate } from 'react-router-dom'
import Axios from 'axios'
import { toast } from 'react-toastify'
import { getError } from '../utils'
import SpinnerBox from '../components/SpinnerBox'

// reducer function
const reducer = (state, action) => {
  switch (action.type) {
    case 'CREATE_REQUEST':
      return { ...state, loading: true }
    case 'REQUEST_SUCCESS':
      return { ...state, loading: false }
    case 'REQUEST_FAILED':
      return { ...state, loading: false }

    default:
      return state
  }
}

const PlaceOrderScreen = () => {
  const navigate = useNavigate()
  const { state, dispatch: ctxDispatch } = useContext(Store)

  const { cart, userInfo } = state

  // placeorder reduccer
  const [{ loading, error }, dispatch] = useReducer(reducer, {
    loading: false,
    error: ''
  })

  // checkout handler
  const placeOrderHandler = async () => {
    try {
      const { data } = await Axios.post(
        '/api/orders/',
        {
          orderItems: cart.cartItems,
          shippingAddress: cart.shippingAddress,
          paymentMethod: cart.paymentMethod,
          itemPrice: cart.itemPrice,
          shippingPrice: cart.shippingPrice,
          taxPrice: cart.taxPrice,
          totalPrice: cart.totalPrice
        },
        {
          headers: {
            authorization: `Bearer ${userInfo.token}`
          }
        }
      )
      // Clear cart from store
      ctxDispatch({ type: 'CLEAR_CART' })
      // succes in request
      dispatch({ type: 'REQUEST_SUCCESS' })
      // remove cartitem from localStroage
      localStorage.removeItem('cartItems')
      navigate(`order/${data.order._id}`)
    } catch (err) {
      dispatch({ type: 'REQUEST_FAILED' })
      toast.error(getError(err))
    }
  }

  // calcaulating the order summary
  // round up to 2 decimal place
  const round2 = num => Math.round((num + Number.EPSILON) * 100) / 100
  cart.itemPrice = round2(
    cart.cartItems.reduce((a, c) => a + c.quantity * c.price, 0)
  )
  cart.shippingPrice = cart.itemPrice > 100 ? round2(0) : round2(10)
  cart.taxPrice = round2(0.15 * cart.itemPrice)
  cart.totalPrice = cart.itemPrice + cart.shippingPrice + cart.taxPrice

  return (
    <div>
      <Helmet>
        <title>Preview Order</title>
      </Helmet>
      <h1>Preview Order</h1>
      {cart.cartItems.length === 0 ? (
        <MessageBox variant='info'>
          Cart is empty <Link to='/'>Go Shopping..</Link>
        </MessageBox>
      ) : (
        <Row>
          <Col md={8}>
            <Card className='mb-3'>
              <Card.Body>
                <Card.Title>Shipping</Card.Title>
                <Card.Text>
                  <strong>Name: </strong> {cart.shippingAddress.fullname}
                  <br></br>
                  <strong>Address: </strong> {cart.shippingAddress.address}
                  <br></br>
                </Card.Text>
                <Link to='/shipping'>Edit</Link>
              </Card.Body>
            </Card>
            <Card className='mb-3'>
              <Card.Body>
                <Card.Title>Payment </Card.Title>
                <Card.Text>
                  <strong>Method: </strong> {cart.paymentMethod}
                  <br></br>
                </Card.Text>
                <Link to='/payment-method'>Edit</Link>
              </Card.Body>
            </Card>
            <Card className='mb-3'>
              <Card.Body>
                <Card.Title>Items </Card.Title>
                <ListGroup variant='flush'>
                  {cart.cartItems.map(item => (
                    <ListGroup.Item key={item._id}>
                      <Row className='align-items-center'>
                        <Col md={6}>
                          <img
                            src={item.images}
                            alt={item.name}
                            className='img-fluid rounded img-thumbnail'
                          />{' '}
                          <Link to={`/product/${item.slug}`}>{item.name}</Link>
                        </Col>
                        <Col md={3}>
                          <span>{item.quantity}</span>{' '}
                        </Col>
                        <Col md={3}>
                          <span>$ {item.price} </span>
                        </Col>
                      </Row>
                    </ListGroup.Item>
                  ))}
                </ListGroup>
              </Card.Body>
            </Card>
          </Col>
          <Col md={4}>
            <Card>
              <ListGroup variant='flush'>
                <ListGroup.Item>
                  <h3>Order Summary</h3>
                </ListGroup.Item>
                <ListGroup.Item>
                  <Row>
                    <Col md={6}>Items</Col>
                    <Col md={6}>${cart.itemPrice.toFixed(2)}</Col>
                  </Row>
                </ListGroup.Item>
                <ListGroup.Item>
                  <Row>
                    <Col md={6}>Shiping</Col>
                    <Col md={6}>${cart.shippingPrice.toFixed(2)}</Col>
                  </Row>
                </ListGroup.Item>
                <ListGroup.Item>
                  <Row>
                    <Col md={6}>Tax</Col>
                    <Col md={6}>${cart.taxPrice.toFixed(2)}</Col>
                  </Row>
                </ListGroup.Item>
                <ListGroup.Item>
                  <Row>
                    <Col md={6}>
                      <strong>Order Total</strong>
                    </Col>
                    <Col md={6}>
                      <strong>${cart.totalPrice.toFixed(2)}</strong>
                    </Col>
                  </Row>
                </ListGroup.Item>
                <ListGroup.Item>
                  <div className='d-grid'>
                    <button
                      onClick={placeOrderHandler}
                      className='btn_primary'
                      variant='primary'
                      disable={cart.cartItems.length === 0}
                    >
                      Proceed Order
                    </button>
                  </div>
                  {loading && <SpinnerBox/>}
                </ListGroup.Item>
              </ListGroup>
            </Card>
          </Col>
        </Row>
      )}
    </div>
  )
}

export default PlaceOrderScreen
