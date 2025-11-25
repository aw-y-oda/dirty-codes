/**
 * AWS DateTime形式関連の関数
 * 注意: このモジュールはAWS固有の形式に依存しているため、
 * アプリケーション全体レイヤーではなく、AWS関連機能のレイヤーに配置することを推奨
 */

import { format, parse, addDays, startOfDay, sub, isValid } from "date-fns";
import { handleDateParseError } from "./error-handler";
import {
  AWS_DATETIME_FORMAT,
  AWS_DATETIME_FORMAT_TRUNCATED,
  DATE_FORMAT,
} from "./constants";

/**
 * DateオブジェクトをAWS DateTime形式の文字列に変換する
 * @param target 変換対象のDateオブジェクト
 * @returns AWS DateTime形式の文字列
 */
export function convertAWSDateTimeString(target: Date): string {
  return format(target, AWS_DATETIME_FORMAT);
}

/**
 * 現在日時をAWS DateTime形式の文字列に変換する
 * @param date 日付オブジェクト（デフォルト: 現在日時）
 * @returns AWS DateTime形式の文字列
 */
export function nowAWSDateTimeString(date: Date = new Date()): string {
  return convertAWSDateTimeString(date);
}

/**
 * 日付文字列をAWS DateTime形式の文字列に変換する
 * @param from 変換元の日付文字列
 * @param isTruncateTime 時刻を00:00:00に切り詰めるか（デフォルト: true）
 * @param fromFormat 変換元のフォーマット（デフォルト: "yyyy/MM/dd"）
 * @returns AWS DateTime形式の文字列
 * @throws DateParseError 無効な日付の場合
 */
export function dateStringToAWSDateTimeString(
  from: string,
  isTruncateTime: boolean = true,
  fromFormat: string = DATE_FORMAT
): string {
  const toFormat = isTruncateTime
    ? AWS_DATETIME_FORMAT_TRUNCATED
    : AWS_DATETIME_FORMAT;
  const date = parse(from, fromFormat, new Date());
  if (!isValid(date)) {
    handleDateParseError(from, "aws-datetime");
  }
  return format(date, toFormat);
}

/**
 * 日付文字列に指定日数を加算してAWS DateTime形式の文字列に変換する
 * @param from 変換元の日付文字列
 * @param add 加算する日数
 * @param isTruncateTime 時刻を00:00:00に切り詰めるか（デフォルト: true）
 * @param fromFormat 変換元のフォーマット（デフォルト: "yyyy/MM/dd"）
 * @returns AWS DateTime形式の文字列
 * @throws DateParseError 無効な日付の場合
 */
export function addDayFromDateString(
  from: string,
  add: number,
  isTruncateTime: boolean = true,
  fromFormat: string = DATE_FORMAT
): string {
  const parsedDate = parse(from, fromFormat, new Date());
  if (!isValid(parsedDate)) {
    handleDateParseError(from, "aws-datetime");
  }
  const date = addDays(parsedDate, add);
  return dateStringToAWSDateTimeString(
    format(date, fromFormat),
    isTruncateTime,
    fromFormat
  );
}

/**
 * 指定日数前の日付をAWS DateTime形式で取得する
 * @param days 何日前か（デフォルト: 7）
 * @returns AWS DateTime形式の文字列
 */
export function getDaysAgoDate(days: number = 7): string {
  const day = startOfDay(new Date());
  return format(sub(day, { days }), AWS_DATETIME_FORMAT);
}

/**
 * 7日前の日付をAWS DateTime形式で取得する
 * getDaysAgoDate(7)のエイリアス
 * @returns AWS DateTime形式の文字列
 */
export function getOneWeekAgoDate(): string {
  return getDaysAgoDate(7);
}

