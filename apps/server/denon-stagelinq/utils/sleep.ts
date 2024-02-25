/**
 * Sleep Utility Function
 * @param {number} p_ms //time in ms to sleep
 * @returns {Promise<void>}
 */
export function sleep(p_ms: number): Promise<void> {
	return new Promise((resolve) => setTimeout(resolve, p_ms));
}
