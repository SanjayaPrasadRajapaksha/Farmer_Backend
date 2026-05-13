import DailyEmailService from "../services/daily_email.service.js";

const DailyEmailController = {
	sendCustomerReport: async (req, res) => {
		try {
			const file = req.file;
			const subject = String(req.body?.subject || "").trim();

			if (!file) {
				return res.status(400).json({
					status: false,
					response_code: 400,
					message: "PDF file is required",
				});
			}

			if (file.mimetype !== "application/pdf") {
				return res.status(400).json({
					status: false,
					response_code: 400,
					message: "Only PDF files are allowed",
				});
			}

			const result = await DailyEmailService.sendCustomerReport({
				fileBuffer: file.buffer,
				fileName: file.originalname || "daily-report.pdf",
				subject,
			});

			return res.status(200).json({
				status: true,
				response_code: 200,
				message: "Daily report processed",
				result,
			});
		} catch (error) {
			console.error("Daily report email error:", error);
			return res.status(500).json({
				status: false,
				response_code: 500,
				message: error?.message || "Failed to send daily report",
			});
		}
	},
};

export default DailyEmailController;
