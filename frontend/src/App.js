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
          <Navbar bg='dark' variant='dark'>
            <Container>
              <linkContainer to='/'>
                <Navbar.Brand>amazona</Navbar.Brand>
              </linkContainer>
              <Nav className='me-auto'>
                <Link to='/cart' style={{ textDecoration:'none',color: 'gray' }}>
                  Cart 
                  {cart.cartItem.length > 0 && (
                    <Badge pill bg='danger'>
                      {cart.cartItem.length}
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
            </Routes>
          </Container>
        </main>
        <div className='text-center footer'>All right reserve</div>
      </div>
    </BrowserRouter>
  )
}

export default App
