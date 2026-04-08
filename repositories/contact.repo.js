import { Contact } from "../models/contact.model.js";

const ContactRepo = {
    contactAdd: async (name, phoneNumber,email, message) => {
        try {

            const result = await Contact.create({
                name: name,
                phoneNumber: phoneNumber,
                email: email,
                message: message
            }
            );
            return result;
        } catch (error) {
            throw error;
        }
    },

    getAllContact: async () => {
        try {
            const result = await Contact.findAll({

            });
            return result;
        } catch (error) {
            throw error;
        }
    },

    findById: async (id) => {
        try {
            const result = await Contact.findOne({
                where: {
                    id: id,
                },

            });
            return result;
        } catch (error) {
            throw error;
        }
    },

    deleteContactById: async (id) => {
        try {
            const result = await Contact.destroy({
                where: {
                    id: id,
                },

            });
            return result;
        } catch (error) {
            throw error;
        }
    }
}


export default ContactRepo;