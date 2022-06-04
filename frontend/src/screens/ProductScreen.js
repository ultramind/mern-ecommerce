import React from 'react'
import { useParams } from 'react-router-dom'

const ProductScreen = () => {
  const params = useParams()
  const { slug } = params

  return (
    <main>
      <h1>{slug}</h1>
    </main>
  )
}

export default ProductScreen
