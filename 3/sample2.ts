/*

次の条件を満たすコードを書いてください。
----------
パラメータの仕入れ商品の状態によって、以下の操作をします。
1. いずれかが現在腐っている場合、納品をせずその商品を仕入れ指示状態にする
2. どれも腐っておらず、6個以上の場合、すべて納品指示状態にする
3. りんごとみかんが3週間後腐る場合、それぞれを破棄状態にし、それ以外を納品指示状態にする
4. ぶどうとみかんが3週間後腐る場合、それぞれを仕入れ指示状態にし、それ以外を破棄指示状態にする
5. りんごが2週間後腐る場合、それ以外を納品指示状態にする
6. みかんが3週間後腐る場合、みかんの仕入れ指示状態にする
7. ぶどうが1週間後腐る場合、ぶどうの破棄指示状態にする
----------

*/

import { addWeeks } from "./date";

type Fruits = {
  name: string;
  num: number;
  isRotten: (date: Date) => boolean;
  isNeedToDeliver: boolean; // 本来パラメータの値を上書きするべきではない
  isNeedToOrder: boolean; // 本来パラメータの値を上書きするべきではない
  isNeedToDiscard: boolean; // 本来パラメータの値を上書きするべきではない
};

type Apple = Fruits & { name: "apple" };
type Orange = Fruits & { name: "orange" };
type Grape = Fruits & { name: "grape" };

type Stock = { apple: Apple; orange: Orange; grape: Grape };
type Process<Context = {}> = (stock: Stock, context: Context) => Stock;

// 1. いずれかが現在腐っている場合、納品をせずその商品を仕入れ指示状態にする
const process1: Process<{ currentDate: Date }> = (
  { apple, orange, grape },
  { currentDate }
) => {
  const isAppleRotten = apple.isRotten(currentDate);
  const isOrangeRotten = orange.isRotten(currentDate);
  const isGrapeRotten = grape.isRotten(currentDate);

  return {
    apple: {
      ...apple,
      ...(isAppleRotten ? { isNeedToOrder: true, isNeedToDeliver: false } : {}),
    },
    orange: {
      ...orange,
      ...(isOrangeRotten
        ? { isNeedToOrder: true, isNeedToDeliver: false }
        : {}),
    },
    grape: {
      ...grape,
      ...(isGrapeRotten ? { isNeedToOrder: true, isNeedToDeliver: false } : {}),
    },
  };
};

// 2. どれも腐っておらず、6個以上の場合、すべて納品指示状態にする
const process2: Process<{ currentDate: Date }> = (
  { apple, orange, grape },
  { currentDate }
) => {
  const isAllRotten =
    apple.isRotten(currentDate) &&
    orange.isRotten(currentDate) &&
    grape.isRotten(currentDate);
  const totalNum = apple.num + orange.num + grape.num;
  const isNeedToDeliver = isAllRotten && totalNum >= 6;

  return {
    apple: {
      ...apple,
      ...(isNeedToDeliver ? { isNeedToDeliver: true } : {}),
    },
    orange: {
      ...orange,
      ...(isNeedToDeliver ? { isNeedToDeliver: true } : {}),
    },
    grape: {
      ...grape,
      ...(isNeedToDeliver ? { isNeedToDeliver: true } : {}),
    },
  };
};

// 3. りんごとみかんが3週間後腐る場合、それぞれを破棄状態にし、それ以外を納品指示状態にする
const process3: Process<{ currentDate: Date }> = (
  { apple, orange, grape },
  { currentDate }
) => {
  const after3Week = addWeeks({ date: currentDate, weeks: 3 });
  const appleAndOrangeRottenIn3Weeks =
    apple.isRotten(after3Week) && orange.isRotten(after3Week);

  return {
    apple: {
      ...apple,
      ...(appleAndOrangeRottenIn3Weeks ? { isNeedToDiscard: true } : {}),
    },
    orange: {
      ...orange,
      ...(appleAndOrangeRottenIn3Weeks ? { isNeedToDiscard: true } : {}),
    },
    grape: {
      ...grape,
      ...(appleAndOrangeRottenIn3Weeks ? { isNeedToDeliver: true } : {}),
    },
  };
};

// 4. ぶどうとみかんが3週間後腐る場合、それぞれを仕入れ指示状態にし、それ以外を破棄指示状態にする
const process4: Process<{ currentDate: Date }> = (
  { apple, orange, grape },
  { currentDate }: { currentDate: Date }
) => {
  const after3Week = addWeeks({ date: currentDate, weeks: 3 });
  const orangeAndGrapeRottenIn3Weeks =
    orange.isRotten(after3Week) && grape.isRotten(after3Week);

  return {
    apple: {
      ...apple,
      ...(orangeAndGrapeRottenIn3Weeks ? { isNeedToDiscard: true } : {}),
    },
    orange: {
      ...orange,
      ...(orangeAndGrapeRottenIn3Weeks ? { isNeedToOrder: true } : {}),
    },
    grape: {
      ...grape,
      ...(orangeAndGrapeRottenIn3Weeks ? { isNeedToOrder: true } : {}),
    },
  };
};

// 5. りんごが2週間後腐る場合、それ以外を納品指示状態にする
const process5: Process<{ currentDate: Date }> = (
  { apple, orange, grape },
  { currentDate }
) => {
  const after2Week = addWeeks({ date: currentDate, weeks: 2 });
  const appleRottenIn2Weeks = apple.isRotten(after2Week);

  return {
    apple: { ...apple },
    orange: {
      ...orange,
      ...(appleRottenIn2Weeks ? { isNeedToDeliver: true } : {}),
    },
    grape: {
      ...grape,
      ...(appleRottenIn2Weeks ? { isNeedToDeliver: true } : {}),
    },
  };
};

// 6. みかんが3週間後腐る場合、みかんの仕入れ指示状態にする
const process6: Process<{ currentDate: Date }> = (
  { apple, orange, grape },
  { currentDate }
) => {
  const after3Week = addWeeks({ date: currentDate, weeks: 3 });
  const orangeRottenIn3Weeks = orange.isRotten(after3Week);

  return {
    apple: { ...apple },
    orange: {
      ...orange,
      ...(orangeRottenIn3Weeks ? { isNeedToOrder: true } : {}),
    },
    grape: { ...grape },
  };
};

// 7. ぶどうが1週間後腐る場合、ぶどうの破棄指示状態にする
const process7: Process<{ currentDate: Date }> = (
  { apple, orange, grape },
  { currentDate }
) => {
  const after1Week = addWeeks({ date: currentDate, weeks: 1 });
  const grapeRottenIn1Weeks = grape.isRotten(after1Week);

  return {
    apple: { ...apple },
    orange: { ...orange },
    grape: {
      ...grape,
      ...(grapeRottenIn1Weeks ? { isNeedToDiscard: true } : {}),
    },
  };
};

export function processOrder(
  apple: Apple,
  orange: Orange,
  grape: Grape,
  currentDate: Date
) {
  const stock: Stock = { apple, orange, grape };
  const context = { currentDate };

  // パイプライン処理を一旦Arrayで代用
  const [result] = [stock]
    .map((s) => process1(s, context))
    .map((s) => process2(s, context))
    .map((s) => process3(s, context))
    .map((s) => process4(s, context))
    .map((s) => process5(s, context))
    .map((s) => process6(s, context))
    .map((s) => process7(s, context));

  // 既存と動作を合わせるため、コピーする
  Object.assign(apple, result.apple);
  Object.assign(orange, result.orange);
  Object.assign(grape, result.grape);
}
