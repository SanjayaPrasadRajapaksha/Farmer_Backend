import ProductService from "../services/product.service.js";

const ProductController = {
  create: async (req, res) => {
    try {
      const { name, unit, category_id } = req.body;

      const result = await ProductService.create(name, unit, category_id);

      if (result.status) {
        res.status(201).json({
          response_code: 200,
          status: true,
          message: 'Product added successfully!',
          result: result.result
        });
      } else {
        res.status(400).json({
          response_code: 400,
          status: false,
          message: result.message
        });
      }
    } catch (error) {
      console.error(error);
      res.status(500).json({
        response_code: 500,
        error: error,
        status: false,
        message: 'Error occurred while saving Product!'
      });
    }
  },

  getAll: async (req, res) => {
    try {
      const result = await ProductService.getAll();
      if (!result) {
        res.status(404).json({ response_code: 404, status: false, message: 'Products not found!' });
        return;
      }
      res.status(200).json({
        response_code: 200,
        status: true,
        message: 'Products fetched successfully!',
        result
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({
        response_code: 500,
        status: false, message: 'Error occurred while fetching Products!'
      });
    }
  },

  deleteById: async (req, res) => {
    const id = req.params.id;

    try {
      const result = await ProductService.deleteById(id);
      if (result == 1) {
        res.status(200).json({
          response_code: 200,
          status: true, message: 'Product deleted successfully!'
        });
      } else {
        res.status(404).json({
          response_code: 404,
          status: false, message: 'Product not found!'
        });
      }
    } catch (error) {
      console.error(error);
      res.status(500).json({
        response_code: 500,
        status: false, message: 'Error occurred while deleting Product!'
      });

    }
  },

  findById: async (req, res) => {
    const id = req.params.id;
    try {
      const result = await ProductService.findById(id);
      if (!result) {
        res.status(404).json({ response_code: 404, status: false, message: 'Product not found!' });
        return;
      }
      res.status(200).json({
        response_code: 200,
        status: true,
        message: 'Product fetched successfully!',
        result
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({
        response_code: 500,
        status: false, message: 'Error occurred while fetching Product!'
      });
    }
  },

  updateById: async (req, res) => {
    const id = req.params.id;
     const { name, unit, category_id } = req.body;
    try {
      const result = await ProductService.updateById(id,name, unit, category_id);
      if (result == 0) {
        res.status(404).json({ response_code: 404, status: false, message: 'Product not found!' });
        return;
      }
      res.status(200).json({
        response_code: 200,
        status: true,
        message: 'Product updated successfully!',
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({
        response_code: 500,
        status: false, message: 'Error occurred while updating Product!'
      });
    }
  },
}

export default ProductController;