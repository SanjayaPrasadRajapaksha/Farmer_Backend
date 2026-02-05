import Price_TypeService from "../services/price_type.service.js";

const Price_TypeController = {
  create: async (req, res) => {
    try {
      const { name } = req.body;

      const result = await Price_TypeService.create(name);

      if (result.status) {
        res.status(201).json({
          response_code: 200,
          status: true,
          message: 'Price Type added successfully!',
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
        message: 'Error occurred while saving Price Type!'
      });
    }
  },

  getAll: async (req, res) => {
    try {
      const result = await Price_TypeService.getAll();
      if (!result) {
        res.status(404).json({ response_code: 404, status: false, message: 'Price Types not found!' });
        return;
      }
      res.status(200).json({
        response_code: 200,
        status: true,
        message: 'Price Types fetched successfully!',
        result
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({
        response_code: 500,
        status: false, message: 'Error occurred while fetching Price Types!'
      });
    }
  },

  deleteById: async (req, res) => {
    const id = req.params.id;

    try {
      const result = await Price_TypeService.deleteById(id);
      if (result == 1) {
        res.status(200).json({
          response_code: 200,
          status: true, message: 'Price Type deleted successfully!'
        });
      } else {
        res.status(404).json({
          response_code: 404,
          status: false, message: 'Price Type not found!'
        });
      }
    } catch (error) {
      console.error(error);
      res.status(500).json({
        response_code: 500,
        status: false, message: 'Error occurred while deleting Price Type!'
      });

    }
  },

  findById: async (req, res) => {
    const id = req.params.id;
    try {
      const result = await Price_TypeService.findById(id);
      if (!result) {
        res.status(404).json({ response_code: 404, status: false, message: 'Price Type not found!' });
        return;
      }
      res.status(200).json({
        response_code: 200,
        status: true,
        message: 'Price Type fetched successfully!',
        result
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({
        response_code: 500,
        status: false, message: 'Error occurred while fetching Price Type!'
      });
    }
  },

  updateById: async (req, res) => {
    const id = req.params.id;
    const { name } = req.body;
    try {
      const result = await Price_TypeService.updateById(id,name);
      if (result == 0) {
        res.status(404).json({ response_code: 404, status: false, message: 'Price Type not found!' });
        return;
      }
      res.status(200).json({
        response_code: 200,
        status: true,
        message: 'Price Type updated successfully!',
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({
        response_code: 500,
        status: false, message: 'Error occurred while updating Price Type!'
      });
    }
  },
}

export default Price_TypeController;