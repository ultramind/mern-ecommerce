import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import data from '../data'
import axios from 'axios'

const HomeScreen = () => {
  const [products, setProducts] = useState([])

  useEffect(() => {
    const fetchProducts = async () => {
      const result = await axios.get('api/products/')
      setProducts(result.data);
      console.log(result.data);
    }
    fetchProducts();
  }, [])

  return (
    <main>
      <h1>Featured Items</h1>
      <div className='products'>
        {products.map(product => (
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
