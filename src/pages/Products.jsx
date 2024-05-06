import React from 'react'

const Products = () => {

  React.useEffect(() => {
    fetch('http://localhost:8934/products')
  .then((res) => res.json())
  .then((data) => console.log(data))
  .catch((error) => console.error('Erro ao buscar produtos:', error));

  }, [])
  
  return (
    <div>Products</div>
  )
}

export default Products