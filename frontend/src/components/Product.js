import Card from 'react-bootstrap/Card';
import {Link} from 'react-router-dom';
import Rating from './Rating';


const Product = ({product}) => {
    const {slug, images, name, price, numReviews, rating} = product;
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
        <button className='btn_primary'>Add to cart</button>
      </Card.Body>
    </Card>
  )
}

export default Product
