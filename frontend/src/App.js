import logo from './logo.svg'
import './index.css'
import data from './data'

function App () {
  return (
    <div className=''>
      <header className='header'>
        <a href='/'>webuy</a>
      </header>
      <main>
        <h1>Featured Items</h1>
        <div className='products'>
          {data.products.map(product => (
            <div key={product.slug} className='product'>
              <a href={`/product/${product.slug}`}>
                <img src={product.images} alt={product.slug} />
              </a>
              <div className='product_info'>
                <a href={`/product/${product.slug}`}>
                  <h4>{product.name}</h4>
                </a>
                {/* <p> {product.category} </p> */}
                <p>
                  {' '}
                  <strong>${product.price}</strong>
                </p>
                <button>Add to Cart</button>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  )
}

export default App
