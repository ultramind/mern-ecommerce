import axios from 'axios'
import { useContext } from 'react'
import Card from 'react-bootstrap/Card'
import { Link } from 'react-router-dom'
import { Store } from '../Store'
import Rating from './Rating'

const Product = ({ product }) => {
  const { state, dispatch: ctxDispatch } = useContext(Store)
  const {
    cart: { cartItems }
  } = state
  //   handle add to cart
  const addCartHandler = async item => {
    // checnking if item exits
    const exitsItem = cartItems.find(x => x._id === product._id)
    const quantity = exitsItem ? exitsItem.quantity + 1 : 1
    // checking the item stock qty
    const { data } = await axios.get(`/api/products/${item._id}`)
    if (data.countInStock < quantity) {
      window.alert('Sorry product is out of stock')
      return
    }
    ctxDispatch({ type: 'CART_ADD_ITEM', payload: { ...item, quantity } })
  }

  // distruturing the product object
  const {
    slug,
    images,
    name,
    price,
    numReviews,
    rating,
    countInStock
  } = product
  return (
    <Card key={slug} className='mb-4'>
      <Link to={`/product/${slug}`}>
        <img src={images} className='card-img-top' alt={slug} />
      </Link>
      <Card.Body>
        <Link to={`/product/${slug}`}>
          <Card.Title>{name}</Card.Title>
        </Link>
        <Rating reviews={numReviews} rating={rating} />
        <Card.Text>
          <strong>${price}</strong>
        </Card.Text>
        {countInStock === 0 ? (
          <button className='btn_primary' variant='light' disabled>
            Out of Stock
          </button>
        ) : (
          <button
            onClick={() => addCartHandler(product)}
            className='btn_primary'
          >
            Add to cart
          </button>
        )}
      </Card.Body>
    </Card>
  )
}

export default Product
