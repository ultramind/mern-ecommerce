import React, { useContext } from 'react'
import Col from 'react-bootstrap/esm/Col'
import Card from 'react-bootstrap/esm/Card'
import Button from 'react-bootstrap/esm/Button'
import ListGroup from 'react-bootstrap/esm/ListGroup'
import Row from 'react-bootstrap/esm/Row'
import { Helmet } from 'react-helmet-async'
import { Store } from '../Store'
import MessageBox from '../components/MessageBox'
import { Link } from 'react-router-dom'

const CartScreen = () => {
  const { state, dispatch: ctxDispatch } = useContext(Store)

  const {
    cart: { cartItems }
  } = state

  return (
    <div>
      <Helmet>
        <title>Shoping Cart</title>
      </Helmet>
      <h1>Shopping Cart</h1>
      {cartItems.length === 0 ? (
        <MessageBox variant='danger'>
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
                      <Button variant='light' disabled={item.quantity === 1}>
                        <i className='fas fa-minus-circle'></i>
                      </Button>{' '}
                      <span>{item.quantity}</span>{' '}
                      <Button variant='light' disabled={item.quantity === 1}>
                        <i className='fas fa-plus-circle'></i>
                      </Button>
                    </Col>
                    <Col md={3}>
                      <span> {item.price} </span>
                    </Col>
                    <Col md={2}>
                      <Button variant='light'>
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
                      className='btn_primary'
                      variant='primary'
                      disable={cartItems.length === 0}
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
