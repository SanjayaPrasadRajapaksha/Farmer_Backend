import FeedbackService from "../services/feedback.service.js"; 

const FeedbackController = {
  create: async (req, res) => {
    try {
      const { name, message, rate } = req.body;

      const result = await FeedbackService.create(name, message, rate);

      if (result.status) {
        res.status(201).json({
          response_code: 200,
          status: true,
          message: 'Feedback added successfully!',
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
        message: 'Error occurred while saving feedback!'
      });
    }
  },

  getAll: async (req, res) => {
    try {
      const result = await FeedbackService.getAll();
      if (!result) {
        res.status(404).json({ response_code: 404, status: false, message: 'Feedback not found!' });
        return;
      }
      res.status(200).json({
        response_code: 200,
        status: true,
        message: 'Feedback fetched successfully!',
        result
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({
        response_code: 500,
        status: false, message: 'Error occurred while fetching feedback!'
      });
    }
  },

  deleteById: async (req, res) => {
    const id = req.params.id;

    try {
      const result = await FeedbackService.deleteById(id);

      if (result == 1) {
        res.status(200).json({
          response_code: 200,
          status: true, message: 'Feedback deleted successfully!'
        });
      } else {
        res.status(404).json({
          response_code: 404,
          status: false, message: 'Feedback not found!'
        });
      }
    } catch (error) {
      console.error(error);
      res.status(500).json({
        response_code: 500,
        status: false, message: 'Error occurred while deleting feedback!'
      });

    }
  },

  findById: async (req, res) => {
    const id = req.params.id;
    try {
      const result = await FeedbackService.findById(id);
      if (!result) {
        res.status(404).json({ response_code: 404, status: false, message: 'Feedback not found!' });
        return;
      }
      res.status(200).json({
        response_code: 200,
        status: true,
        message: 'Feedback fetched successfully!',
        result
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({
        response_code: 500,
        status: false, message: 'Error occurred while fetching feedback!'
      });
    }
  },

  verifyById: async (req, res) => {
    const id = req.params.id;
    const { status } = req.body;

    try {
      const result = await FeedbackService.verifyById(id, status);

      if (result == 1) {
        res.status(200).json({
          response_code: 200,
          status: true, message: 'Feedback verification status updated successfully!'
        });
      } else {
        res.status(404).json({
          response_code: 404,
          status: false, message: 'Feedback not found!'
        });
      }
    } catch (error) {
      console.error(error);
      res.status(500).json({
        response_code: 500,
        status: false, message: 'Error occurred while updating feedback verification status!'
      });
    }
  },
}

export default FeedbackController;