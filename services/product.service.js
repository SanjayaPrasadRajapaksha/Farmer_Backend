import cloudinary from "../config/cloudinary.js";
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

    uploadImage: async (id, fileBase64, fileType) => {
        try {
            // Upload to Cloudinary
            const result = await cloudinary.uploader.upload(
                `data:${fileType};base64,${fileBase64}`,
                { folder: "farmer_product_images" }
            );

            // Update DB with the image URL
            const updated = await ProductRepo.uploadImage(id, result.secure_url);

            return {
                status: true,
                imageUrl: result.secure_url
            };
        } catch (error) {
            console.error(error);
            return {
                status: false,
                message: error.message
            };
        }
    },
}

export default ProductService;