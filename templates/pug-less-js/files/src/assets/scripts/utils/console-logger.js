/**
 * Simple console logger with styled output for success, warning, error and info.
 * Can be replaced with any logger that exposes the same methods.
 */
export default class ConsoleLogger {
  /**
   * Log an informational message
   * @param {string} message - Message to log
   */
  info(message) {
    console.log(
      `%cℹ️ ${message}`,
      "color: #60a5fa; background: #0b1220; padding: 6px 10px; border-radius: 6px; font-size: 12px; font-weight: 500;"
    );
  }

  /**
   * Log a success message
   * @param {string} message - Message to log
   */
  success(message) {
    console.log(
      `%c✅ ${message}`,
      "color: #34d399; background: #0b1220; padding: 6px 10px; border-radius: 6px; font-size: 12px; font-weight: 500;"
    );
  }

  /**
   * Log a warning message
   * @param {string} message - Message to log
   */
  warning(message) {
    console.log(
      `%c⚠️ ${message}`,
      "color: #facc15; background: #0b1220; padding: 6px 10px; border-radius: 6px; font-size: 12px; font-weight: 500;"
    );
  }

  /**
   * Log an error message
   * @param {string} message - Message to log
   */
  error(message) {
    console.log(
      `%c❌ ${message}`,
      "color: #f87171; background: #0b1220; padding: 6px 10px; border-radius: 6px; font-size: 12px; font-weight: 500;"
    );
  }
}
