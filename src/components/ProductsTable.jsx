import * as React from 'react';
import { useState } from 'react';
import { styled } from '@mui/material/styles';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import AddIcon from '@mui/icons-material/Add'; // Importing AddIcon
import { Button, Dialog, DialogTitle, DialogContent, DialogActions, TextField } from '@mui/material';


const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: theme.palette.common.black,
    color: theme.palette.common.white,
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14,
  },
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  '&:nth-of-type(odd)': {
    backgroundColor: theme.palette.action.hover,
  },
  '&:hover': {
    backgroundColor: theme.palette.action.selected, 
    cursor: 'pointer', 
  },
  '&:last-child td, &:last-child th': {
    border: 0,
  },
}));

export default function CustomizedTables({ products, handleOpen, getProducts }) {
  const [openDialog, setOpenDialog] = React.useState(false);
  const [newProduct, setNewProduct] = React.useState({
    type: '',
    brand: '',
    title: '',
    Model: '',
  });
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewProduct(prev => ({ ...prev, [name]: value }));
  };
  const rows = products.map(product => ({
    id: product.id,
    type: product.type,
    brand: product.brand,
    title: product.title,
    model: product.Model,
  }));

  const handleAddProduct = () => {
    fetch('http://localhost:3001/products', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(newProduct),
    })
    .then(response => response.json())
    .then(data => {
      console.log(data);
      getProducts();  // Assuming getProducts fetches all products including the new one
      setOpenDialog(false);
    })
    .catch(error => {
      console.error('Error adding product:', error);
    });
  };

  function deleteRow(id) {
    const confirm = window.confirm("Deseja excluir o registro?");
    if (!confirm) return;
    fetch(`http://localhost:3001/products/${id}`, {
      method: 'DELETE',
    })
      .then(response => response.json())
      .then(data => {
        console.log(data);
      })
      .catch(error => {
        console.error(error);
      });
  }
  function duplicateRow(id) {
    const confirm = window.confirm("Deseja duplicar o registro?");
    if (!confirm) return;
    fetch(`http://localhost:3001/products/duplicate/${id}`, {
      method: 'POST',
    })
      .then(response => response.json())
      .then(data => {
        console.log(data);
      })
      .catch(error => {
        console.error(error);
      });

      getProducts();
    
  }

  return (
    <div>
    <TableContainer component={Paper}>
      <Table sx={{ minWidth: 700 }} aria-label="customized table">
        <TableHead>
          <TableRow>
            <StyledTableCell>ID</StyledTableCell>
            <StyledTableCell>Tipo</StyledTableCell>
            <StyledTableCell>Modelo</StyledTableCell>
            <StyledTableCell>Marca</StyledTableCell>
            <StyledTableCell>Nome</StyledTableCell>
            <StyledTableCell>Ações</StyledTableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.map((row) => (
            <StyledTableRow key={row.id}>
              <StyledTableCell component="th" scope="row"  onClick={() => handleOpen(row.id)}>
                {row.id}
              </StyledTableCell>
              <StyledTableCell  onClick={() => handleOpen(row.id)}>{row.type}</StyledTableCell>
              <StyledTableCell  onClick={() => handleOpen(row.id)}>{row.model}</StyledTableCell>
              <StyledTableCell  onClick={() => handleOpen(row.id)}>{row.brand}</StyledTableCell>
              <StyledTableCell  onClick={() => handleOpen(row.id)}>{row.title}</StyledTableCell>
              <StyledTableCell sx={{ display: 'flex', gap: '10px' }}>
                <Button
                  variant="contained"
                  color="error"
                  onClick={() => deleteRow(row.id)}
                >
                  <DeleteForeverIcon />
                </Button>
                <Button
                  variant="contained"
                  color="warning"
                  onClick={() => duplicateRow(row.id)}
                >
                  <ContentCopyIcon />
                </Button>
              </StyledTableCell>
            </StyledTableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
      <Button
        startIcon={<AddIcon />}
        variant="contained"
        color="primary"
        onClick={() => setOpenDialog(true)}
        style={{ marginBottom: '10px' }}
      >
        Adicionar Produto
      </Button>

      <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
        <DialogTitle>Adicionar Novo Produto</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            name="type"
            label="Tipo"
            type="text"
            fullWidth
            variant="standard"
            value={newProduct.type}
            onChange={handleInputChange}
          />
          <TextField
            margin="dense"
            name="brand"
            label="Marca"
            type="text"
            fullWidth
            variant="standard"
            value={newProduct.brand}
            onChange={handleInputChange}
          />
          <TextField
            margin="dense"
            name="title"
            label="Nome"
            type="text"
            fullWidth
            variant="standard"
            value={newProduct.title}
            onChange={handleInputChange}
          />
          <TextField
            margin="dense"
            name="Model"
            label="Modelo"
            type="text"
            fullWidth
            variant="standard"
            value={newProduct.Model}
            onChange={handleInputChange}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleAddProduct}>Salvar</Button>
          <Button onClick={() => setOpenDialog(false)}>Cancelar</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
