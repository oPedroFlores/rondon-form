const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();
const port = 3001;
const cors = require('cors');
app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {    
  res.send('Hello World!');
});

app.get('/products', (req, res) => {
  const filePath = path.join(__dirname, 'SRC', 'JSON', `products.json`);
  fs.readFile(filePath, (err, data) => {
    if (err) {
      res.status(404).json({ message: 'File not found' });
      return;
    }
    res.setHeader('Content-Type', 'application/json');
    res.send(data);
  });
});

app.post('/products', (req, res) => {
  const newProduct = req.body;
  const filePath = path.join(__dirname, 'SRC', 'JSON', 'products.json');
  fs.readFile(filePath, (err, data) => {
    if (err) {
      res.status(500).json({ message: 'Error reading file' });
      return;
    }
    const products = JSON.parse(data);

    // Encontrar o maior ID existente
    const highestId = products.reduce((maxId, product) => {
      if (product.id && product.id > maxId) {
        return product.id;
      }
      return maxId;
    }, 0);

    // Incrementar o maior ID para o novo produto
    newProduct.id = highestId + 1;

    // Adicionar o novo produto à lista
    products.push(newProduct);
    fs.writeFile(filePath, JSON.stringify(products, null, 2), (err) => {
      if (err) {
        res.status(500).json({ message: 'Error writing file' });
        return;
      }
      res.status(201).json({
        message: 'Product created successfully',});
    });
  });
});

app.delete('/products/:id', (req, res) => {
  const { id } = req.params;
  const filePath = path.join(__dirname, 'SRC', 'JSON', 'products.json');
  
  fs.readFile(filePath, (err, data) => {
    if (err) {
      res.status(500).json({ message: 'Error reading file' });
      return;
    }

    let products = JSON.parse(data);
    const productIndex = products.findIndex(product => product.id == id);
    if (productIndex === -1) {
      res.status(404).json({ message: 'Product not found' });
      return;
    }

    // Remove o produto do array
    products.splice(productIndex, 1);

    fs.writeFile(filePath, JSON.stringify(products, null, 2), (err) => {
      if (err) {
        res.status(500).json({ message: 'Error writing file' });
        return;
      }
      res.status(200).json({
        message: 'Product deleted successfully'
      });
    });
  });
});


app.put('/products/:id', (req, res) => {
  const { id } = req.params;
  const updateData = req.body;
  const filePath = path.join(__dirname, 'SRC', 'JSON', 'products.json');
  fs.readFile(filePath, (err, data) => {
    if (err) {
      res.status(500).json({ message: 'Error reading file' });
      return;
    }
    let products = JSON.parse(data);
    const productIndex = products.findIndex(product => product.id == id);
    if (productIndex === -1) {
      res.status(404).json({ message: 'Product not found' });
      return;
    }
    products[productIndex] = { ...products[productIndex], ...updateData };
    fs.writeFile(filePath, JSON.stringify(products, null, 2), (err) => {
      if (err) {
        res.status(500).json({ message: 'Error writing file' });
        return;
      }
      res.status(200).json({
        message: 'Product updated successfully',
        product: products[productIndex]
      });
    });
  });
});

app.post('/products/duplicate/:id', (req, res) => {
  const { id } = req.params;
  const filePath = path.join(__dirname, 'SRC', 'JSON', 'products.json');
  
  fs.readFile(filePath, (err, data) => {
    if (err) {
      res.status(500).json({ message: 'Error reading file' });
      return;
    }

    const products = JSON.parse(data);
    const originalProduct = products.find(product => product.id == id);
    if (!originalProduct) {
      res.status(404).json({ message: 'Product not found' });
      return;
    }

    // Encontrar o maior ID existente
    const highestId = products.reduce((maxId, product) => {
      return product.id > maxId ? product.id : maxId;
    }, 0);

    // Criar uma cópia do produto com o ID incrementado e nome alterado
    const newProduct = {
      ...originalProduct,
      id: highestId + 1,
      title: `${originalProduct.title} - Cópia`
    };

    // Adicionar o novo produto à lista
    products.push(newProduct);
    fs.writeFile(filePath, JSON.stringify(products, null, 2), (err) => {
      if (err) {
        res.status(500).json({ message: 'Error writing file' });
        return;
      }
      res.status(201).json({
        message: 'Product duplicated successfully',});
    });
  });
});


app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
