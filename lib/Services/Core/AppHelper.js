const CryptoJS = require("crypto-js");

class AppHelper {

	/**
	 *
	 * @param cipherText
	 * @param hashSecret
	 * @returns {Promise<*>}
	 */
	static decrypt(cipherText, hashSecret = process.env.HASH_SECRET) {
		if (cipherText === undefined) return cipherText;
		let bytes = CryptoJS.AES.decrypt(cipherText.toString(), hashSecret);
		return bytes.toString(CryptoJS.enc.Utf8);
	}

	/**
	 *
	 * @param sendStatus
	 * @returns {Promise<{maxAttemptMailIds: Array, successMailIds: Array, successCount: number, error: null, errorMailIds: Array}>}
	 */
	static getStats(sendStatus) {
		const statistics = {
			successCount: 0,
			error: null,
			errorMailIds: [],
			successMailIds: [],
			maxAttemptMailIds: []
		};
		sendStatus.map((mailMessage) => {
			statistics.successCount += mailMessage.status ? 1 : 0;
			if (!!mailMessage.error) {
				statistics.error = mailMessage.error;
			}
			if (!mailMessage.status) {
				statistics.errorMailIds.push(mailMessage._id);
			}
			if (mailMessage.status) {
				statistics.successMailIds.push(mailMessage._id);
			}
			if (mailMessage.attempts > 5) {
				statistics.maxAttemptMailIds.push(mailMessage._id);
			}
		});
		return statistics;
	}

}

module.exports = AppHelper;