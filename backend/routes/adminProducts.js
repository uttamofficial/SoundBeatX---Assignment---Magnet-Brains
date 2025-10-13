const express = require('express');
const router = express.Router();
const Product = require('../models/Product');
const { verifyAdminToken } = require('./adminAuth');

// Get all products with pagination
router.get('/', verifyAdminToken, async (req, res) => {
  try {
    // Check if we want all products (for admin panel)
    const getAll = req.query.all === 'true';
    
    if (getAll) {
      // Get all products without pagination
      const products = await Product.find({})
        .sort({ created_at: -1 });
      
      const total = await Product.countDocuments();

      res.json({
        products,
        pagination: {
          page: 1,
          limit: products.length,
          total,
          totalPages: 1
        }
      });
    } else {
      // Use pagination as before
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 10;
      const skip = (page - 1) * limit;

      // Get products from MongoDB
      const products = await Product.find({})
        .sort({ created_at: -1 })
        .skip(skip)
        .limit(limit);
      
      const total = await Product.countDocuments();

      res.json({
        products,
        pagination: {
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit)
        }
      });
    }
  } catch (error) {
    console.error('Error fetching products:', error);
    res.status(500).json({ error: 'Failed to fetch products: ' + error.message });
  }
});

// Get product by ID
router.get('/:id', verifyAdminToken, async (req, res) => {
  try {
    const { id } = req.params;

    if (!id.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({ error: 'Invalid product ID format' });
    }

    const product = await Product.findById(id);
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }

    res.json(product);
  } catch (error) {
    console.error('Error fetching product:', error);
    res.status(500).json({ error: 'Failed to fetch product' });
  }
});

// Create a new product
router.post('/', verifyAdminToken, async (req, res) => {
  try {
    const { name, description, price, category, image } = req.body;

    // Validate required fields
    if (!name || !price) {
      return res.status(400).json({ error: 'Name and price are required' });
    }

    const newProduct = new Product({
      name,
      description: description || '',
      price: parseFloat(price),
      category: category || '',
      image: image || ''
    });

    console.log('Creating new product:', newProduct);

    const savedProduct = await newProduct.save();

    console.log('Product created successfully:', savedProduct);

    res.status(201).json({
      success: true,
      product: savedProduct
    });
  } catch (error) {
    console.error('Error creating product:', error);
    res.status(500).json({ error: 'Failed to create product: ' + error.message });
  }
});

// Update a product
router.put('/:id', verifyAdminToken, async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, price, category, image } = req.body;

    // Validate required fields
    if (!name || !price) {
      return res.status(400).json({ error: 'Name and price are required' });
    }

    if (!id.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({ error: 'Invalid product ID format' });
    }

    const updatedProduct = await Product.findByIdAndUpdate(
      id,
      {
      name,
      description: description || '',
      price: parseFloat(price),
      category: category || '',
        image: image || '',
        updated_at: new Date()
      },
      { new: true, runValidators: true }
    );

    if (!updatedProduct) {
      return res.status(404).json({ error: 'Product not found' });
    }

    res.json(updatedProduct);
  } catch (error) {
    console.error('Error updating product:', error);
    res.status(500).json({ error: 'Failed to update product: ' + error.message });
  }
});

// Delete a product
router.delete('/:id', verifyAdminToken, async (req, res) => {
  try {
    const { id } = req.params;

    if (!id.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({ error: 'Invalid product ID format' });
    }

    const deleted = await Product.findByIdAndDelete(id);
    if (!deleted) {
      return res.status(404).json({ error: 'Product not found' });
    }

    res.json({ message: 'Product deleted successfully' });
  } catch (error) {
    console.error('Error deleting product:', error);
    res.status(500).json({ error: 'Failed to delete product: ' + error.message });
  }
});

// Get product statistics
router.get('/stats/overview', verifyAdminToken, async (req, res) => {
  try {
    const total = await Product.countDocuments();
    res.json({
      totalProducts: total
    });
  } catch (error) {
    console.error('Error fetching product stats:', error);
    res.status(500).json({ error: 'Failed to fetch product statistics' });
  }
});

module.exports = router;