const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();
const port = 8934;
const cors = require('cors');
app.use(cors());

app.use(express.json());
app.get('/products', (req, res) => {
  const filePath = path.join(
    __dirname,
    'SRC',
    'JSON',
    `products.json`,
  );
  fs.readFile(filePath, (err, data) => {
    if (err) {
      res.status(404).send('Products not found');
      return;
    }
    res.setHeader('Content-Type', 'application/json');
    res.send(data);
  });
});


app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});