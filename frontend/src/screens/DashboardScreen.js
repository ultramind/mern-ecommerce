import React, { useContext, useEffect, useReducer, useState } from 'react'
import { Store } from '../Store'
import { Helmet } from 'react-helmet-async'
import axios from 'axios'
import { getError } from '../utils'
import MessageBox from '../components/MessageBox'
import SpinnerBox from '../components/SpinnerBox'
import Card from 'react-bootstrap/Card'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import Chart from 'react-google-charts'

// reducer function
const reducer = (state, action) => {
  switch (action.type) {
    case 'FECTH_REQUEST':
      return {
        ...state,
        loading: true
      }
    case 'FETCH_SUCCESS':
      return { ...state, statistics: action.payload, loading: false }
    case 'FETCH_FAIL':
      return { ...state, loading: false, error: action.payload }

    default:
      return state
  }
}

const DashboardScreen = () => {
  // Global state
  const { state } = useContext(Store)
  const { userInfo } = state
  // component reducer
  const [{ loading, statistics, error, raw }, dispatch] = useReducer(reducer, {
    loading: true,
    error: ''
  })

  const [stat, setStat] = useState({})

  // loading data using useEffect
  useEffect(() => {
    const fetchData = async () => {
      dispatch({ type: 'FETCH_REQUEST' })
      try {
        const { data } = await axios.get('/api/orders/summary', {
          headers: { authorization: `Bearer ${userInfo.token}` }
        })
        dispatch({ type: 'FETCH_SUCCESS', paylaod: data })
        setStat(data)
      } catch (err) {
        dispatch({ type: 'FETCH_FAIL', payload: getError(err) })
      }
    }
    fetchData()
  }, [userInfo])

  return (
    <div>
      <Helmet>
        <title>Admin Dashboard</title>
      </Helmet>

      <h1>Dashboard</h1>
      {loading ? (
        <SpinnerBox></SpinnerBox>
      ) : error ? (
        <MessageBox variant='danger'>{error}</MessageBox>
      ) : (
        <>
          <Row>
            <Col md={4}>
              <Card>
                <Card.Body>
                  <Card.Title>
                    {stat.users && stat.users[0].numUsers
                      ? stat.users[0].numUsers
                      : 0}
                  </Card.Title>
                  <Card.Text>Users</Card.Text>
                </Card.Body>
              </Card>
            </Col>
            <Col md={4}>
              <Card>
                <Card.Body>
                  <Card.Title>
                    {stat.orders && stat.orders[0].numOrders
                      ? stat.orders[0].numOrders
                      : 0}
                  </Card.Title>
                  <Card.Text>Orders</Card.Text>
                </Card.Body>
              </Card>
            </Col>
            <Col md={4}>
              <Card>
                <Card.Body>
                  <Card.Title>
                    $
                    {stat.orders && stat.orders[0].numOrders
                      ? stat.orders[0].totalSales.toFixed(2)
                      : 0}
                  </Card.Title>
                  <Card.Text>Users</Card.Text>
                </Card.Body>
              </Card>
            </Col>
          </Row>
          <div className='my-4'>
            <Chart
              width='100%'
              height='400px'
              chartType='AreaChart'
              loading={<div>Loading...</div>}
              data={[
                ['Date', 'Sales'],
                ...stat.dailyOrders.map(x => [x._id, x.sales])
              ]}
            ></Chart>
          </div>
        </>
      )}
    </div>
  )
}

export default DashboardScreen
