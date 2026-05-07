import FaqService from "../services/faq.service.js";

const FaqController = {
    create: async (req, res) => {
        try {
            const { question, answer, isActive } = req.body;
            const result = await FaqService.create(question, answer, isActive);
            if (result.status) {
                res.status(201).json({ response_code: 200, status: true, message: 'FAQ created successfully!', result: result.result });
            } else {
                res.status(400).json({ response_code: 400, status: false, message: result.message });
            }
        } catch (error) {
            console.error(error);
            res.status(500).json({ response_code: 500, status: false, message: 'Error occurred while creating FAQ!' });
        }
    },

    getAll: async (req, res) => {
        try {
            const result = await FaqService.getAll();
            if (!result) {
                res.status(404).json({ response_code: 404, status: false, message: 'FAQs not found!' });
                return;
            }
            res.status(200).json({ response_code: 200, status: true, message: 'FAQs fetched successfully!', result });
        } catch (error) {
            console.error(error);
            res.status(500).json({ response_code: 500, status: false, message: 'Error occurred while fetching FAQs!' });
        }
    },

    findById: async (req, res) => {
        const id = req.params.id;
        try {
            const result = await FaqService.findById(id);
            if (!result) {
                res.status(404).json({ response_code: 404, status: false, message: 'FAQ not found!' });
                return;
            }
            res.status(200).json({ response_code: 200, status: true, message: 'FAQ fetched successfully!', result });
        } catch (error) {
            console.error(error);
            res.status(500).json({ response_code: 500, status: false, message: 'Error occurred while fetching FAQ!' });
        }
    },

    updateById: async (req, res) => {
        const id = req.params.id;
        const { question, answer, isActive } = req.body;
        try {
            const result = await FaqService.updateById(id, question, answer, isActive);
            if (result == 0) {
                res.status(404).json({ response_code: 404, status: false, message: 'FAQ not found!' });
                return;
            }
            res.status(200).json({ response_code: 200, status: true, message: 'FAQ updated successfully!' });
        } catch (error) {
            console.error(error);
            res.status(500).json({ response_code: 500, status: false, message: 'Error occurred while updating FAQ!' });
        }
    },

    deleteById: async (req, res) => {
        const id = req.params.id;
        try {
            const result = await FaqService.deleteById(id);
            if (result == 1) {
                res.status(200).json({ response_code: 200, status: true, message: 'FAQ deleted successfully!' });
            } else {
                res.status(404).json({ response_code: 404, status: false, message: 'FAQ not found!' });
            }
        } catch (error) {
            console.error(error);
            res.status(500).json({ response_code: 500, status: false, message: 'Error occurred while deleting FAQ!' });
        }
    }
};

export default FaqController;
