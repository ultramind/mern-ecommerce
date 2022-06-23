import axios from 'axios'
import React, { useEffect, useReducer, useState } from 'react'
import { Helmet } from 'react-helmet-async'
import { Link } from 'react-router-dom'
import { useLocation, useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import Rating from '../components/Rating'
import SpinnerBox from '../components/SpinnerBox'
import MessageBox from '../components/MessageBox'
import Product from '../components/Product'
import Button from 'react-bootstrap/Button'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import { LinkContainer } from 'react-router-bootstrap'
import { getError } from '../utils'

// reducer function
const reducer = (state, action) => {
  switch (action.type) {
    case 'FETCH_REQUEST':
      return { ...state, loading: true }
    case 'FETCH_SUCCESS':
      return {
        ...state,
        loading: false,
        products: action.payload.products,
        pages: action.payload.pages,
        page: action.payload.page,
        countPages: action.payload.countPages
      }
    case 'FETCH_FAIL':
      return { ...state, error: action.payload, loading: false }
    default:
      return state
  }
}

const SearchScreen = () => {
  const navigate = useNavigate()
  const { search } = useLocation()
  const sp = new URLSearchParams(search)

  // getting the values of search
  const category = sp.get('category') || 'all'
  const query = sp.get('query') || 'all'
  const price = sp.get('price') || 'all'
  const rating = sp.get('rating') || 'all'
  const order = sp.get('order') || 'all'
  const page = sp.get('page') || 1

  // use reducer
  const [
    { loading, error, products, pages, countProducts },
    dispatch
  ] = useReducer(reducer, {
    loading: true,
    error: ''
  })

  // Fetching the query from api
  useEffect(() => {
    const fetchData = async () => {
      dispatch({ type: 'FETCH_REQUEST' })
      try {
        const { data } = await axios.get(
          `/api/products/search?category=${category}&query=${query}&price=${price}&rating=${rating}&order=${order}&page={page}`
        )
        dispatch({ type: 'FETCH_SUCCESS', payload: data })
        console.log(data)
      } catch (error) {
        dispatch({ type: 'FETCH_FAIL', payload: getError(error) })
        toast.error(getError(error))
        console.log(error)
      }
    }
    fetchData()
  }, [category, query, price, page, rating, order])

  // fetch data for catgory
  const [categories, setCategories] = useState([])
  useEffect(() => {
    const fetchCategory = async () => {
      try {
        const { data } = await axios.get('/api/products/categories')
        setCategories(data)
        console.log(categories)
      } catch (error) {
        console.log(error)
      }
    }
    fetchCategory()
  }, [])

  // fitter the urls
  const getFileredUrl = filtered => {
    const filteredPage = filtered.page || page
    const filteredCategory = filtered.category || category
    const filteredPrice = filtered.price || price
    const sortOrder = filtered.order || order
    const filteredRating = filtered.rating || rating
    const filteredQuery = filtered.query || query

    return `/search?category=${filteredCategory}&query=${filteredQuery}&price=${filteredPrice}&rating=${filteredRating}&order=${sortOrder}&page=${filteredPage}`
  }

  // Create price range
  const priceRange = [
    {
      name: '$1-$50',
      value: '1-50'
    },
    {
      name: '$51-$200',
      value: '51-200'
    },
    {
      name: '$200-$1000',
      value: '200-1000'
    }
  ]

  // rating
  const ratingRange = [
    {
      name: '4stars & up',
      rating: 4
    },
    {
      name: '3stars & up',
      rating: 3
    },
    {
      name: '2stars & up',
      rating: 2
    },
    {
      name: '1stars & up',
      rating: 1
    }
  ]

  return (
    <div>
      <Helmet>
        <title>Search</title>
      </Helmet>
      <h1></h1>
      <Row>
        <Col md={3}>
          <h3>Departments</h3>
          <div>
            <h3>Categories</h3>
            <ul>
              <li>
                <Link
                  to={getFileredUrl({ category: 'all' })}
                  className={'all' === category ? 'text-bold' : ''}
                >
                  Any
                </Link>
              </li>
              {categories.map(c => (
                <li key={c}>
                  <Link
                    className={c === category ? 'text-bold' : ''}
                    to={getFileredUrl({ category: c })}
                  >
                    {c}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h3>Price range</h3>
            <ul>
              <li>
                <Link
                  to={getFileredUrl({ price: 'all' })}
                  className={'all' === price ? 'text-bold' : ''}
                >
                  Any
                </Link>
              </li>
              {priceRange.map(p => (
                <li key={p}>
                  <Link
                    className={p.value === price ? 'text-bold' : ''}
                    to={getFileredUrl({ price: p.value })}
                  >
                    {p.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h3>Av. Customer Reviews</h3>
            <ul>
              <li>
                <Link
                  to={getFileredUrl({ rating: 'all' })}
                  className={'all' === rating ? 'text-bold' : ''}
                >
                  Any
                </Link>
              </li>
              {ratingRange.map(r => (
                <li key={r}>
                  <Link
                    className={r.rating === rating ? 'text-bold' : ''}
                    to={getFileredUrl({ rating: r.rating })}
                  >
                    <Rating caption={' & up'}>{r.rating}</Rating>
                  </Link>
                </li>
              ))}
              <li>
                <Link
                  to={getFileredUrl({ rating: 'all' })}
                  className={'all' === rating ? 'text-bold' : ''}
                >
                  <Rating caption={' & up'}>{0}</Rating>
                </Link>
              </li>
            </ul>
          </div>
        </Col>
        <Col md={9}>
          {loading ? (
            <SpinnerBox></SpinnerBox>
          ) : error ? (
            <MessageBox varriant='danger'>{error}</MessageBox>
          ) : (
            <>
              <Row className='justify-content-between mb-3'>
                <Col md={6}>
                  {countProducts === 0 ? 'No' : countProducts} Results
                  {query !== 'all' && ':' + query}
                  {category !== 'all' && ':' + category}
                  {price !== 'all' && ': Price ' + price}
                  {rating !== 'all' && ':Rating ' + rating + ' & up'}
                  {query !== 'all' || category !== 'all' || rating !== 'all' ? (
                    <Button variant='light' onClick={() => navigate('/search')}>
                      <i className='fas fa-times-circle'></i>
                    </Button>
                  ) : null}
                </Col>
                <Col className='text-end'>
                  Sort By:{' '}
                  <select
                    value={order}
                    onChange={e =>
                      navigate(getFileredUrl({ order: e.target.value }))
                    }
                  >
                    <option value='newest'>New Arrivals</option>
                    <option value='lowest'>Price: Low to High</option>
                    <option value='highest'>Price: Hight to Low</option>
                    <option value='toprated'>Avg. Customer Reviews</option>
                  </select>
                </Col>
              </Row>
              {products.length === 0 && (
                <MessageBox>No product found</MessageBox>
              )}

              <Row>
                {products.map(product => (
                  <Col sm={6} lg={4} className='mb-3' key={product._id}>
                    <Product product={product}></Product>
                  </Col>
                ))}
              </Row>
              <div>
                {[...Array(pages).keys()].map(x => (
                  <LinkContainer
                    key={x + 1}
                    className='mx-1'
                    to={getFileredUrl({ page: x + 1 })}
                  >
                    <Button
                      className={Number(page) === x + 1 ? 'text-bold' : ''}
                      variant='light'
                    >
                      {x + 1}
                    </Button>
                  </LinkContainer>
                ))}
              </div>
            </>
          )}
        </Col>
      </Row>
    </div>
  )
}

export default SearchScreen
