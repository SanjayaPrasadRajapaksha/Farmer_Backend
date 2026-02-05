import Product from "../models/product.model.js";

const ProductRepo = {
    create: async (name, unit, category_id) => {
        try {

            const result = await Product.create({
                name: name,
                unit: unit,
                category_id: category_id
            });
            return result;
        } catch (error) {
            throw error;
        }
    },

    findById: async (id) => {
        try {
            const result = await Product.findOne({
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
            const result = await Product.findAll({
            });
            return result;
        } catch (err) {
            throw err;
        }
    },

    updateById: async (id, name, unit, category_id) => {
        try {
            const updateData = {};
            if (name !== undefined) updateData.name = name;
            if (unit !== undefined) updateData.unit = unit;
            if (category_id !== undefined) updateData.category_id = category_id;

            const result = await Product.update(updateData, {
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
            const result = await Product.destroy({
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


export default ProductRepo;