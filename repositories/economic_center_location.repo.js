import Economic_Center_Location from "../models/economic_center_location.model.js";

const Economic_CenterRepo = {
    create: async (name) => {
        try {

            const result = await Economic_Center_Location.create({
                name: name
            });
            return result;
        } catch (error) {
            throw error;
        }
    },

    findById: async (id) => {
        try {
            const result = await Economic_Center_Location.findOne({
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
            const result = await Economic_Center_Location.findAll({
            });
            return result;
        } catch (err) {
            throw err;
        }
    },

    updateById: async (id, name) => {
        try {
            const result = await Economic_Center_Location.update({
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
            const result = await Economic_Center_Location.destroy({
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


export default Economic_CenterRepo;