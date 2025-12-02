/*

次の条件を満たすコードを書いてください。
----------
パラメータの仕入れ商品の状態によって、以下の操作をします。
・1.いずれかが現在腐っている場合、納品をせずその商品を仕入れ指示状態にする
・2.どれも腐っておらず、6個以上の場合、すべて納品指示状態にする


・3.りんごとみかんが3週間後腐る場合、それぞれを破棄指示状態にし、それ以外を納品指示状態にする
・4.ぶどうとみかんが3週間後腐る場合、それぞれを仕入れ指示状態にし、それ以外を破棄指示状態にする
・5.りんごが2週間後腐る場合、それ以外を納品指示状態にする
・6.みかんが3週間後腐る場合、みかんの仕入れ指示状態にする
・7.ぶどうが1週間後腐る場合、ぶどうの破棄指示状態にする
----------

観点：変にまとめず、愚直に更新していく

*/

type Fruits = {
  name: string;
  num: number;
  isRotten: (date: Date) => boolean;
  isNeedToDeliver: boolean; // 納品
  isNeedToOrder: boolean; // 仕入れ
  isNeedToDiscard: boolean; // 破棄
}

type Apple = Fruits & { name: 'apple'; }
type Orange = Fruits & { name: 'orange'; }
type Grape = Fruits & { name: 'grape'; }

/**
 * 各果物とその個数、現在日時を受け取り、上記条件を満たすよう指示を更新する
 * @param apple 
 * @param orange 
 * @param grape 
 * @param currentDate 
 */
function processOrder(apple: Apple, orange: Orange, grape: Grape, currentDate: Date): void {

  initFruitsStatus(apple, orange, grape)

  const appleRottenDate = new Date(currentDate);
  appleRottenDate.setDate(new Date(currentDate).getDate() + 14);
  const orangeRottenDate = new Date(currentDate);
  orangeRottenDate.setDate(orangeRottenDate.getDate() + 21);
  const grapeRottenDate = new Date(currentDate);
  grapeRottenDate.setDate(grapeRottenDate.getDate() + 7);

  const isAnyRotten = apple.isRotten(currentDate) || orange.isRotten(currentDate) || grape.isRotten(currentDate);

  //1.いずれかが現在腐っている場合、納品をせずその商品を仕入れ指示状態にする
  if (isAnyRotten) {
    apple.isNeedToOrder = apple.isNeedToOrder || true;
    orange.isNeedToOrder = orange.isNeedToOrder || true;
    grape.isNeedToOrder = grape.isNeedToOrder || true;
  }

 //2.どれも腐っておらず、6個以上の場合、すべて納品指示状態にする
  const totalNum = apple.num + orange.num + grape.num;
  if (!isAnyRotten && totalNum >= 6) {
    apple.isNeedToDeliver = apple.isNeedToDeliver || true;
    orange.isNeedToDeliver = orange.isNeedToDeliver || true;
    grape.isNeedToDeliver = grape.isNeedToDeliver || true;
  }

  const appleRottenIn3Weeks = apple.isRotten(orangeRottenDate);
  const orangeRottenIn3Weeks = orange.isRotten(orangeRottenDate);
  const grapeRottenIn3Weeks = grape.isRotten(orangeRottenDate);
  const appleRottenIn2Weeks = apple.isRotten(appleRottenDate);
  const grapeRottenIn1Week = grape.isRotten(grapeRottenDate);

  //3.りんごとみかんが3週間後腐る場合、それぞれを破棄指示状態にし、それ以外を納品指示状態にする
  if (appleRottenIn3Weeks && orangeRottenIn3Weeks) {
    apple.isNeedToDiscard = apple.isNeedToDiscard || true;
    orange.isNeedToDiscard = orange.isNeedToDiscard || true;
    grape.isNeedToDeliver = grape.isNeedToDeliver || true;
  }

  //4.ぶどうとみかんが3週間後腐る場合、それぞれを仕入れ指示状態にし、それ以外を破棄指示状態にする
  if (grapeRottenIn3Weeks && orangeRottenIn3Weeks) {
    grape.isNeedToOrder = grape.isNeedToOrder || true;
    orange.isNeedToOrder = orange.isNeedToOrder || true;
    apple.isNeedToDiscard = apple.isNeedToDiscard || true;
  }

  //5.りんごが2週間後腐る場合、それ以外を納品指示状態にする
  if (appleRottenIn2Weeks) {
    grape.isNeedToDeliver = grape.isNeedToDeliver || true;
    orange.isNeedToDeliver = orange.isNeedToDeliver || true;
  }

  //6.みかんが3週間後腐る場合、みかんの仕入れ指示状態にする
  if (orangeRottenIn3Weeks) {
    orange.isNeedToOrder = orange.isNeedToOrder || true;
  }

  //7.ぶどうが1週間後腐る場合、ぶどうの破棄指示状態にする
  if (grapeRottenIn1Week) {
    grape.isNeedToDiscard = grape.isNeedToDiscard || true;
  }
}

/**
 * 各果物をどの指示もされていない状態に初期化する
 * @param apple 
 * @param orange 
 * @param grape 
 */
function initFruitsStatus(apple: Apple, orange: Orange, grape: Grape) {
  apple.isNeedToDeliver = false;
  apple.isNeedToOrder = false;
  apple.isNeedToDiscard = false;

  orange.isNeedToDeliver = false;
  orange.isNeedToOrder = false;
  orange.isNeedToDiscard = false;

  grape.isNeedToDeliver = false;
  grape.isNeedToOrder = false;
  grape.isNeedToDiscard = false;
}
