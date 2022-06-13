// eslint-disable-next-line
import './index.css'
import {ToastContainer} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { BrowserRouter, Link, Route, Routes } from 'react-router-dom'
import Navbar from 'react-bootstrap/Navbar'
import NavDropdown from 'react-bootstrap/NavDropdown'
import { LinkContainer } from 'react-router-bootstrap'
import Nav from 'react-bootstrap/Nav'
import Container from 'react-bootstrap/Container'
import HomeScreen from './screens/HomeScreen'
import ProductScreen from './screens/ProductScreen'
import { Helmet } from 'react-helmet-async'
import { Store } from './Store'
import { useContext } from 'react'
import Badge from 'react-bootstrap/esm/Badge'
import CartScreen from './screens/CartScreen'
import SigninScreen from './screens/SigninScreen'
import ShippingAddressScreen from './screens/ShippingAddressScreen';
import SignupScreen from './screens/SignupScreen';
import PaymentMethodScreen from './screens/PaymentMethodScreen';
import PlaceOrderScreen from './screens/PlaceOrderScreen';

function App () {
  const { state, dispatch: ctxDispatch } = useContext(Store)
  const { cart, userInfo } = state

  // Singout function
  const handleSignOut = () => {
    ctxDispatch({ type: 'USER_SIGNOUT' })
    localStorage.removeItem('userInfo')
  }

  return (
    <BrowserRouter>
      <Helmet>
        <title>Amazona</title>
      </Helmet>
      <div className='d-flex flex-column site-container'>
      <ToastContainer position='top-right' limit={1} />
        <header className='header'>
          <Navbar bg='dark' variant='dark' className='align-items-center'>
            <Container>
              <LinkContainer to='/'>
                <Navbar.Brand>amazona</Navbar.Brand>
              </LinkContainer>
              <Nav className='me-auto'>
                <Link
                  to='/cart'
                  style={{ textDecoration: 'none', color: 'gray', paddingTop:'.5rem' }}
                >
                  Cart{' '}
                  {cart.cartItems.length > 0 && (
                    <Badge pill bg='danger'>
                      {cart.cartItems.reduce((a, c) => a + c.quantity, 0)}
                    </Badge>
                  )}
                </Link>
                {userInfo ? (
                  <NavDropdown title={userInfo.name} id='basic-nav-dropdown' style={{ float:'right' }}>
                    <LinkContainer to='/profile'>
                      <NavDropdown.Item>User Profile</NavDropdown.Item>
                    </LinkContainer>
                    <LinkContainer to='/history'>
                      <NavDropdown.Item>Order History</NavDropdown.Item>
                    </LinkContainer>
                    <NavDropdown.Divider />
                    <Link
                      to='#signout'
                      onClick={handleSignOut}
                      className='dropdown-item'
                    >
                      Sign Out
                    </Link>
                  </NavDropdown>
                ) : (
                  <Link className='nav-link' to='/signin'>
                    SignIn
                  </Link>
                )}
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
              <Route path='/signup' element={<SignupScreen />} />
              <Route path='/signin' element={<SigninScreen />} />
              <Route path='/shipping' element={<ShippingAddressScreen />} />
              <Route path='/payment-method' element={<PaymentMethodScreen />} />
              <Route path='/place-order' element={<PlaceOrderScreen />} />
            </Routes>
          </Container>
        </main>
        <div className='text-center footer'>All right reserve</div>
      </div>
    </BrowserRouter>
  )
}

export default App
