import ContactService from "../services/contact.service.js";


const ContactController = {
    contactAdd: async (req, res) => {
        try {

            const { name, phoneNumber,email, message } = req.body;

            if (!name || !phoneNumber || !email || !message) {
                return res.status(400).json({
                    response_code: 400,
                    status: false,
                    message: 'Please provide all fields'
                });
            }

            const result = await ContactService.contactAdd(name, phoneNumber,email, message);
            if (result) {
                res.status(201).json({
                    response_code: 200,
                    status: true,
                    result: result
                });
            } else {
                res.status(400).json({
                    response_code: 400,
                    status: false,
                    message: result.message
                });
            }
        } catch (error) {
            console.error(error);
            res.status(500).json({
                response_code: 500,
                error: error,
                status: false,
                message: 'Error occurred while registering Contact!'
            });
        }
    },

    getAllContact: async (req, res) => {
        try {
            const contact = await ContactService.getAllContact();
            if (!contact[0]) {
                res.status(404).json({ response_code: 404, status: false, message: 'Contacts not found!' });
                return;
            }
            res.status(200).json({
                response_code: 200,
                status: true,
                message: 'Contacts get successfully!',
                contact
            });
        } catch (error) {
            console.error(error);
            res.status(500).json({
                response_code: 500,
                status: false, message: 'Error occurred while fetching Contacts!'
            });
        }
    },

    deleteContactById: async (req, res) => {
        const id = req.params.id;

        try {
            const isContactDelete = await ContactService.deleteContactById(id);

            if (isContactDelete == 1) {
                res.status(200).json({
                    response_code: 200,
                    status: true, message: 'Contact deleted successfully!'
                });
            } else {
                res.status(404).json({
                    response_code: 404,
                    status: false, message: 'Contact not found!'
                });
            }
        } catch (error) {
            console.error(error);
            res.status(500).json({
                response_code: 500,
                status: false, message: 'Error occurred while deleting Contact!'
            });

        }
    },

    getContactById: async (req, res) => {
        const id = req.params.id;
        try {
            const contact = await ContactService.getContactById(id);
            if (!contact) {
                res.status(404).json({ response_code: 404, status: false, message: 'Contact not found!' });
                return;
            }
            res.status(200).json({
                response_code: 200,
                status: true,
                message: 'Contact gets successfully!',
                contact
            });
        } catch (error) {
            console.error(error);
            res.status(500).json({
                response_code: 500,
                status: false, message: 'Error occurred while fetching contact!'
            });
        }
    },
}

export default ContactController