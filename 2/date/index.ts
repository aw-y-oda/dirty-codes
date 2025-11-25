/**
 * 日付関連ユーティリティ関数のエクスポート集約、多分いらないけど作っておく
 * barrel exportパターン：複数のモジュールを集約する目的、目次としても使える
 */

// 定数
export {
  AWS_DATETIME_FORMAT,
  AWS_DATETIME_FORMAT_TRUNCATED,
  JST_TIMEZONE,
  DATE_FORMAT,
  DATETIME_FORMAT,
} from "./constants";

// 汎用フォーマット
export {
  convertDateString,
  convertDateTimeString,
  buildDateInputFormFormat,
} from "./formatter";

// AWS DateTime関連（特定インフラ依存）
export {
  convertAWSDateTimeString,
  nowAWSDateTimeString,
  dateStringToAWSDateTimeString,
  addDayFromDateString,
  getDaysAgoDate,
  getOneWeekAgoDate,
} from "./aws-datetime";

// タイムゾーン変換
export {
  formatAsUtc,
  formatJstStringFrom,
  calculateStartOfDayInJpn,
} from "./timezone";

// 日付計算・比較
export { calculateDaysDifference } from "./calculation";

// 型変換
export { toISO8601String, parseDateSafe } from "./converter";

// エラーハンドリング（必要に応じてエクスポート）
export {
  DateParseError,
  handleDateParseError,
} from "./error-handler";

