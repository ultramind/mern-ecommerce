import React, { useReducer, useContext, useEffect } from 'react'
import axios from 'axios'
import Button from 'react-bootstrap/esm/Button'
import { Helmet } from 'react-helmet-async'
import SpinnerBox from '../components/SpinnerBox'
import { Store } from '../Store'
import { getError } from '../utils'
import MessageBox from '../components/MessageBox'
import { useNavigate } from 'react-router-dom'

// reducer function
const reducer = (state, action) => {
  switch (action.type) {
    case 'FETCH_REQUEST':
      return { ...state, loading: true }
    case 'FETCH_SUCCESS':
      return { ...state, loading: false, orders: action.payload }
    case 'FETCH_FAIL':
      return { ...state, loading: false, error: action.payload }

    default:
      return state
  }
}

const OrderHistoryScreen = () => {
    const navigate = useNavigate()
  const { state } = useContext(Store)
  const { userInfo } = state

  //   local reducer
  const [{ loading, error, orders }, dispatch] = useReducer(reducer, {
    loading: false,
    error: '',
    orders: []
  })

  useEffect(() => {
    const fetchData = async () => {
      dispatch({ type: 'FETCH_REQUEST' })
      try {
        const { data } = await axios.get('/api/orders/mine', {
          headers: { Authorization: `Bearer ${userInfo.token}` }
        })
        dispatch({ type: 'FETCH_SUCCESS', payload: data })
      } catch (error) {
        dispatch({ type: 'FETCH_FAIL', payload: getError(error) })
      }
    }
    fetchData()
  }, [userInfo])

  const handleSubmit = (orderId)=>{
    navigate(`/order/${orderId}`);
  }

  return (
    <div>
      <Helmet>
        <title>Order History</title>
      </Helmet>
      <h1>Order History</h1>
      {loading ? (
        <SpinnerBox></SpinnerBox>
      ) : error ? (
        <MessageBox vairant='danger'>{error}</MessageBox>
      ) : (
        <div>
          <table className='table'>
            <thead>
              <tr>
                <th>ID</th>
                <th>DATE</th>
                <th>TOTAL</th>
                <th>PAID</th>
                <th>DELIVERED</th>
                <th>ACTIONS</th>
              </tr>
            </thead>
            <tbody>
              {orders.map(order => (
                <tr>
                  <td>{order._id}</td>
                  <td>{order.createdAt.substring(0, 10)}</td>
                  <td>{order.totalPrice.toFixed(2)}</td>
                  <td>{order.isPaid ? order.paidAt.substring(0, 10) : 'NO'}</td>
                  <td>
                    {order.deliveredAt ? order.deliveredAt.substring(0, 10) : 'NO'}
                  </td>
                  <td>
                    <Button onClick={() => handleSubmit(order._id)} variant='light'>Details</Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}

export default OrderHistoryScreen
