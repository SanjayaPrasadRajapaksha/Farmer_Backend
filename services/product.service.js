import ProductRepo from "../repositories/product.repo.js";

const ProductService = {
    create: async (name, unit, category_id) => {
        try {
            const result = await ProductRepo.create(name, unit, category_id);
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
            const result = await ProductRepo.getAll();
            return result;
        } catch (error) {
            throw error;
        }
    },

    findById: async (id) => {
        try {
            const result = await ProductRepo.findById(id);
            return result;
        } catch (error) {
            throw error;
        }
    },

    updateById: async (id, name, unit, category_id) => {
        try {
            const result = await ProductRepo.updateById(id, name, unit, category_id);
            return result;
        } catch (error) {
            throw error;
        }
    },

    deleteById: async (id) => {
        try {
            const result = await ProductRepo.deleteById(id);
            return result;
        } catch (error) {
            throw error;
        }
    },

}

export default ProductService;