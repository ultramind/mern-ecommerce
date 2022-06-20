import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Form from 'react-bootstrap/Form'
import FormControl from 'react-bootstrap/FormControl'
import InputGroup from 'react-bootstrap/InputGroup'
import Button from 'react-bootstrap/Button'

const SearchBox = () => {
  const navigate = useNavigate()
  const [query, setQuery] = useState('')
  const handleSubmit = e => {
    e.preventDefault()
    navigate(query ? `/search/?query=${query}` : `/search`)
  }

  return (
    <Form onSubmit={handleSubmit}>
      <InputGroup>
        <FormControl
          type='text'
          name='q'
          id='q'
          onChange={e => setQuery(e.target.value)}
          placeholder='Search Products'
          aria-label='Search Products'
          aria-describedby='button-search'
        ></FormControl>
        <Button
          variant='outline-primary'
          className='outline_primary'
          id='button-search'
          type='submit'
          style={{ backgroundColor: '#f0c040', color: '#404040' }}
        >
          <i className='fas fa-search'></i>
        </Button>
      </InputGroup>
    </Form>
  )
}

export default SearchBox
