/**
 * 汎用日付フォーマット関数
 */

import { format, parse } from "date-fns";
import { handleDateParseError } from "./error-handler";
import { DATE_FORMAT, DATETIME_FORMAT } from "./constants";

/**
 * 日付を指定フォーマットの文字列に変換する
 * @param date 日付（Dateオブジェクトまたは文字列）
 * @param toFormat フォーマット形式（デフォルト: "yyyy/MM/dd"）
 * @returns フォーマットされた日付文字列
 * @throws DateParseError 無効な日付の場合
 */
export function convertDateString(
  date: Date | string,
  toFormat: string = DATE_FORMAT
): string {
  if (typeof date === "string") {
    const parsedDate = new Date(date);
    if (isNaN(parsedDate.getTime())) {
      handleDateParseError(date, "formatter");
    }
    return format(parsedDate, toFormat);
  }
  return format(date, toFormat);
}

/**
 * 日時を指定フォーマットの文字列に変換する
 * @param date 日付オブジェクト
 * @param format フォーマット形式（デフォルト: "yyyy/MM/dd HH:mm"）
 * @returns フォーマットされた日時文字列
 * @throws DateParseError 無効な日付の場合
 */
export function convertDateTimeString(
  date: Date,
  format: string = DATETIME_FORMAT
): string {
  return convertDateString(date, format);
}

/**
 * 入力フォーム用の日付フォーマット（yyyy/MM/dd）
 * convertDateString(date, "yyyy/MM/dd")のエイリアス
 * @param date 日付オブジェクト
 * @returns フォーマットされた日付文字列
 * @throws DateParseError 無効な日付の場合
 */
export function buildDateInputFormFormat(date: Date): string {
  return convertDateString(date, DATE_FORMAT);
}

