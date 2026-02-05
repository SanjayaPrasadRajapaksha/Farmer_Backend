import Economic_CenterRepo from "../repositories/economic_center_location.repo.js";


const Economic_CenterService = {
    create: async (name) => {
        try {
            const result = await Economic_CenterRepo.create(name);
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
            const result = await Economic_CenterRepo.getAll();
            return result;
        } catch (error) {
            return { status: false, message: error.message };
        }
    },

    findById: async (id) => {
        try {
            const result = await Economic_CenterRepo.findById(id);
            return result;
        } catch (error) {
            return { status: false, message: error.message };
        }
    },

    updateById: async (id, name) => {
        try {
            const result = await Economic_CenterRepo.updateById(id, name);
            return result;
        } catch (error) {
            return { status: false, message: error.message };
        }
    },

    deleteById: async (id) => {
        try {
            const result = await Economic_CenterRepo.deleteById(id);
            return result;
        } catch (error) {
            return { status: false, message: error.message };
        }
    },

}

export default Economic_CenterService;