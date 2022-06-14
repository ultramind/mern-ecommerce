import React, { useContext, useEffect, useReducer } from 'react'
import Col from 'react-bootstrap/esm/Col'
import Card from 'react-bootstrap/esm/Card'
import Button from 'react-bootstrap/esm/Button'
import ListGroup from 'react-bootstrap/esm/ListGroup'
import Row from 'react-bootstrap/esm/Row'
import { Helmet } from 'react-helmet-async'
import { Store } from '../Store'
import MessageBox from '../components/MessageBox'
import { Link, useNavigate, useParams } from 'react-router-dom'
import Axios from 'axios'
import { toast } from 'react-toastify'
import { getError } from '../utils'
import SpinnerBox from '../components/SpinnerBox'
import axios from 'axios'

// reducer function
const reducer = (state, action) => {
  switch (action.type) {
    case 'FETCH_REQUEST':
      return { ...state, loading: true }
    case 'FETCH_SUCCESS':
      return { ...state, loading: false, order: action.payload }
    case 'FETCH_FAIL':
      return { ...state, loading: false, error: action.payload }
    default:
      return state
  }
}

const OrderScreen = () => {
  const { id: orderId } = useParams()
  const navigate = useNavigate()
  const { state, dispatch: ctxDispatch } = useContext(Store)
  const { userInfo } = state

  const [{ loading, error, order }, dispatch] = useReducer(reducer, {
    loading: true,
    error: '',
    order: {}
  })

  // checkout handler

  // useEffect
  useEffect(() => {
    const fetchOrder = async () => {
      try {
        dispatch({ type: 'FETCH_REQUEST' })
        const { data } = await axios.get(`/api/orders/${orderId}`, {
          headers: { authorization: `Bearer ${userInfo.token}` }
        })
        dispatch({ type: 'FETCH_SUCCESS', payload: data })
      } catch (error) {
        dispatch({ type: 'FETCH_FAIL', payload: getError(error) })
      }
    }
    if (!userInfo) {
      return navigate('/signin')
    }
    // checking the order id`
    if (!order._id || (order._id && order._id !== orderId)) {
      fetchOrder()
    }
  }, [order, navigate])

  const placeOrderHandler = () => {}

  return loading ? (
    <SpinnerBox></SpinnerBox>
  ) : error ? (
    <MessageBox variant='danger'>{error}</MessageBox>
  ) : (
    <div>
      <Helmet>
        <title>Order:{order._id}</title>
      </Helmet>
      <h2>Order:{order._id}</h2>
      <Row>
        <Col md={8}>
          <Card className='mb-3'>
            <Card.Body>
              <Card.Title>Shipping</Card.Title>
              <Card.Text>
                <strong>Name: </strong> {order.shippingAddress.fullname}
                <br></br>
                <strong>Address: </strong> {order.shippingAddress.address}
                <br></br>
              </Card.Text>
              {!order.isDelivered ? (
                <MessageBox variant='danger'>Item not delivered</MessageBox>
              ) : (
                <MessageBox variant='success'>
                  Item has been delivered
                </MessageBox>
              )}
            </Card.Body>
          </Card>
          <Card className='mb-3'>
            <Card.Body>
              <Card.Title>Payment </Card.Title>
              <Card.Text>
                <strong>Method: </strong> {order.paymentMethod}
                <br></br>
              </Card.Text>
              {!order.isPaid ? (
                <MessageBox variant='danger'>Not Paid</MessageBox>
              ) : (
                <MessageBox variant='success'>
                  Payment has been made
                </MessageBox>
              )}
            </Card.Body>
          </Card>
          <Card className='mb-3'>
            <Card.Body>
              <Card.Title>Items </Card.Title>
              <ListGroup variant='flush'>
                {order.orderItems.map(item => (
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
                  <Col md={6}>${order.itemPrice.toFixed(2)}</Col>
                </Row>
              </ListGroup.Item>
              <ListGroup.Item>
                <Row>
                  <Col md={6}>Shiping</Col>
                  <Col md={6}>${order.shippingPrice.toFixed(2)}</Col>
                </Row>
              </ListGroup.Item>
              <ListGroup.Item>
                <Row>
                  <Col md={6}>Tax</Col>
                  <Col md={6}>${order.taxPrice.toFixed(2)}</Col>
                </Row>
              </ListGroup.Item>
              <ListGroup.Item>
                <Row>
                  <Col md={6}>
                    <strong>Order Total</strong>
                  </Col>
                  <Col md={6}>
                    <strong>${order.totalPrice.toFixed(2)}</strong>
                  </Col>
                </Row>
              </ListGroup.Item>
              <ListGroup.Item>
                <div className='d-grid'>
                  <button
                    onClick={placeOrderHandler}
                    className='btn_primary'
                    variant='primary'
                  >
                    Proceed Order
                  </button>
                </div>
                {loading && <SpinnerBox />}
              </ListGroup.Item>
            </ListGroup>
          </Card>
        </Col>
      </Row>
    </div>
  )
}

export default OrderScreen
