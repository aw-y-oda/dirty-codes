/* 
 aws関連の日付を設定したい（ここは共通関数じゃないイメージ）
*/

// フォーマットなどは定数化したい
const DATE_TIME_STRING_FOR_AWS = "yyyy-MM-dd'T'hh:mm:ss.sss'Z'";

import {
  format,
} from "date-fns";


// AWS専用階層を作成したい
export function convertAWSDateTimeString(target: Date): string {
  try {
    // 定数にしたい気持ち
    return format(target, DATE_TIME_STRING_FOR_AWS);
  } catch (e) {
    throw new Error(`「${target}」は、無効な日付です。${e}`);
    // errの時にfalseをリターンってどうなんでしょうか
    // return false
  }
}