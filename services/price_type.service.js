import Price_TypeRepo from "../repositories/price_type.repo.js";

const Price_TypeService = {
    create: async (name) => {
        try {
            const result = await Price_TypeRepo.create(name);
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
            const result = await Price_TypeRepo.getAll();
            return result;
        } catch (error) {
            return { status: false, message: error.message };
        }
    },

    findById: async (id) => {
        try {
            const result = await Price_TypeRepo.findById(id);
            return result;
        } catch (error) {
            return { status: false, message: error.message };
        }
    },

    updateById: async (id, name) => {
        try {
            const result = await Price_TypeRepo.updateById(id, name);
            return result;
        } catch (error) {
            return { status: false, message: error.message };
        }
    },

    deleteById: async (id) => {
        try {
            const result = await Price_TypeRepo.deleteById(id);
            return result;
        } catch (error) {
            return { status: false, message: error.message };
        }
    },

}

export default Price_TypeService;