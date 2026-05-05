import UserService from "../services/user.service.js";

const UserController = {
    changePasswordByUserId: async (req, res) => {
        const { id } = req.params;
        const { newPassword } = req.body;

        if (!newPassword) {
            return res.status(400).json({
                response_code: 400,
                status: false,
                message: "newPassword is required"
            });
        }

        try {
            const result = await UserService.changePasswordByUserId(id, newPassword);
            if (result.status) {
                return res.status(200).json({
                    response_code: 200,
                    status: true,
                    message: result.message
                });
            } else {
                return res.status(400).json({
                    response_code: 400,
                    status: false,
                    message: result.message
                });
            }
        } catch (error) {
            console.error("getAllUser error:", error);
            console.error("updatePasswordByUserID error:", error);
            return res.status(500).json({
                response_code: 500,
                status: false,
                message: "Internal server error"
            });
        }
    },

    registerCustomer: async (req, res) => {
        console.log("In register user controller");
        const {
            name,
            email,
            phone,
            address,
            role_id, } = req.body;

        try {
            const result = await UserService.registerCustomer(name,
                email,
                phone,
                address,
                role_id,);
            if (!result.status) {
                res.status(400).json({ response_code: 400, error: result.message, });
            } else {
                res.status(201).json({ response_code: 201, status: result.status, message: result.message, result: result.result, token: result.token });
            }
        }
        catch (error) {
            console.error('Error submitting request form:', error);
            return res.status(500).json({
                response_code: 500,
                status: false,
                message: 'Internal server error',
            });
        }
    },

    registerSuperAdmin: async (req, res) => {

        try {
            const result = await UserService.registerSuperAdmin();
            if (!result.status) {
                return res.status(400).json({
                    response_code: 400,
                    status: false,
                    message: result.message
                });
            }
            return res.status(201).json({
                response_code: 201,
                status: true,
                message: result.message,
                user: result.user
            });
        } catch (error) {
            console.error('Error submitting request form:', error);
            return res.status(500).json({
                response_code: 500,
                status: false,
                message: 'Internal server error',
            });
        }
    },

    registerAdmin: async (req, res) => {
        const {
            name,
            email,
            phone,
            address,
            password,
            role_id, } = req.body;

        try {
            const result = await UserService.registerAdmin(
                name,
                email,
                phone,
                address,
                password,
                role_id
            );
            if (!result.status) {
                return res.status(400).json({
                    response_code: 400,
                    status: false,
                    message: result.message
                });
            }
            return res.status(201).json({
                response_code: 201,
                status: true,
                message: result.message,
                user: result.user
            });
        } catch (error) {
            console.error('Error submitting request form:', error);
            return res.status(500).json({
                response_code: 500,
                status: false,
                message: 'Internal server error',
            });
        }
    },


    userLogin: async (req, res) => {
        const { email, password } = req.body;
        try {
            const result = await UserService.userLogin(email, password);
            if (!result.status) {
                // If status is false, return status 400 with the error message
                res.status(400).json({ response_code: 400, status: result.status, error: result.message, });
            } else {
                // If status is true, return status 200 with the success message and token
                res.status(200).json({ response_code: 200, status: result.status, message: result.message, result: result.user, token: result.token });
            }
        } catch (error) {
            console.error('Error submitting request form:', error);
            return res.status(500).json({
                response_code: 500,
                status: false,
                message: 'Internal server error',
            });
        }
    },

    sendOTP: async (req, res) => {
        const { email } = req.body;
        try {
            const result = await UserService.generateAndSendOTP(email);

            if (!result.status) {
                // If status is false, return status 400 with the error message
                res.status(400).json({ response_code: 400, message: result.message });
            } else {
                // If status is true, return status 200 with the success message and token
                res.status(200).json({ response_code: 200, UserId: result.UserId, message: result.message });
            }
        } catch (error) {
            console.error('Error submitting request form:', error);
            return res.status(500).json({
                response_code: 500,
                status: false,
                message: 'Internal server error',
            });
        }
    },

    changeUserPasswordWithOTP: async (req, res) => {
        const { email, enteredOTP, newPassword } = req.body;
        try {
            const result = await UserService.validateOTP(email, enteredOTP, newPassword);
            if (!result || !result.status) {
                return res.status(400).json({
                    response_code: 400,
                    status: false,
                    message: result && result.message ? result.message : "Invalid Credentials",
                });
            } else {
                return res.status(200).json({
                    response_code: 200,
                    status: true,
                    message: "Password changed successfully",
                });
            }
        } catch (error) {
            return res.status(500).json({
                response_code: 500,
                status: false,
                message: 'Internal server error',
            });
        }
    },

    getAllUser: async (req, res) => {
        try {
            console.log("In get all user controller");
            const result = await UserService.getAllUser();

            if (result.status === false) {
                res.status(400)
                    .json({ response_code: 400, status: result.status, message: result.message });
            } else {
                res.status(200).json({ response_code: 200, status: result.status, message: result.message, result: result.data });
            }
        } catch (error) {
            console.error('Error submitting request form:', error);
            return res.status(500).json({
                response_code: 500,
                status: false,
                message: 'Internal server error',
            });
        }
    },

    getUserById: async (req, res) => {
        try {

            const id = req.params.id;
            const result = await UserService.getUserById(id);
            if (result.status) {
                res.status(200).json({
                    response_code: 200,
                    status: result.status,
                    message: result.message,
                    result: result.data,
                });
            } else {
                res.status(404).json({
                    response_code: 404,
                    status: result.status,
                    message: result.message,
                });
            }
        } catch (error) {
            return res.status(500).json({
                response_code: 500,
                status: false,
                message: 'Internal server error',
            });
        }
    },

    getUserByRole: async (req, res) => {
        try {
            const { role_id } = req.body;

            const result = await UserService.getUserByRoleId(role_id);
            if (result.status) {
                res.status(200).json({
                    response_code: 200,
                    status: result.status,
                    message: result.message,
                    result: result.data,
                });
            } else {
                res.status(404).json({
                    response_code: 404,
                    status: result.status,
                    message: result.message,
                });
            }
        } catch (error) {
            return res.status(500).json({
                response_code: 500,
                status: false,
                message: 'Internal server error',
            });
        }
    },

    deleteUserById: async (req, res) => {

        try {
            const id = req.params.id;
            const result = await UserService.deleteUserById(id);
            if (result.status) {
                res.status(200).json({
                    response_code: 200,
                    status: result.status,
                    message: result.message,
                });
            } else {
                res.status(400).json({
                    response_code: 404,
                    status: result.status,
                    message: result.message,
                });
            }
        } catch (error) {
            return res.status(500).json({
                response_code: 500,
                status: false,
                message: error.message
            });
        }
    },

    updateUserById: async (req, res) => {
        const { id } = req.params;
        const {
            name,
            email,
            phone,
            address, } = req.body;

        try {
            const result = await UserService.updateUserById(
                id,
                name,
                email,
                phone,
                address,
            );

            if (result.status) {
                res.status(200).json({
                    response_code: 200,
                    status: result.status,
                    message: result.message,
                });
            } else {
                res.status(400).json({
                    response_code: 404,
                    status: result.status,
                    message: result.message,
                });
            }
        } catch (error) {
            return res.status(500).json({
                response_code: 500,
                status: false,
                message: error.message
            });
        }
    },

    verifyUserById: async (req, res) => {
        const { id } = req.params;
        const { status } = req.body; // expecting a boolean value

        try {
            const result = await UserService.verifyUserById(id, status);



            if (result.status) {
                res.status(200).json({
                    response_code: 200,
                    status: result.status,
                    message: result.message,
                });
            } else {
                res.status(400).json({
                    response_code: 404,
                    status: result.status,
                    message: result.message,
                });
            }
        } catch (error) {
            return res.status(500).json({
                response_code: 500,
                status: false,
                message: error.message
            });
        }
    },

    activateUserById: async (req, res) => {
        const { id } = req.params;
        const { status } = req.body; // expecting a boolean value

        try {
            const result = await UserService.activateUserById(id, status);

            if (result.status) {
                res.status(200).json({
                    response_code: 200,
                    status: result.status,
                    message: result.message,
                });
            } else {
                res.status(400).json({
                    response_code: 404,
                    status: result.status,
                    message: result.message,
                });
            }
        } catch (error) {
            return res.status(500).json({
                response_code: 500,
                status: false,
                message: error.message
            });
        }
    },

}
export default UserController;