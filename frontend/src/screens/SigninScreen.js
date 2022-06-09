import { useContext, useState, useEffect } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import Form from 'react-bootstrap/Form'
import Container from 'react-bootstrap/Container'
import Card from 'react-bootstrap/Card'
import { Helmet } from 'react-helmet-async'
import Axios from 'axios'
import { Store } from '.././Store'
import { toast } from 'react-toastify'
import { getError } from '../utils'

const SigninScreen = () => {
  // global state
  const { state, dispatch: ctxDispatch } = useContext(Store)
  const { userInfo } = state
  const navigate = useNavigate()
  const { search } = useLocation()
  const redirectInUrl = new URLSearchParams(search).get('redirect')
  const redirect = redirectInUrl ? redirectInUrl : '/'

  // input states
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  // submit action
  const handleSubmit = async e => {
    e.preventDefault()
    try {
      const { data } = await Axios.post('/api/user/signin/', {
        email,
        password
      })
      // send to ourr global state
      ctxDispatch({ type: 'USER_SIGNIN', payload: data })
      // save data into localStorage
      localStorage.setItem('userInfo', JSON.stringify(data))
      // navigate to the shipping
      navigate(redirect)
      toast.success('Login successful!')
    } catch (error) {
      toast.error(getError(error))
    }
  }

  useEffect(() => {
    if (userInfo) {
      navigate(redirect)
    }
  }, [navigate, userInfo, redirect])

  return (
    <Container className='small-container' style={{ maxWidth: '600px' }}>
      <Helmet>
        <title>SignIn</title>
      </Helmet>
      <Card>
        <Card.Body>
          <h1>SignIn</h1>
          <Form onSubmit={handleSubmit}>
            <Form.Group className='mb-3' controlId='email'>
              <Form.Label>Email</Form.Label>
              <Form.Control
                type='email'
                required
                placeholder='Email Address'
                onChange={e => setEmail(e.target.value)}
              />
            </Form.Group>
            <Form.Group className='mb-3' controlId='password'>
              <Form.Label>Email</Form.Label>
              <Form.Control
                type='password'
                placeholder='Password'
                required
                onChange={e => setPassword(e.target.value)}
              />
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
