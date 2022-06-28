import React, { useContext } from 'react'
import Col from 'react-bootstrap/esm/Col'
import Card from 'react-bootstrap/esm/Card'
import Button from 'react-bootstrap/esm/Button'
import ListGroup from 'react-bootstrap/esm/ListGroup'
import Row from 'react-bootstrap/esm/Row'
import { Helmet } from 'react-helmet-async'
import { Store } from '../Store'
import MessageBox from '../components/MessageBox'
import { Link, useNavigate } from 'react-router-dom'
import axios from 'axios'

const CartScreen = () => {
  const navigate = useNavigate()
  const { state, dispatch: ctxDispatch } = useContext(Store)

  const {
    cart: { cartItems }
  } = state

  //   handle increament and decrement
  const updateCartHandler = async (item, quantity) => {
    const { data } = await axios.get(`/api/products/${item._id}`)
    if (data.countInStock < quantity) {
      window.alert('Sorry product is out of stock')
      return
    }
    ctxDispatch({ type: 'CART_ADD_ITEM', payload: { ...item, quantity } })
  }

  // remove item from cart
  const removeItem = item => {
    ctxDispatch({ type: 'REMOVE_ITEM', payload: item })
  }

  // checkout handler
  const checkOutHandler = () => {
    navigate('/signin/?redirect=/shipping')
  }

  return (
    <div>
      <Helmet>
        <title>Shoping Cart</title>
      </Helmet>
      <h1>Shopping Cart</h1>
      {cartItems.length === 0 ? (
        <MessageBox variant='info'>
          Cart is empty <Link to='/'>Go Shopping..</Link>
        </MessageBox>
      ) : (
        <Row>
          <Col md={8}>
            <ListGroup>
              {cartItems.map(item => (
                <ListGroup.Item key={item._id}>
                  <Row className='align-items-center'>
                    <Col md={4}>
                      <img
                        src={item.images}
                        alt={item.name}
                        className='img-fluid rounded img-thumbnail'
                      />{' '}
                      <Link to={`/product/${item.slug}`}>{item.name}</Link>
                    </Col>
                    <Col md={3}>
                      <Button
                        onClick={() =>
                          updateCartHandler(item, item.quantity - 1)
                        }
                        variant='light'
                        disabled={item.quantity === 1}
                      >
                        <i className='fas fa-minus-circle'></i>
                      </Button>{' '}
                      <span>{item.quantity}</span>{' '}
                      <Button
                        onClick={() =>
                          updateCartHandler(item, item.quantity + 1)
                        }
                        variant='light'
                        disabled={item.quantity === item.countInStock}
                      >
                        <i className='fas fa-plus-circle'></i>
                      </Button>
                    </Col>
                    <Col md={3}>
                      <span>$ {item.price} </span>
                    </Col>
                    <Col md={2}>
                      <Button onClick={() => removeItem(item)} variant='light'>
                        <i className='fas fa-trash'></i>
                      </Button>
                    </Col>
                  </Row>
                </ListGroup.Item>
              ))}
            </ListGroup>
          </Col>
          <Col md={4}>
            <Card>
              <ListGroup variant='flush'>
                <ListGroup.Item>
                  <h3>
                    Subtotal ({cartItems.reduce((a, c) => a + c.quantity, 0)}{' '}
                    items) : ${' '}
                    {cartItems.reduce((a, c) => a + c.price * c.quantity, 0)}
                  </h3>
                </ListGroup.Item>
                <ListGroup.Item>
                  <div className='d-grid'>
                    <button
                      onClick={checkOutHandler}
                      className='btn_primary'
                      variant='primary'
                      disable={cartItems.length === 0 && true}
                    >
                      Proceed to Checkout
                    </button>
                  </div>
                </ListGroup.Item>
              </ListGroup>
            </Card>
          </Col>
        </Row>
      )}
    </div>
  )
}

export default CartScreen
