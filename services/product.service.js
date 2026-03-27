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
            const product = await ProductRepo.findById(id);
            if (!product) return 0;

            // Delete the Cloudinary asset if we have its public_id stored
            if (product.public_id) {
                try {
                    await cloudinary.uploader.destroy(product.public_id);
                } catch (e) {
                    console.warn("Cloudinary delete failed:", e.message);
                }
            }

            const result = await ProductRepo.deleteById(id);
            return result;

        } catch (error) {
            throw error;
        }
    },

    uploadImage: async (id, fileBase64, fileType) => {
        try {
            const product = await ProductRepo.findById(id);
            if (!product) {
                return {
                    status: false,
                    message: "Product not found"
                };
            }

            // If product already has an image, remove it from Cloudinary first
            if (product.public_id) {
                try {
                    await cloudinary.uploader.destroy(product.public_id);
                } catch (e) {
                    console.warn("Cloudinary old image delete failed:", e.message);
                }
            }
            // Upload to Cloudinary
            const result = await cloudinary.uploader.upload(
                `data:${fileType};base64,${fileBase64}`,
                { folder: "farmer_product_images" }
            );

            // ✅ Extract from result
            const publicId = result.public_id;

            // ✅ Save BOTH publicId + URL
            const updated = await ProductRepo.uploadImage(
                id,
                publicId,
                result.secure_url
            );

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