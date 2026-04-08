import Feedback from "../models/feedback.model.js";

const FeedbackRepo = {
    create: async (name, message, rate) => {
        try {

            const result = await Feedback.create({
                name: name,
                message: message,
                rate: rate
            });
            return result;
        } catch (error) {
            throw error;
        }
    },

    findByPosition: async (position) => {
        try {
            return await Role.findOne({
                where: {
                    position: position,
                },
            });
        } catch (error) {
            throw error;
        }
    },


    findById: async (id) => {
        try {
            const result = await Feedback.findOne({
                where: {
                    id: id,
                },

            });
            return result;
        } catch (error) {
            throw error;
        }
    },

    getAll: async () => {
        try {
            const result = await Feedback.findAll({
            });
            return result;
        } catch (err) {
            throw err;
        }
    },

    deleteById: async (id) => {
        try {
            const result = await Feedback.destroy({
                where: {
                    id: id,
                },

            });
            return result;
        } catch (err) {
            throw err;
        }
    },

    verifyById: async (id, status) => {
        try {
            const result = await Feedback.update({
                verified: status
            }, {
                where: {
                    id: id
                }
            });
            return result[0];
        } catch (error) {
            throw error;
        }
    },
}


export default FeedbackRepo;