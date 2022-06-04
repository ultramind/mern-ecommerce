import React from 'react'
import { Link } from 'react-router-dom'
import data from '../data'

const HomeScreen = () => {
  return (
    <main>
      <h1>Featured Items</h1>
      <div className='products'>
        {data.products.map(product => (
          <div key={product.slug} className='product'>
            <Link to={`/product/${product.slug}`}>
              <img src={product.images} alt={product.slug} />
            </Link>
            <div className='product_info'>
              <Link to={`/product/${product.slug}`}>
                <h4>{product.name}</h4>
              </Link>
              {/* <p> {product.category} </p> */}
              <p>
                <strong>${product.price}</strong>
              </p>
              <button>Add to Cart</button>
            </div>
          </div>
        ))}
      </div>
    </main>
  )
}

export default HomeScreen
