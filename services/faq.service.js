import FaqRepo from "../repositories/faq.repo.js";

const FaqService = {
    create: async (question, answer, isActive = true) => {
        try {
            const result = await FaqRepo.create(question, answer, isActive);
            return { status: true, result };
        } catch (error) {
            return { status: false, message: error.message };
        }
    },

    getAll: async () => {
        try {
            const result = await FaqRepo.getAll();
            return result;
        } catch (error) {
            throw error;
        }
    },

    findById: async (id) => {
        try {
            const result = await FaqRepo.findById(id);
            return result;
        } catch (error) {
            throw error;
        }
    },

    updateById: async (id, question, answer, isActive) => {
        try {
            const result = await FaqRepo.updateById(id, question, answer, isActive);
            return result;
        } catch (error) {
            throw error;
        }
    },

    deleteById: async (id) => {
        try {
            const faq = await FaqRepo.findById(id);
            if (!faq) return 0;
            const result = await FaqRepo.deleteById(id);
            return result;
        } catch (error) {
            throw error;
        }
    }
};

export default FaqService;
