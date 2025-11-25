/**
 * 日付計算・比較関連の関数
 */

import { differenceInCalendarDays, startOfDay } from "date-fns";

/**
 * 2つのDateの日数の差を計算する
 * @param firstDate 最初の日付
 * @param secondDate 2番目の日付（デフォルト: 現在日時）
 * @returns 日数の差（firstDate - secondDate）
 */
export function calculateDaysDifference(
  firstDate: Date,
  secondDate: Date = new Date()
): number {
  return differenceInCalendarDays(
    startOfDay(firstDate),
    startOfDay(secondDate)
  );
}

