// eslint-disable-next-line
import './index.css'
import { BrowserRouter, Link, Route, Routes } from 'react-router-dom'
import Navbar from 'react-bootstrap/Navbar'
import Nav from 'react-bootstrap/Nav'
import Container from 'react-bootstrap/Container'
import HomeScreen from './screens/HomeScreen'
import ProductScreen from './screens/ProductScreen'
import { Helmet } from 'react-helmet-async'
import { Store } from './Store'
import { useContext } from 'react'
import Badge from 'react-bootstrap/esm/Badge'
import CartScreen from './screens/CartScreen'

function App () {
  const { state } = useContext(Store)
  const { cart } = state

  return (
    <BrowserRouter>
      <Helmet>
        <title>Amazona</title>
      </Helmet>
      <div className='d-flex flex-column site-container'>
        <header className='header'>
          <Navbar bg='dark' variant='dark' className='align-items-center'>
            <Container>
              <Link to='/' style={{ textDecoration:'none' }}>
                <Navbar.Brand>amazona</Navbar.Brand>
              </Link>
              <Nav className='me-auto'>
                <Link to='/cart' style={{ textDecoration:'none',color: 'gray' }}>
                  Cart 
                  {cart.cartItems.length > 0 && (
                    <Badge pill bg='danger'>
                      {cart.cartItems.reduce((a, c) => a+ c.quantity, 0)}
                    </Badge>
                  )}
                </Link>
              </Nav>
            </Container>
          </Navbar>
        </header>
        <main>
          <Container>
            <Routes>
              <Route path='/' element={<HomeScreen />} />
              <Route path='/product/:slug' element={<ProductScreen />} />
              <Route path='/cart' element={<CartScreen />} />
            </Routes>
          </Container>
        </main>
        <div className='text-center footer'>All right reserve</div>
      </div>
    </BrowserRouter>
  )
}

export default App
