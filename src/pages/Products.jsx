import React from 'react'
import CustomizedTables from '../components/ProductsTable'
import { Box, Modal, Typography } from '@mui/material';
import ProductModal from '../components/ProductModal'

const Products = () => {
  const [products, setProducts] = React.useState([])
  React.useEffect(() => {
    getProducts()
  }, [products])

  function getProducts () {
    try {
      fetch('http://localhost:3001/products')
    .then(res => res.json())
    .then(data => setProducts(data))
    } catch (error) {
      console.error("Servidor Inoperante. Erro: ", error)
    }
  }

  const [selectedProduct, setSelectedProduct] = React.useState(null);

    // Modal
    const [open, setOpen] = React.useState(false);
    const handleOpen = (id) => {
      const product = products.find(p => p.id === id);
      setSelectedProduct(product);
      setOpen(true);
    };
    
    const handleClose = () => setOpen(false);
    const style = {
      position: 'absolute',
      top: '50%',
      left: '50%',
      transform: 'translate(-50%, -50%)',
      width: '80%',
      height: '90%',
      bgcolor: 'background.paper',
      border: '2px solid #000',
      boxShadow: 24,
      p: 4,
      overflow: 'auto',
    };
  
  return (
    <section className="productsTableSection">
      <CustomizedTables products={products} handleOpen={handleOpen} getProducts={getProducts}/>
      <Modal
  open={open}
  onClose={handleClose}
  aria-labelledby="modal-modal-title"
  aria-describedby="modal-modal-description"
>
  <Box sx={style}>
    {selectedProduct ? (
      <>
        <ProductModal product={selectedProduct} handleClose={handleClose} setProducts={setProducts} />

      </>
    ) : (
      <Typography id="modal-modal-title" variant="h6" component="h2">
        Produto não encontrado
      </Typography>
    )}
  </Box>
</Modal>

    </section>
  )
}

export default Products