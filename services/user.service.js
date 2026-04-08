import bcrypt from "bcrypt";
import dotenv from "dotenv";
import jwt from "jsonwebtoken";
import sendEmail from "../config/sendEmail.js";
import UserRepo from "../repositories/user.repo.js";
import RoleRepo from "../repositories/role.repo.js";
dotenv.config();

const UserService = {
    registerCustomer: async (
        name,
        email,
        phone,
        address,
        role_id,
    ) => {
        try {
            // Check for existing username
            const exUser = await UserRepo.getUserByEmail(email);
            if (exUser[0]) {
                return {
                    status: false,
                    message: "Already Email is used!",
                };
            }

            console.log("Email: ", email);

    

            // Register the user
            const result = await UserRepo.registerCustomer(
                name,
                email,
                phone,
                address,
                role_id,
            );
const accountCreationMessage = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Welcome to Farmer App</title>
  <style>
    body {
      margin: 0;
      padding: 0;
      font-family: Arial, sans-serif;
      background-color: #f6f6f6;
    }
    .container {
      max-width: 600px;
      margin: 40px auto;
      background-color: #ffffff;
      padding: 30px;
      border-radius: 10px;
      box-shadow: 0 4px 15px rgba(0,0,0,0.1);
      text-align: center;
    }
    .header {
      font-size: 20px;
      font-weight: bold;
      margin-bottom: 20px;
      color: #27AE60;
    }
    .content {
      font-size: 16px;
      color: #333333;
      line-height: 1.6;
    }
    .status-box {
      margin: 20px 0;
      padding: 15px;
      border: 2px solid #27AE60;
      border-radius: 6px;
      background-color: #F4FFF7;
      color: #27AE60;
      font-weight: bold;
    }
    .footer {
      margin-top: 30px;
      font-size: 14px;
      color: #555555;
      text-align: left;
    }
    .brand {
      font-weight: bold;
    }
  </style>
</head>
<body>
  <div class="container">

    <div class="header">
      🌱 Welcome to Farmer Web
    </div>

    <div class="content">
      <p>Thank you for registering with us!</p>

      <div class="status-box">
        ✔ Your account has been created successfully
      </div>

      <p>
        Our team is currently reviewing your account details.
      </p>

      <p>
        📧 We will notify you via email once your account has been verified.
      </p>
    </div>

    <div class="footer">
      Best regards,<br>
      <span class="brand">The FARMER Team</span>
    </div>

  </div>
</body>
</html>
`;

            if (result) {
                await sendEmail(email, accountCreationMessage, "Welcome to Farmer App");

                return {
                    status: true,
                    message: "User registered successfully!",
                    user: result,
                };
            } else {
                return {
                    status: false,
                    message: "User registration failed.",
                };
            }
        } catch (error) {
            console.error("Error in registerUser: ", error.message);
            throw error;
        }
    },

    registerAdmin: async () => {
        try {
            const password = process.env.ADMIN_PASSWORD;
            const email = process.env.ADMIN_EMAIL;
            const encrypted_pw = await bcrypt.hash(password, 10);

            const existingUser = await UserRepo.getUserByEmail(
                email,
            );
            if (existingUser[0]) {
                return {
                    status: false,
                    message: "Super Admin user already exists.",
                };
            }
            // Create role if not exists (idempotent)
            const position = "Admin";
            const role = await RoleRepo.findOrCreateByPosition(position)

            // Register the user
            const result = await UserRepo.registerAdmin(
                email,
                encrypted_pw,
                role.id,
            );

            if (result) {
                return {
                    status: true,
                    message: "User registered successfully!",
                    user: result,
                };
            } else {
                return {
                    status: false,
                    message: "User registration failed.",
                };
            }
        } catch (error) {
            console.error("Error in registerUser: ", error.message);
            throw error;
        }
    },

    changePasswordByUserId: async (user_id, newPassword) => {
        try {
            const user = await UserRepo.getUserById(user_id);

            if (!user[0]) {
                return { status: false, message: "User not found!" };
            }

            const hashedNewPassword = await bcrypt.hash(newPassword, 10);
            const result = await UserRepo.changePasswordByUserId(
                user_id,
                hashedNewPassword
            );
            return {
                status: true,
                message: "Password updated successfully",
                data: result,
            };
        } catch (error) {
            throw error;
        }
    },

    userLogin: async (email, password) => {
        try {
            const exUser = await UserRepo.getUserByEmail(email);

            if (!exUser[0]) {
                return { status: false, message: "User data not found!" };
            }

            const user = exUser[0];
            const userRole = await RoleRepo.findById(user.role_id);

            const match = await bcrypt.compare(password, user.password);

            if (!match) {
                return { status: false, message: "Invalid Password." };
            }

            const token = jwt.sign(
                {
                    UserId: user.id,
                    role: userRole.position
                },
                process.env.JWT_SECRET,
                { expiresIn: '24h' }
            );

            return {
                status: true,
                message: "Logged In Successfully.",
                user: user,
                token
            };

        } catch (error) {
            throw error;
        }
    },

    generateAndSendOTP: async (email) => {
        try {
            const exUser = await UserRepo.getUserByEmail(email);
            if (!exUser?.[0]) {
                return {
                    status: false,
                    message: "User data not found!",
                };
            }

            const otp = Math.floor(100000 + Math.random() * 900000).toString();

            const otpHashed = await bcrypt.hash(otp, 10);
            const expiration = new Date(Date.now() + 300000); // OTP expires in 5 minutes
            const result = await UserRepo.storeOTP(
                exUser[0].id,
                otpHashed,
                expiration
            );
            if (!result || result[0] === 0) {
                return {
                    status: false,
                    message: "Failed to save OTP in database!",
                };
            }
            const credentialMessage = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Your OTP</title>
  <style>
    body {
      margin: 0;
      padding: 0;
      font-family: Arial, sans-serif;
      background-color: #f6f6f6;
    }
    .container {
      max-width: 600px;
      margin: 40px auto;
      background-color: #ffffff;
      padding: 30px;
      border-radius: 10px;
      box-shadow: 0 4px 15px rgba(0,0,0,0.1);
      text-align: center;
    }
    .header {
      font-size: 18px;
      font-weight: bold;
      margin-bottom: 20px;
      text-align: left;
    }
    .content {
      font-size: 16px;
      color: #333333;
      line-height: 1.6;
    }
    .otp-container {
      margin: 20px 0;
    }
    .otp-box {
      display: inline-block;
      width: 45px;
      height: 55px;
      line-height: 55px;
      margin: 0 5px;
      font-size: 22px;
      font-weight: bold;
      color: #27AE60;
      border: 2px solid #27AE60;
      border-radius: 6px;
      background-color: #F4FFF7;
    }
    .warning {
      color: #C0392B;
      font-weight: bold;
      margin-top: 15px;
    }
    .footer {
      margin-top: 30px;
      font-size: 14px;
      color: #555555;
      text-align: left;
    }
    .brand {
      font-weight: bold;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      Hello ${exUser[0].name.charAt(0).toUpperCase() + exUser[0].name.slice(1).toLowerCase()},
    </div>

    <div class="content">
      <p>🔑 Your OTP code is:</p>

      <div class="otp-container">
        ${otp.split("").map(d => `<span class="otp-box">${d}</span>`).join("")}
      </div>

      <p class="warning">⏰ This OTP is valid for 5 minutes only.</p>
    </div>

    <div class="footer">
      Best regards,<br>
      <span class="brand">The FARMER Team</span>
    </div>
  </div>
</body>
</html>
`;
            await sendEmail(email, credentialMessage, "OTP");
            return {
                status: true,
                message: "OTP sent to email!",
            };

        } catch (error) {
            throw error;
        }
    },

    validateOTP: async (email, enteredOTP, newPassword) => {
        try {
            const exUser = await UserRepo.getUserByEmail(email);
            if (!exUser[0]) {
                return {
                    status: false,
                    message: "User data not found!",
                };
            }
            if (exUser[0]) {
                const storedOTP = await UserRepo.getStroedOTPByEmail(exUser[0].email);

                if (!storedOTP) {
                    return {
                        status: false,
                        message: "OTP not found!",
                    };
                }
                const otpMatch = await bcrypt.compare(enteredOTP, storedOTP.otp);

                if (!otpMatch) {
                    return {
                        status: false,
                        message: "Incorrect OTP!",
                    };
                }
                if (new Date() < storedOTP.expiryTime) {
                    const hashedNewPassword = await bcrypt.hash(newPassword, 10);
                    const result = await UserRepo.changeUserPasswordByEmail(
                        exUser[0].email,
                        hashedNewPassword
                    );
                    await UserRepo.clearStoredOTP(exUser[0].email);
                    return {
                        status: true,
                        message: "Password updated successfully",
                        result,
                    };
                } else {
                    return {
                        status: false,
                        message: "Invalid OTP or expired.",
                    };
                }
            } else {
                return { status: false, message: "Invalid credentials." };
            }
        } catch (error) {
            throw error;
        }
    },

    getAllUser: async () => {
        try {
            const result = await UserRepo.getAllUser();
            if (result.length == 0) {
                return { status: false, message: "No users in database!" };
            } else {
                return {
                    status: true,
                    message: "Users data fetched successfully!",
                    data: result,
                };
            }
        } catch (error) {
            throw error;
        }
    },

    getUserById: async (id) => {
        try {
            const user = await UserRepo.getUserById(id);

            if (!user[0]) {
                return { status: false, message: "User not found!" };
            }

            return {
                status: true,
                message: "User retrieved successfully!",
                data: user,
            };
        } catch (error) {
            throw error;
        }
    },

    getUserByRoleId: async (role_id) => {
        try {
            const user = await UserRepo.getUserByRoleId(role_id);

            if (!user[0]) {
                return { status: false, message: "User not found!" };
            }

            return {
                status: true,
                message: "User retrieved successfully!",
                data: user,
            };
        } catch (error) {
            throw error;
        }
    },

    deleteUserById: async (id) => {
        try {
            const user = await UserRepo.getUserById(id);

            if (!user[0]) {
                return { status: false, message: "User not found!" };
            }

            const result = await UserRepo.deleteUserById(id);
            if (result == 1) {
                return { status: true, message: "User deleted successfully!" };
            } else {
                return { status: false, message: "Error when deleting user!" };
            }
        } catch (error) {
            throw error;
        }
    },

    getUserByEmail: async (email) => {
        try {
            // Check for existing email
            const extUser = await UserRepo.getUserByEmail(email);
            if (extUser[0]) {
                return {
                    status: true,
                    message: "Already Email is used!",
                };
            } else {
                return {
                    status: false,
                };
            }
        } catch (error) {
            throw error;
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
            const user = await UserRepo.getUserById(id);

            if (!user[0]) {
                return { status: false, message: "User not found!" };
            }
            const result = await UserRepo.updateUserById(
                id,
                name,
                email,
                phone,
                address,
            );
            return {
                status: true,
                message: "Student updated successfully!",
                data: result,
            };
        } catch (error) {
            throw error;
        }
    },

    verifyUserById: async (id, status) => {
        try {
            const user = await UserRepo.getUserById(id);

            if (!user[0]) {
                return { status: false, message: "User not found!" };
            }

            const result = await UserRepo.verifyUserById(id, status);
            if (result == 1) {
                if (user[0].isVerified == false) {
                    const accountVerifyMessage = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Account Verified</title>
</head>
<body style="margin:0; padding:0; font-family: Arial, sans-serif; background-color:#f6f6f6;">

  <div style="max-width:600px; margin:40px auto; background-color:#ffffff; padding:30px; border-radius:10px; box-shadow:0 4px 15px rgba(0,0,0,0.1);">
    
    <!-- Header -->
    <div style="font-size:18px; font-weight:bold; margin-bottom:20px;">
      Hello ${user[0].name.charAt(0).toUpperCase() + user[0].name.slice(1).toLowerCase()},
    </div>

    <!-- Content -->
    <div style="font-size:16px; color:#333333; line-height:1.6;">
      
      <p style="margin:0 0 10px 0;">✅ Your account has been successfully verified!</p>
      
      <p style="margin:0 0 10px 0;">
        You can now receive daily reports via email.
      </p>

      <p style="margin:0 0 10px 0;">
        Thank you for registering with <strong>FARMER</strong>.
      </p>

      <!-- CTA Button -->
      <div style="margin-top:20px;">
      </div>

    </div>

    <!-- Footer -->
    <div style="margin-top:30px; font-size:14px; color:#555555;">
      Best regards,<br>
      <span style="font-weight:bold;">The FARMER Team</span>
    </div>

  </div>

</body>
</html>
`;
                    await sendEmail(user[0].email, accountVerifyMessage, "Account Verified");
                }
                return {
                    status: true,
                    message: "User verification status updated successfully!",
                };
            } else {
                return {
                    status: false,
                    message: "Error when updating user verification status!",
                };
            }
        } catch (error) {
            throw error;
        }
    },

    activateUserById: async (id, status) => {
        try {
            const user = await UserRepo.getUserById(id);

            if (!user[0]) {
                return { status: false, message: "User not found!" };
            }

            const result = await UserRepo.activateUserById(id, status);
            if (result == 1) {
                return {
                    status: true,
                    message: "User activation status updated successfully!",
                };
            } else {
                return {
                    status: false,
                    message: "Error when updating user activation status!",
                };
            }
        } catch (error) {
            throw error;
        }
    },

};

export default UserService;