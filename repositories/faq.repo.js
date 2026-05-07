import Faq from "../models/faq.model.js";

const FaqRepo = {
    create: async (question, answer, isActive = true) => {
        try {
            const result = await Faq.create({ question, answer, isActive });
            return result;
        } catch (error) {
            throw error;
        }
    },

    findById: async (id) => {
        try {
            const result = await Faq.findOne({ where: { id } });
            return result;
        } catch (error) {
            throw error;
        }
    },

    getAll: async () => {
        try {
            const result = await Faq.findAll();
            return result;
        } catch (error) {
            throw error;
        }
    },

    updateById: async (id, question, answer, isActive) => {
        try {
            const updateData = {};
            if (question !== undefined) updateData.question = question;
            if (answer !== undefined) updateData.answer = answer;
            if (isActive !== undefined) updateData.isActive = isActive;

            const result = await Faq.update(updateData, { where: { id } });
            return result[0];
        } catch (error) {
            throw error;
        }
    },

    deleteById: async (id) => {
        try {
            const result = await Faq.destroy({ where: { id } });
            return result;
        } catch (error) {
            throw error;
        }
    }
};

export default FaqRepo;
