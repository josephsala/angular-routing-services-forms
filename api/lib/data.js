const database = require('../lib/database');

// Método GET para obtener todos los productos
exports.getAllProducts = async (req, res) => {
    try {
        const [results] = await database.query('SELECT * FROM products');
        res.json(results);
    } catch (err) {
        console.error('Database error:', err);
        res.status(500).json({ error: 'Database error', details: err });
    }
};

// Método GET para obtener un producto por referencia
exports.getProductByReference = async (req, res) => {
    const reference = req.params.reference;
    try {
        const [results] = await database.query('SELECT * FROM products WHERE reference = ?', [reference]);
        if (results.length === 0) {
            return res.status(404).json({ error: 'Product not found' });
        }
        res.json(results[0]);
    } catch (err) {
        console.error('Database error:', err);
        res.status(500).json({ error: 'Database error', details: err });
    }
};

// Método POST para crear un producto
exports.createProduct = async (req, res) => {
    const productData = req.body;
    try {
        const [results] = await database.query('INSERT INTO products SET ?', productData);
        res.status(201).json({ message: 'Product created', productId: results.insertId });
    } catch (err) {
        console.error('Database error:', err);
        res.status(500).json({ error: 'Database error', details: err });
    }
};

// Método PUT para actualizar un producto por referencia
exports.updateProduct = async (req, res) => {
    const reference = req.params.reference;
    const productData = req.body;
    try {
        const [results] = await database.query('UPDATE products SET ? WHERE reference = ?', [productData, reference]);
        if (results.affectedRows === 0) {
            return res.status(404).json({ error: 'Product not found' });
        }
        res.json({ message: 'Product updated' });
    } catch (err) {
        console.error('Database error:', err);
        res.status(500).json({ error: 'Database error', details: err });
    }
};

// Método DELETE para eliminar un producto por referencia
exports.deleteProduct = async (req, res) => {
    const reference = req.params.reference;
    try {
        const [results] = await database.query('DELETE FROM products WHERE reference = ?', [reference]);
        if (results.affectedRows === 0) {
            return res.status(404).json({ error: 'Product not found' });
        }
        res.json({ message: 'Product deleted' });
    } catch (err) {
        console.error('Database error:', err);
        res.status(500).json({ error: 'Database error', details: err });
    }
};