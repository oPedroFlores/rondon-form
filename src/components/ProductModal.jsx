import React, { useState } from 'react';
import { Typography, TextField, Button, IconButton, Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';

const ProductModal = ({ product, handleClose, setProducts }) => {
  const [productData, setProductData] = useState(product);
  const [newKey, setNewKey] = useState('');
  const [newValue, setNewValue] = useState('');
  const [openDialog, setOpenDialog] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProductData(prevData => ({
      ...prevData,
      [name]: value
    }));
  };

  const handleDelete = (key) => {
    const confirm = window.confirm(`Tem certeza que deseja excluir o campo "${key}"?`);
    if (!confirm) return;
    const newData = { ...productData };
    delete newData[key];
    setProductData(newData);
  };

  const handleAddField = () => {
    if (!newKey.trim() || productData.hasOwnProperty(newKey)) {
      alert("Chave inválida ou já existente!");
      return;
    }
    setProductData(prevData => ({
      ...prevData,
      [newKey]: newValue
    }));
    setNewKey('');
    setNewValue('');
    setOpenDialog(false);
  };

  const handleSubmit = () => {
    fetch(`http://localhost:3001/products/${productData.id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(productData)
    })
      .then(response => response.json())
      .then(data => {
        console.log(data);
      })
      .catch(error => {
        console.error(error);
      });

    setProducts(prevProducts => {
      const updatedProducts = prevProducts.map(p => {
        if (p.id === productData.id) {
          return productData;
        }
        return p;
      });
      return updatedProducts;
    });

    handleClose(); 
  };

  const nonDeletableKeys = ['id', 'type', 'Model', 'brand', 'title'];

  return (
    <div style={{ padding: '20px' }}>
      <Typography variant="h6" component="h2">
        Editar Produto - {productData.title}
      </Typography>
      <form>
        {Object.keys(productData).map((key) => (
          <div key={key} style={{ display: 'flex', alignItems: 'center', marginBottom: '10px' }}>
            <TextField
              label={key}
              name={key}
              disabled={key === 'id'}
              value={productData[key]}
              onChange={handleChange}
              margin="normal"
              fullWidth
            />
            {!nonDeletableKeys.includes(key) && (
              <IconButton onClick={() => handleDelete(key)} color="error">
                <DeleteIcon />
              </IconButton>
            )}
          </div>
        ))}
        <Button onClick={() => setOpenDialog(true)} startIcon={<AddIcon />} variant="contained" style={{ marginTop: '20px' }}> Campo
        </Button>
        <Button onClick={handleSubmit} variant="contained" color="primary" style={{ marginTop: '20px', marginLeft: '10px' }}>
          Salvar Alterações
        </Button>
      </form>

      <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
        <DialogTitle>Adicionar Novo Campo</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Nome da Chave"
            type="text"
            fullWidth
            variant="standard"
            value={newKey}
            onChange={e => setNewKey(e.target.value)}
          />
          <TextField
            margin="dense"
            label="Valor"
            type="text"
            fullWidth
            variant="standard"
            value={newValue}
            onChange={e => setNewValue(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleAddField}>Adicionar</Button>
          <Button onClick={() => setOpenDialog(false)}>Cancelar</Button>
        </DialogActions>
      </Dialog>
    </div>
  )
}

export default ProductModal;
