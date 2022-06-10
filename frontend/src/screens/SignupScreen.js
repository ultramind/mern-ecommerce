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

const SignupScreen = () => {
  // global state
  const { state, dispatch: ctxDispatch } = useContext(Store)
  const { userInfo } = state
  const navigate = useNavigate()
  const { search } = useLocation()
  const redirectInUrl = new URLSearchParams(search).get('redirect')
  const redirect = redirectInUrl ? redirectInUrl : '/'

  // input states
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')

  // submit action
  const handleSubmit = async e => {
    e.preventDefault()
    if (password !== confirmPassword) {
        toast.error('Password don\'t march');
        return;
    }
    try {
      const { data } = await Axios.post('/api/user/signup/', {
        name,
        email,
        password
      })
      // send to ourr global state
      ctxDispatch({ type: 'USER_SIGNIN', payload: data })
      // save data into localStorage
      localStorage.setItem('userInfo', JSON.stringify(data))
      // navigate to the shipping
      navigate(redirect)
      toast.success('Registration successful!')
    } catch (error) {
      toast.error(getError(error))
    }
    setEmail('')
    setPassword('')
  }

  useEffect(() => {
    if (userInfo) {
      navigate(redirect)
    }
  }, [navigate, userInfo, redirect])

  return (
    <Container className='small-container' style={{ maxWidth: '600px' }}>
      <Helmet>
        <title>Sign Up</title>
      </Helmet>
      <Card>
        <Card.Body>
          <h1>Sign Up</h1>
          <Form onSubmit={handleSubmit}>
            <Form.Group className='mb-3' controlId='name'>
              <Form.Label>Name</Form.Label>
              <Form.Control
                type='text'
                required
                value={name}
                placeholder='Enter Name'
                onChange={e => setName(e.target.value)}
              />
            </Form.Group>
            <Form.Group className='mb-3' controlId='email'>
              <Form.Label>Email</Form.Label>
              <Form.Control
                type='email'
                required
                value={email}
                placeholder='Email Address'
                onChange={e => setEmail(e.target.value)}
              />
            </Form.Group>
            <Form.Group className='mb-3' controlId='password'>
              <Form.Label>Password</Form.Label>
              <Form.Control
                type='password'
                placeholder='Password'
                required
                value={password}
                onChange={e => setPassword(e.target.value)}
              />
            </Form.Group>
            <Form.Group className='mb-3' controlId='confirm password'>
              <Form.Label>Confirm Password</Form.Label>
              <Form.Control
                type='password'
                placeholder='Confirm Password'
                required
                value={confirmPassword}
                onChange={e => setConfirmPassword(e.target.value)}
              />
            </Form.Group>
            <div className='mb-3'>
              <button variant='light' className='btn_primary'>
                signup
              </button>
            </div>
            <div>
              Already created an account{' '}
              <Link to={`/signin?redirect=${redirect}`}>Login</Link>
            </div>
          </Form>
        </Card.Body>
      </Card>
    </Container>
  )
}

export default SignupScreen
