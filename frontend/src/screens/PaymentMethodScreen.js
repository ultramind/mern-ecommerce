import { useContext, useState, useEffect } from 'react'
import FormGroup from 'react-bootstrap/esm/FormGroup'
import Form from 'react-bootstrap/esm/Form'
import Button from 'react-bootstrap/esm/Button'
import { Helmet } from 'react-helmet-async'
import { Store } from '../Store'
import { useNavigate } from 'react-router-dom'
import CheckoutSteps from '../components/CheckoutSteps'

const PaymentMethodScreen = () => {
  const navigate = useNavigate()
  const { state, dispatch: ctxDispatch } = useContext(Store)
  const {
    cart: { paymentMethod }
  } = state

  const [paymentMethodName, setPaymentMethodName] = useState(
    paymentMethod || 'PayPal'
  )

  //   HAndle submit
  const handleSubmit = e => {
    e.preventDefault()
    ctxDispatch({ type: 'PAYMENT_METHOD', payload: paymentMethodName })
    localStorage.setItem('Payment-Method', paymentMethodName)
    navigate('/place-order')
  }

  return (
    <div>
      <CheckoutSteps step1 step2 step3 />
      <Helmet>
        <title>Payment Method</title>
      </Helmet>
      <div
        className='small-container'
        style={{ maxWidth: '600px', margin: '0 auto' }}
      >
        <h1>Payment Method</h1>
        <Form onSubmit={handleSubmit}>
          <div className='mb-3'>
            <Form.Check
              type='radio'
              label='PayPal'
              id='PayPal'
              value='PayPal'
              checked={paymentMethodName === 'PayPal'}
              onChange={e => setPaymentMethodName(e.target.value)}
            />
          </div>
          <div className='mb-3'>
            <Form.Check
              type='radio'
              label='Stripe'
              id='Stripe'
              value='Stripe'
              checked={paymentMethodName === 'Stripe'}
              onChange={e => setPaymentMethodName(e.target.value)}
            />
          </div>
          <Button type='submit' variant='primary' className='btn_primary'>
            Contiue
          </Button>
        </Form>
      </div>
    </div>
  )
}

export default PaymentMethodScreen
