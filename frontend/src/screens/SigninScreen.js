import React from 'react'
import { Link, useLocation } from 'react-router-dom'
import Form from 'react-bootstrap/Form'
import Container from 'react-bootstrap/Container'
import Card from 'react-bootstrap/Card'
import { Helmet } from 'react-helmet-async'

const SigninScreen = () => {
  const { search } = useLocation()
  const redirectInUrl = new URLSearchParams(search).get('redirect')
  const redirect = redirectInUrl ? redirectInUrl : '/'
  return (
    <Container className='small-container' style={{ maxWidth: '600px' }}>
      <Helmet>
        <title>SignIn</title>
      </Helmet>
      <Card>
        <Card.Body>
          <h1>SignIn</h1>
          <Form>
            <Form.Group className='mb-3' controlId='email'>
              <Form.Label>Email</Form.Label>
              <Form.Control type='email' required />
            </Form.Group>
            <Form.Group className='mb-3' controlId='password'>
              <Form.Label>Email</Form.Label>
              <Form.Control type='password' required />
            </Form.Group>
            <div className='mb-3'>
              <button variant='light' className='btn_primary'>
                SignIn
              </button>
            </div>
            <div>
              New Customer{' '}
              <Link to={`/signup?redirect=${redirect}`}>
                Create new account
              </Link>
            </div>
          </Form>
        </Card.Body>
      </Card>
    </Container>
  )
}

export default SigninScreen
