/**
 * 日付の型変換関数（Date ↔ string）
 */

/**
 * DateオブジェクトをISO 8601形式の文字列に変換する
 * @param date Dateオブジェクト
 * @returns ISO 8601形式の文字列
 */
export function toISO8601String(date: Date): string {
  return date.toISOString();
}

/**
 * 文字列をDateオブジェクトに変換する（安全版）
 * @param str 日付文字列
 * @returns Dateオブジェクト、または無効な場合はnull
 */
export function parseDateSafe(str: string): Date | null {
  const date = new Date(str);
  if (isNaN(date.getTime())) {
    return null;
  }
  return date;
}

