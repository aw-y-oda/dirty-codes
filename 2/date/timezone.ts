/**
 * タイムゾーン変換関連の関数（JST/UTC）
 */

import { format, parseISO, addMinutes, isValid, startOfDay } from "date-fns";
import { toZonedTime, fromZonedTime } from "date-fns-tz";
import { JST_TIMEZONE, DATE_FORMAT, DATETIME_FORMAT } from "./constants";

/**
 * 日付(ISO 8601)をUTCとして扱ってフォーマットする
 * @param target ISO 8601形式の日付文字列
 * @param toFormat フォーマット形式（デフォルト: "yyyy/MM/dd"）
 * @returns UTCの日付文字列、無効な日付の場合は空文字列
 */
export function formatAsUtc(target: string, toFormat: string = DATE_FORMAT): string {
  const date = parseISO(target);
  if (!isValid(date)) {
    return "";
  }
  // UTCの日付に調整する
  return format(addMinutes(date, date.getTimezoneOffset()), toFormat);
}

/**
 * 日時情報をJSTでフォーマットする
 * @param target 日付文字列(timestamptz型) | unix timestamp | Date
 * @param toFormat フォーマット形式（デフォルト: "yyyy/MM/dd HH:mm"）
 * @returns JSTでフォーマットされた文字列
 */
export function formatJstStringFrom(
  target: string | number | Date,
  toFormat: string = DATETIME_FORMAT
): string {
  return format(toZonedTime(target, JST_TIMEZONE), toFormat);
}

/**
 * 日本時間の1日の開始時刻（00:00:00）を計算する
 * @param datetime 日時オブジェクト
 * @returns 日本時間の1日の開始時刻、nullの場合はnullを返す
 */
export function calculateStartOfDayInJpn(datetime: Date | null): Date | null {
  if (!datetime) {
    return null;
  }

  const jst = toZonedTime(datetime, JST_TIMEZONE);
  const jstStartOfDay = startOfDay(jst);
  return fromZonedTime(jstStartOfDay, JST_TIMEZONE);
}

