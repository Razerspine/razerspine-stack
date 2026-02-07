export default class ConsoleLogger {
  private readonly styleBase = 'background: #0b1220; padding: 6px 10px; border-radius: 6px; font-size: 12px; font-weight: 500;';

  /**
   * Log an informational message
   * @param message - Message to log
   */
  public info(message: string): void {
    this._log(`ℹ️ ${message}`, 'color: #60a5fa;');
  }

  /**
   * Log a success message
   * @param message - Message to log
   */
  public success(message: string): void {
    this._log(`✅ ${message}`, 'color: #34d399;');
  }

  /**
   * Log a warning message
   * @param message - Message to log
   */
  public warning(message: string): void {
    this._log(`⚠️ ${message}`, 'color: #facc15;');
  }

  /**
   * Log an error message
   * @param message - Message to log
   */
  public error(message: string): void {
    this._log(`❌ ${message}`, 'color: #f87171;');
  }

  /**
   * Internal helper to print styled message to console
   */
  private _log(text: string, colorStyle: string): void {
    try {
      if (typeof console === 'undefined' || typeof console.log !== 'function') return;
      console.log(`%c${text}`, `${colorStyle} ${this.styleBase}`);
    } catch {
      // ignore logging errors in restricted environments
    }
  }
}
