import { useContext, useState, useEffect, useReducer } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import Form from 'react-bootstrap/Form'
import Container from 'react-bootstrap/Container'
import Card from 'react-bootstrap/Card'
import { Helmet } from 'react-helmet-async'
import axios from 'axios'
import { Store } from '.././Store'
import { toast } from 'react-toastify'
import { getError } from '../utils'

// reducer
const reducer = (state, action) => {
  switch (action.type) {
    case 'UPDATE_REQUEST':
      return { ...state, loadingUpdate: true }
    case 'UPDATE_SUCCESS':
      return { ...state, loadingUpdate: false }
    case 'UPDATE_FAIL':
      return { ...state, loadingUpdate: false }
    default:
      return state
  }
}

const ProfileScreen = () => {
  // global state
  const { state, dispatch: ctxDispatch } = useContext(Store)
  const { userInfo } = state
  const navigate = useNavigate()

  //   page usereducer
  const [{ loadingUpdate }, dispatch] = useReducer(reducer, {
    loadingUpdate: false
  })

  // input states
  const [name, setName] = useState(userInfo.name || '')
  const [email, setEmail] = useState(userInfo.email || '')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')

  // submit action
  const handleSubmit = async e => {
    e.preventDefault()
    if (password !== confirmPassword) {
      toast.error("Password don't march")
      return
    }
    try {
      dispatch({ type: 'UPDATE_REQUEST' })
      const { data } = await axios.put(
        '/api/user/profile/',
        {
          name,
          email,
          password
        },
        {
          headers: {
            authorization: `Bearer ${userInfo.token}`
          }
        }
      )
      dispatch({ type: 'UPDATE_SUCCESS' })
      console.log(data);
      // send to ourr global state
      ctxDispatch({ type: 'USER_SIGNIN', payload: data })
      // save data into localStorage
      localStorage.setItem('userInfo', JSON.stringify(data))
      toast.success('Profile Updated successful!')
    } catch (error) {
        dispatch({type: 'UPDATE_FAIL'})
      toast.error(getError(error))
    }
  }

  return (
    <Container className='small-container' style={{ maxWidth: '600px' }}>
      <Helmet>
        <title>User Profile</title>
      </Helmet>
      <Card>
        <Card.Body>
          <h1>User Profile</h1>
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
                Update
              </button>
            </div>
          </Form>
        </Card.Body>
      </Card>
    </Container>
  )
}

export default ProfileScreen
