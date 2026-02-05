import CategoryService from "../services/category.service.js";

const CategoryController = {
  create: async (req, res) => {
    try {
      const { name } = req.body;

      const result = await CategoryService.create(name);

      if (result.status) {
        res.status(201).json({
          response_code: 200,
          status: true,
          message: 'Category added successfully!',
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
        message: 'Error occurred while saving Category!'
      });
    }
  },

  getAll: async (req, res) => {
    try {
      const result = await CategoryService.getAll();
      if (!result) {
        res.status(404).json({ response_code: 404, status: false, message: 'Categories not found!' });
        return;
      }
      res.status(200).json({
        response_code: 200,
        status: true,
        message: 'Categories fetched successfully!',
        result
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({
        response_code: 500,
        status: false, message: 'Error occurred while fetching Categories!'
      });
    }
  },

  deleteById: async (req, res) => {
    const id = req.params.id;

    try {
      const result = await CategoryService.deleteById(id);
      if (result == 1) {
        res.status(200).json({
          response_code: 200,
          status: true, message: 'Category deleted successfully!'
        });
      } else {
        res.status(404).json({
          response_code: 404,
          status: false, message: 'Category not found!'
        });
      }
    } catch (error) {
      console.error(error);
      res.status(500).json({
        response_code: 500,
        status: false, message: 'Error occurred while deleting Category!'
      });

    }
  },

  findById: async (req, res) => {
    const id = req.params.id;
    try {
      const result = await CategoryService.findById(id);
      if (!result) {
        res.status(404).json({ response_code: 404, status: false, message: 'Category not found!' });
        return;
      }
      res.status(200).json({
        response_code: 200,
        status: true,
        message: 'Category fetched successfully!',
        result
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({
        response_code: 500,
        status: false, message: 'Error occurred while fetching Category!'
      });
    }
  },

  updateById: async (req, res) => {
    const id = req.params.id;
    const { name } = req.body;
    try {
      const result = await CategoryService.updateById(id,name);
      if (result == 0) {
        res.status(404).json({ response_code: 404, status: false, message: 'Category not found!' });
        return;
      }
      res.status(200).json({
        response_code: 200,
        status: true,
        message: 'Category updated successfully!',
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({
        response_code: 500,
        status: false, message: 'Error occurred while updating Category!'
      });
    }
  },
}

export default CategoryController;