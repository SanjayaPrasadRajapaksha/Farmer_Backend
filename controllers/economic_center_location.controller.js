
import Economic_CenterService from "../services/economic_center_location.service.js";

const Economic_CenterController = {
  create: async (req, res) => {
    try {
      const { name } = req.body;

      const result = await Economic_CenterService.create(name);

      if (result.status) {
        res.status(201).json({
          response_code: 200,
          status: true,
          message: 'Economic Center added successfully!',
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
        message: 'Error occurred while saving Economic Center!'
      });
    }
  },

  getAll: async (req, res) => {
    try {
      const result = await Economic_CenterService.getAll();
      if (!result) {
        res.status(404).json({ response_code: 404, status: false, message: 'Economic Centers not found!' });
        return;
      }
      res.status(200).json({
        response_code: 200,
        status: true,
        message: 'Economic Centers fetched successfully!',
        result
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({
        response_code: 500,
        status: false, message: 'Error occurred while fetching Economic Centers!'
      });
    }
  },

  deleteById: async (req, res) => {
    const id = req.params.id;

    try {
      const result = await Economic_CenterService.deleteById(id);
      if (result == 1) {
        res.status(200).json({
          response_code: 200,
          status: true, message: 'Economic Center deleted successfully!'
        });
      } else {
        res.status(404).json({
          response_code: 404,
          status: false, message: 'Economic Center not found!'
        });
      }
    } catch (error) {
      console.error(error);
      res.status(500).json({
        response_code: 500,
        status: false, message: 'Error occurred while deleting Economic Center!'
      });

    }
  },

  findById: async (req, res) => {
    const id = req.params.id;
    try {
      const result = await Economic_CenterService.findById(id);
      if (!result) {
        res.status(404).json({ response_code: 404, status: false, message: 'Economic Center not found!' });
        return;
      }
      res.status(200).json({
        response_code: 200,
        status: true,
        message: 'Economic Center fetched successfully!',
        result
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({
        response_code: 500,
        status: false, message: 'Error occurred while fetching Economic Center!'
      });
    }
  },

  updateById: async (req, res) => {
    const id = req.params.id;
    const { name } = req.body;
    try {
      const result = await Economic_CenterService.updateById(id,name);
      if (result == 0) {
        res.status(404).json({ response_code: 404, status: false, message: 'Economic Center not found!' });
        return;
      }
      res.status(200).json({
        response_code: 200,
        status: true,
        message: 'Economic Center updated successfully!',
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({
        response_code: 500,
        status: false, message: 'Error occurred while updating Economic Center!'
      });
    }
  },
}

export default Economic_CenterController;