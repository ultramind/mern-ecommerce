import { useContext, useState, useEffect } from 'react'
import FormGroup from 'react-bootstrap/esm/FormGroup'
import Form from 'react-bootstrap/esm/Form'
import Button from 'react-bootstrap/esm/Button'
import { Helmet } from 'react-helmet-async'
import { Store } from '../Store'
import { useNavigate } from 'react-router-dom'
import CheckoutSteps from '../components/CheckoutSteps'

const ShippingAddressScreen = () => {
  // Global states
  const { state, dispatch: ctxDispatch } = useContext(Store)
  const {
    userInfo,
    cart: { shippingAddress }
  } = state

  const navigate = useNavigate()

  // States of inputs
  const [fullname, setFullname] = useState(shippingAddress.fullname || '')
  const [address, setAddress] = useState(shippingAddress.address || '')
  const [city, setCity] = useState(shippingAddress.city || '')
  const [postalCode, setPostalCode] = useState(shippingAddress.postalCode || '')
  const [country, setCountry] = useState(shippingAddress.country || '')

  // validate the address
  useEffect(() => {
    if (!userInfo) {
      navigate('/signin?redirect=/shipping')
    }
  }, [navigate, userInfo])

  // create submit hander function
  const submitHandler = e => {
    e.preventDefault()
    ctxDispatch({
      type: 'ADD_SHIPPING_ADDRESS',
      payload: {
        fullname,
        address,
        city,
        postalCode,
        country
      }
    })
    localStorage.setItem(
      'ShippingAddress',
      JSON.stringify({
        fullname,
        address,
        city,
        postalCode,
        country
      })
    )

    navigate('/payment')
  }

  return (
    <div>
      <Helmet>
        <title>Shipping Address</title>
      </Helmet>
      <div
        className='small-container'
        style={{ maxWidth: '600px', margin: '0 auto' }}
      >
      <CheckoutSteps step1 step2/>
        <h1>Shipping Address</h1>
        <Form onSubmit={submitHandler}>
          <Form.Group className='mb-3' controlId='fullname'>
            <Form.Label>Fulname</Form.Label>
            <Form.Control
              type='text'
              required
              value={fullname}
              placeholder='Fullname'
              onChange={e => setFullname(e.target.value)}
            />
          </Form.Group>
          <Form.Group className='mb-3' controlId='address'>
            <Form.Label>Address</Form.Label>
            <Form.Control
              type='text'
              required
              value={address}
              placeholder='Address'
              onChange={e => setAddress(e.target.value)}
            />
          </Form.Group>
          <Form.Group className='mb-3' controlId='City'>
            <Form.Label>City</Form.Label>
            <Form.Control
              type='text'
              required
              value={city}
              placeholder='City'
              onChange={e => setCity(e.target.value)}
            />
          </Form.Group>
          <Form.Group className='mb-3' controlId='PostalCode'>
            <Form.Label>PostalCode</Form.Label>
            <Form.Control
              type='text'
              required
              value={postalCode}
              placeholder='PostalCode'
              onChange={e => setPostalCode(e.target.value)}
            />
          </Form.Group>
          <Form.Group className='mb-3' controlId='Country'>
            <Form.Label>Country</Form.Label>
            <Form.Control
              type='text'
              value={country}
              required
              placeholder='Country'
              onChange={e => setCountry(e.target.value)}
            />
          </Form.Group>
          <div>
            <Button type='submit' variant='primary' className='btn_primary'>
              Contiue
            </Button>
          </div>
        </Form>
      </div>
    </div>
  )
}

export default ShippingAddressScreen
