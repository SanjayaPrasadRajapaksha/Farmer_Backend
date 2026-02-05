import Price_Type from "../models/price_type.model.js";

const Price_TypeRepo = {
    create: async (name) => {
        try {

            const result = await Price_Type.create({
                name: name
            });
            return result;
        } catch (error) {
            throw error;
        }
    },

    findById: async (id) => {
        try {
            const result = await Price_Type.findOne({
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
            const result = await Price_Type.findAll({
            });
            return result;
        } catch (err) {
            throw err;
        }
    },

    updateById: async (id, name) => {
        try {
            const result = await Price_Type.update({
                name: name,
            }, {
                where: {
                    id: id
                }
            });
            return result[0];
        } catch (err) {
            throw err;
        }
    },

    deleteById: async (id) => {
        try {
            const result = await Price_Type.destroy({
                where: {
                    id: id,
                },

            });
            return result;
        } catch (err) {
            throw err;
        }
    }
}


export default Price_TypeRepo;