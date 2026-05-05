import User from "../models/user.model.js";

const UserRepo = {
  registerCustomer: async (
    name,
    email,
    phone,
    address,
    role_id,
  ) => {
    try {
      const result = await User.create({
        name: name,
        email: email,
        phone: phone,
        address: address,
        role_id: role_id,
        isActive: true,
      });
      return result;
    } catch (error) {
      throw error;
    }
  },

  registerSuperAdmin: async (
    email,
    password,
    role_id,
  ) => {
    try {
      const result = await User.create({
        email,
        password,
        role_id,
        role_id: role_id,
        isVerified: true,
        isActive: true,
      });
      return result;
    } catch (error) {
      throw error;
    }
  },

  registerAdmin: async (
    name,
    email,
    phone,
    address,
    encrypted_pw,
    role_id,
  ) => {
    try {
      const result = await User.create({
        name: name,
        email: email,
        phone: phone,
        address: address,
        password: encrypted_pw,
        role_id: role_id,
        isVerified: true,
        isActive: true,
      });
      return result;
    } catch (error) {
      throw error;
    }
  },

  getUserByEmail: async (email) => {
    try {
      const result = await User.findAll({
        where: {
          email: email,
        },
      });
      console.log(result);
      return result;
    } catch (error) {
      throw error;
    }
  },

    getUserByEmailWithRole: async (email,role_id) => {
    try {
      const result = await User.findAll({
        where: {
          email: email,
          role_id: role_id,
        },
      });
      console.log(result);
      return result;
    } catch (error) {
      throw error;
    }
  },

  getUserByRole: async (role) => {
    try {
      const result = await User.findAll({
        where: {
          role: role,
        },
      });
      return result;
    } catch (error) {
      throw error;
    }
  },

  getUserById: async (id) => {
    try {
      const user = await User.findByPk(id);
      return user;
    } catch (err) {
      throw err;
    }
  },

  updatePassword: async (id, hashedPassword) => {
    try {
      await User.update({ password: hashedPassword }, { where: { id } });
      return true;
    } catch (err) {
      throw err;
    }
  },

  storeOTP: async (id, otp, expireTime) => {
    try {
      const result = await User.update(
        {
          otp,
          otpExpiryTime: expireTime,
        },
        { where: { id: id } }
      );
      return result;
    } catch (error) {
      throw error;
    }
  },

  getStroedOTPByEmail: async (email) => {
    try {
      const exUser = await User.findOne({
        where: { email: email },
        attributes: ["otp", "otpExpiryTime"],
      });
      return exUser
        ? { otp: exUser.otp, expiryTime: exUser.otpExpiryTime }
        : null;
    } catch (error) {
      throw error;
    }
  },

  clearStoredOTP: async (email) => {
    try {
      await User.update(
        {
          otp: null,
          otpExpiryTime: null,
        },
        {
          where: { email: email },
        }
      );
    } catch (error) {
      throw error;
    }
  },

  changeUserPasswordByEmail: async (email, encrypted_pw) => {
    try {
      const result = await User.update(
        {
          password: encrypted_pw,
        },
        {
          where: {
            email: email,
          },
        }
      );
      return result;
    } catch (error) {
      throw error;
    }
  },

  getAllUser: async () => {
    try {
      const result = await User.findAll();
      return result;
    } catch (error) {
      throw error;
    }
  },

  getUserById: async (id) => {
    try {
      const result = await User.findAll({
        where: {
          id: id,
        },
      });
      return result;
    } catch (error) {
      throw error;
    }
  },

  getUserByRoleId: async (role_id) => {
    try {
      const result = await User.findAll({
        where: {
          role_id: role_id,
        },
      });
      return result;
    } catch (error) {
      throw error;
    }
  },

  updateRoleByUserId: async (id, role) => {
    try {
      const result = await User.update(
        {
          role: role,
        },
        {
          where: {
            id: id,
          },
        }
      );
      return result;
    } catch (error) {
      throw error;
    }
  },

  deleteUserById: async (id) => {
    try {
      const result = await User.destroy({
        where: {
          id: id,
        },
      });
      return result;
    } catch (err) {
      throw err;
    }
  },


  updateUserById: async (
    id,
    name,
    email,
    phone,
    address,
  ) => {
    try {
      const result = await User.update(
        {
          name: name,
          email: email,
          phone: phone,
          address: address,
        },
        {
          where: {
            id: id,
          },
        }
      );
      return result;
    } catch (err) {
      console.log(err);
      throw err;
    }
  },

  changePasswordByUserId: async (id, newPassword) => {
    try {
      const result = await User.update(
        {
          password: newPassword,
        },
        {
          where: {
            id: id,
          },
        }
      );
      return result;
    } catch (err) {
      console.log(err);
      throw err;
    }
  },

  verifyUserById: async (id, status) => {
    try {
      const result = await User.update(
        {
          isVerified: status,
        },
        {
          where: {
            id: id,
          },
        }
      );
      return result;
    } catch (err) {
      console.log(err);
      throw err;
    }
  },

  activateUserById: async (id, status) => {
    try {
      const result = await User.update(
        {
          isActive: status,
        },
        {
          where: {
            id: id,
          },
        }
      );
      return result;
    } catch (err) {
      console.log(err);
      throw err;
    }
  },
};
export default UserRepo;