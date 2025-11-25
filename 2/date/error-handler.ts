/**
 * 日付関連のエラーハンドリング共通化
 */

export class DateParseError extends Error {
  constructor(message: string, public readonly invalidValue: string) {
    super(message);
    this.name = "DateParseError";
  }
}

/**
 * 日付のパースエラーを統一して処理する
 * @param value 無効な日付値
 * @param context エラー発生のコンテキスト（関数名など）
 * @throws DateParseError
 */
export function handleDateParseError(value: string, context: string = "date"): never {
  throw new DateParseError(
    `[${context}] 「${value}」は、無効な日付指定です。`,
    value
  );
}

/**
 * 日付操作のエラーを安全に処理する
 * @param operation 実行する日付操作
 * @param fallback エラー時のフォールバック値
 * @returns 操作結果またはフォールバック値
 */
export function safeDateOperation<T>(
  operation: () => T,
  fallback: T
): T {
  try {
    return operation();
  } catch (e) {
    console.error(e);
    return fallback;
  }
}

