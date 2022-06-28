import axios from 'axios'
import React, { useContext, useEffect, useReducer } from 'react'
import Button from 'react-bootstrap/Button'
import Col from 'react-bootstrap/esm/Col'
import Row from 'react-bootstrap/esm/Row'
import { Helmet } from 'react-helmet-async'
import { useLocation } from 'react-router-dom'
import MessageBox from '../components/MessageBox'
import SpinnerBox from '../components/SpinnerBox'
import { Store } from '../Store'
import { getError } from '../utils'
import { Link } from 'react-router-dom'

const reducer = (state, action) => {
  switch (action.type) {
    case 'TT':
      return { ...state, loading: true }
    case 'FETCH_SUCCESS':
      return {
        ...state,
        loading: false,
        products: action.payload.products,
        pages: action.payload.pages,
        page: action.payload.page
      }
    case 'FETCH_FAILS':
      return { ...state, loading: false, error: action.payload }

    default:
      return state
  }
}

const ProductListScreen = () => {
  const { state } = useContext(Store)
  const { userInfo } = state

  const [{ loading, error, products, pages }, dispatch] = useReducer(reducer, {
    loading: true,
    error: ''
  })

  const { search } = useLocation()
  const sp = new URLSearchParams(search)
  const page = sp.get('page') || 1

  useEffect(() => {
    const fetchData = async () => {
      dispatch({ type: 'FETCH_REQUEST' })
      try {
        const { data } = await axios.get(`/api/products/admin?page=${page}`, {
          headers: { authorization: `Bearer ${userInfo.token}` }
        })
        dispatch({ type: 'FETCH_SUCCESS', payload: data })
        // console.log(data)
      } catch (err) {
        dispatch({ type: 'FETCH_FAILS', error: getError(err) })
      }
    }
    fetchData()
  }, [userInfo, page])

  const createProduct = () => {
    if (window.confirm('Are you sure you want to create a product')) {
    }
  }

  return (
    <div>
      <Helmet>
        <title>All Products</title>
      </Helmet>
      <Row>
        <Col>
          <h1>All Products</h1>
        </Col>
        <Col className='col text-end'>
          <button type='button' onClick={createProduct} className='btn_primary'>
            Create Product
          </button>
        </Col>
      </Row>
      {loading ? (
        <SpinnerBox></SpinnerBox>
      ) : error ? (
        <MessageBox variant='danger'>{error}</MessageBox>
      ) : (
        <div>
          <table className='table'>
            <thead>
              <tr>
                <th>ID</th>
                <th>NAME</th>
                <th>PRICE</th>
                <th>CATEGORY</th>
                <th>BRAND</th>
                <th>ACTIONS</th>
              </tr>
            </thead>
            <tbody>
              {products.map(product => (
                <tr>
                  <td>{product._id}</td>
                  <td>{product.name}</td>
                  <td>{product.price.toFixed(2)}</td>
                  <td>{product.category}</td>
                  <td>{product.brand}</td>
                  <td>
                    <Button variant='light'>Edit</Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      <div>
        {[...Array(pages).keys()].map(x => (
          <Link
            className={x + 1 === Number(page) ? 'btn text-bold' : 'btn'}
            key={x + 1}
            to={`/admin/products?page=${x + 1}`}
          >
            {x + 1}
          </Link>
        ))}
      </div>
    </div>
  )
}

export default ProductListScreen
