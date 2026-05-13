import { Op } from "sequelize";
import sendEmail from "../config/sendEmail.js";
import Role from "../models/role.model.js";
import User from "../models/user.model.js";

const DAILY_REPORT_SUBJECT = "Daily Market Report";

const buildReportMessage = (name) => {
	const safeName = name ? String(name).trim() : "Customer";

	return `
		<div style="font-family: Arial, sans-serif; color: #222; line-height: 1.5;">
			<p>Dear ${safeName},</p>
			<p>Please find the daily report attached to this email.</p>
			<p>Best regards,<br/>FARMER Team</p>
		</div>
	`;
};

const DailyEmailService = {
	sendCustomerReport: async ({ fileBuffer, fileName, subject }) => {
		const customerRoles = await Role.findAll({
			where: {
				position: {
					[Op.like]: "%customer%",
				},
			},
			attributes: ["id"],
		});

		const customerRoleIds = customerRoles.map((role) => role.id);
		if (customerRoleIds.length === 0) {
			return {
				totalCustomers: 0,
				sentCount: 0,
				failedCount: 0,
				failures: [],
			};
		}

		const customers = await User.findAll({
			where: {
				isActive: true,
				isVerified: true,
				role_id: {
					[Op.in]: customerRoleIds,
				},
			},
		});

		if (!customers || customers.length === 0) {
			return {
				totalCustomers: 0,
				sentCount: 0,
				failedCount: 0,
				failures: [],
			};
		}

		const recipients = customers.filter((customer) => {
			const email = String(customer?.email ?? "").trim();
			return Boolean(email);
		});

		const sendJobs = recipients.map(async (customer) => {
			const to = String(customer.email).trim();

			try {
				await sendEmail(to, buildReportMessage(customer?.name), subject || DAILY_REPORT_SUBJECT, {
					attachments: [
						{
							filename: fileName,
							content: fileBuffer,
							contentType: "application/pdf",
						},
					],
				});

				return {
					status: "fulfilled",
					email: to,
				};
			} catch (error) {
				return {
					status: "rejected",
					email: to,
					error: error?.message || "Email sending failed",
				};
			}
		});

		const settled = await Promise.all(sendJobs);
		const failures = settled.filter((job) => job.status === "rejected");

		return {
			totalCustomers: recipients.length,
			sentCount: settled.length - failures.length,
			failedCount: failures.length,
			failures,
		};
	},
};

export default DailyEmailService;
