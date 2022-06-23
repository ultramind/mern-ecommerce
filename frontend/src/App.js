// eslint-disable-next-line
import './index.css'
import { toast, ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
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
import { useContext, useEffect, useState } from 'react'
import Badge from 'react-bootstrap/esm/Badge'
import CartScreen from './screens/CartScreen'
import SigninScreen from './screens/SigninScreen'
import ShippingAddressScreen from './screens/ShippingAddressScreen'
import SignupScreen from './screens/SignupScreen'
import PaymentMethodScreen from './screens/PaymentMethodScreen'
import PlaceOrderScreen from './screens/PlaceOrderScreen'
import OrderScreen from './screens/OrderScreen'
import OrderHistoryScreen from './screens/OrderHistoryScreen'
import ProfileScreen from './screens/ProfileScreen'
import Button from 'react-bootstrap/Button'
import axios from 'axios'
import { getError } from './utils'
import SearchBox from './components/SearchBox'
import SearchScreen from './screens/SearchScreen'
import ProtectedRoutes from './components/ProtectedRoutes'
import AdminRoutes from './AdminRoutes'
import DashboardScreen from './screens/DashboardScreen'

function App () {
  const { state, dispatch: ctxDispatch } = useContext(Store)
  const { cart, userInfo } = state

  const [categories, setCategories] = useState([])
  const [sideBarOpen, setSideBarOpen] = useState(false)

  // Singout function
  const handleSignOut = () => {
    ctxDispatch({ type: 'USER_SIGNOUT' })
    localStorage.removeItem('userInfo')
    localStorage.removeItem('shippingAddress')
    localStorage.removeItem('paymentMethod')
    window.location.href = '/signin'
  }

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const { data } = await axios.get('/api/products/categories')
        setCategories(data)
      } catch (error) {
        toast.error(getError(error))
      }
    }
    fetchCategories()
  }, [])

  return (
    <BrowserRouter>
      <div
        className={
          sideBarOpen
            ? 'd-flex flex-column site-container active-cont'
            : 'd-flex flex-column site-container'
        }
      >
        <Helmet>
          <title>WeBuy</title>
        </Helmet>
        <div className='d-flex flex-column site-container'>
          <ToastContainer position='top-right' limit={1} />
          <header className='header mb-2'>
            <Navbar bg='dark' variant='dark' expand='lg'>
              <Container>
                <Button
                  className='mr-2'
                  variant='dark'
                  onClick={() => setSideBarOpen(!sideBarOpen)}
                >
                  <i className='fas fa-bars'></i>
                </Button>{' '}
                <LinkContainer to='/'>
                  <Navbar.Brand>WeBuy</Navbar.Brand>
                </LinkContainer>
                <Navbar.Toggle aria-controls='basic-navbar-nav' />
                <Navbar.Collapse id='basic-navbar-nav'>
                  <SearchBox />
                  <Nav className='me-auto w-100 justify-content-end'>
                    <Link
                      to='/cart'
                      style={{
                        textDecoration: 'none',
                        color: 'gray',
                        paddingTop: '.5rem'
                      }}
                    >
                      Cart{' '}
                      {cart.cartItems.length > 0 && (
                        <Badge pill bg='danger'>
                          {cart.cartItems.reduce((a, c) => a + c.quantity, 0)}
                        </Badge>
                      )}
                    </Link>
                    {userInfo ? (
                      <NavDropdown
                        title={userInfo.name}
                        id='basic-nav-dropdown'
                        style={{ float: 'right' }}
                      >
                        <LinkContainer to='/profile'>
                          <NavDropdown.Item>User Profile</NavDropdown.Item>
                        </LinkContainer>
                        <LinkContainer to='/orderHistory'>
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
                    {userInfo && userInfo.isAdmin && (
                      <NavDropdown
                        title='Admin'
                        id='basic-nav-dropdown'
                        style={{ float: 'right' }}
                      >
                        <LinkContainer to='/admin/dashboard'>
                          <NavDropdown.Item>Dashboard</NavDropdown.Item>
                        </LinkContainer>
                        <LinkContainer to='/admin/productList'>
                          <NavDropdown.Item>Products</NavDropdown.Item>
                        </LinkContainer>
                        <LinkContainer to='/admin/OrderList'>
                          <NavDropdown.Item>Orders</NavDropdown.Item>
                        </LinkContainer>
                        <LinkContainer to='/admin/userList'>
                          <NavDropdown.Item>Users</NavDropdown.Item>
                        </LinkContainer>
                      </NavDropdown>
                    )}
                  </Nav>
                </Navbar.Collapse>
              </Container>
            </Navbar>
          </header>
          <div
            className={
              sideBarOpen
                ? 'active-nav side-navbar d-flex justify-content-between flex-wrap flex-column'
                : 'side-navbar d-flex justify-content-between flex-wrap flex-column'
            }
          >
            {/* Sidebar panel */}
            <Nav className='flex-column text-white w-100 p-2'>
              <Nav.Item>
                <strong>Categories</strong>
              </Nav.Item>
              {categories.map(category => (
                <Nav.Item key={category}>
                  <LinkContainer
                    to={`search/?category=${category}`}
                    onClick={() => setSideBarOpen(false)}
                  >
                    <Nav.Link>{category}</Nav.Link>
                  </LinkContainer>
                </Nav.Item>
              ))}
            </Nav>
          </div>
          <main onClick={() => setSideBarOpen(false)}>
            <Container>
              <Routes>
                <Route path='/' element={<HomeScreen />} />
                <Route path='/product/:slug' element={<ProductScreen />} />
                <Route path='/cart' element={<CartScreen />} />
                <Route path='/search' element={<SearchScreen />} />
                <Route path='/signup' element={<SignupScreen />} />
                <Route path='/signin' element={<SigninScreen />} />
                <Route
                  path='/profile'
                  element={
                    <ProtectedRoutes>
                      <ProfileScreen />
                    </ProtectedRoutes>
                  }
                />
                <Route
                  path='/shipping'
                  element={
                    <ProtectedRoutes>
                      <ShippingAddressScreen />
                    </ProtectedRoutes>
                  }
                />
                <Route
                  path='/payment-method'
                  element={<PaymentMethodScreen />}
                />
                <Route
                  path='/place-order'
                  element={
                    <ProtectedRoutes>
                      <PlaceOrderScreen />
                    </ProtectedRoutes>
                  }
                />
                <Route
                  path='/order/:id'
                  element={
                    <ProtectedRoutes>
                      <OrderScreen />
                    </ProtectedRoutes>
                  }
                />
                <Route
                  path='/orderHistory'
                  element={
                    <ProtectedRoutes>
                      <OrderHistoryScreen />
                    </ProtectedRoutes>
                  }
                />
                {/* Admin routes */}
                <Route
                  path='/admin/dashboard'
                  element={
                    <AdminRoutes>
                      <DashboardScreen />
                    </AdminRoutes>
                  }
                />
              </Routes>
            </Container>
          </main>
          <div className='text-center footer'>All right reserve</div>
        </div>
      </div>
    </BrowserRouter>
  )
}

export default App
