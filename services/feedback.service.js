import FeedbackRepo from "../repositories/feedback.repo.js";


const FeedbackService = {
    create: async (name, message, rate) => {
        try {
            const result = await FeedbackRepo.create(name, message, rate);
            return {
                status: true,
                result: result
            };
        } catch (error) {
            return { status: false, message: error.message };
        }
    },

    getAll: async () => {
        try {
            const result = await FeedbackRepo.getAll();
            return result;
        } catch (error) {
            return { status: false, message: error.message };
        }
    },

    findById: async (id) => {
        try {
            const result = await FeedbackRepo.findById(id);
            return result;
        } catch (error) {
            return { status: false, message: error.message };
        }
    },

    deleteById: async (id) => {
        try {
            const result = await FeedbackRepo.deleteById(id);
            return result;
        } catch (error) {
            return { status: false, message: error.message };
        }
    },

    verifyById: async (id, status) => {
        try {
            const result = await FeedbackRepo.verifyById(id, status);
            return result;
        } catch (error) {
            return { status: false, message: error.message };
        }
    }


}

export default FeedbackService;