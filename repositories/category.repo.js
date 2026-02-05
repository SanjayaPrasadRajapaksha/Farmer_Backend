import Category from "../models/category.model.js";

const CategoryRepo = {
    create: async (name) => {
        try {

            const result = await Category.create({
                name: name
            });
            return result;
        } catch (error) {
            throw error;
        }
    },

    findById: async (id) => {
        try {
            const result = await Category.findOne({
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
            const result = await Category.findAll({
            });
            return result;
        } catch (err) {
            throw err;
        }
    },

    updateById: async (id, name) => {
        try {
            const result = await Category.update({
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
            const result = await Category.destroy({
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


export default CategoryRepo;