import ContactRepo from "../repositories/contact.repo.js";
import sendEmail from "../config/sendEmail.js";

const ContactService = {
    contactAdd: async (name, phoneNumber,email, message) => {
        try {

            const contact = await ContactRepo.contactAdd(name, phoneNumber,email, message);

      const thankmessage = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Thank You</title>
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
    .highlight-box {
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
      Hello ${name.charAt(0).toUpperCase() + name.slice(1).toLowerCase()},
    </div>

    <div class="content">
      <p>🌱 Thanks for contacting us!</p>

      <p>
        We have received your message and will get back to you shortly.
      </p>

      <div class="highlight-box">
        ✔ Your request has been successfully received
      </div>

      <p>
        If you have any additional information or inquiries, feel free to reply to this email.
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

            await sendEmail(email, thankmessage, "Thank you for contacting us!");
            return contact;
        } catch (error) {
            return { status: false, message: error.message };
        }
    },

    getAllContact: async () => {
        try {
            const allContact = await ContactRepo.getAllContact();
            return allContact;
        } catch (error) {
            return { status: false, message: error.message };
        }
    },

    getContactById: async (id) => {
        try {
            const contact = await ContactRepo.findById(id);
            return contact;
        } catch (error) {
            return { status: false, message: error.message };
        }
    },

    deleteContactById: async (id) => {
        try {
            const deleteContact = await ContactRepo.deleteContactById(id);
            return deleteContact;
        } catch (error) {
            return { status: false, message: error.message };
        }
    },
}


export default ContactService;