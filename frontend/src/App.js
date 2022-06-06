import './index.css'
import { BrowserRouter, Link, Route, Routes } from 'react-router-dom'
import Navbar from 'react-bootstrap/Navbar'
import Container from 'react-bootstrap/Container'
import HomeScreen from './screens/HomeScreen'
import ProductScreen from './screens/ProductScreen'
import { Helmet } from 'react-helmet-async'

function App () {
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
