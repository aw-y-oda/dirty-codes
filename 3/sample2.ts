/*
# 条件一覧
---
## ① 現在の状態に基づく処理
- **いずれかの果物が“現在すでに腐っている”場合**
  - **納品しない**
  - **腐っている果物のみ「仕入れ指示」状態にする**
---
## ② 腐っておらず在庫が6個以上の場合
- **すべての果物を「納品指示」状態にする**
---

## ③ 3週間後の腐敗予測に基づく処理

### ● りんご & みかんが 3 週間後に腐る場合
- りんご → **破棄指示**
- みかん → **破棄指示**
- それ以外（ぶどう）→ **納品指示**
---
### ● ぶどう & みかんが 3 週間後に腐る場合
- ぶどう → **仕入れ指示**
- みかん → **仕入れ指示**
- それ以外（りんご）→ **破棄指示**
---

## ④ 個別の腐敗予測による処理

### ● りんごが 2 週間後に腐る場合
- **りんご以外を「納品指示」状態にする**
---
### ● みかんが 3 週間後に腐る場合
- **みかんを「仕入れ指示」状態にする**
---
### ● ぶどうが 1 週間後に腐る場合
- **ぶどうを「破棄指示」状態にする**
*/

type Status = 'deliver' | 'order' | 'discard';

type Fruits = {
  name: string;
  num: number;
  isRotten: (args: { date: Date }) => boolean; // ★ 引数オブジェクト化済
  status: Status;
};

type Apple = Fruits & { name: 'apple' };
type Orange = Fruits & { name: 'orange' };
type Grape = Fruits & { name: 'grape' };

type ProcessOrderParams = {
  apple: Apple;
  orange: Orange;
  grape: Grape;
  currentDate: Date;
};

const ROT_DAYS = {
  apple: 14,
  orange: 21,
  grape: 7,
} as const;

// ---------- ヘルパー関数 ----------

// 日付を加算する
const addDays = ({ base, days }: { base: Date; days: number }): Date => {
  const resultDate = new Date(base);
  resultDate.setDate(resultDate.getDate() + days);
  return resultDate;
};

// 現在腐っている果物があるか判定する
const isAnyRottenNow = ({
  fruits,
  currentDate,
}: {
  fruits: Fruits[];
  currentDate: Date;
}): boolean => {
  return fruits.some((f) => f.isRotten({ date: currentDate }));
};

// x日後に腐るか判定する
const isRottenAfterDays = ({
  fruit,
  currentDate,
  days,
}: {
  fruit: Fruits;
  currentDate: Date;
  days: number;
}): boolean => {
  const future = addDays({ base: currentDate, days });
  return fruit.isRotten({ date: future });
};

// ---------- メイン処理 ----------
function processOrder(params: ProcessOrderParams): void {
  const { apple, orange, grape, currentDate } = params;

  const fruits = [apple, orange, grape];

  // 未来腐敗判定
  const isRottenAppleAfterThreeWeeks = isRottenAfterDays({
    fruit: apple,
    currentDate,
    days: 21,
  });
  const isRottenOrangeAfterThreeWeeks = isRottenAfterDays({
    fruit: orange,
    currentDate,
    days: 21,
  });
  const isRottenGrapeAfterThreeWeeks = isRottenAfterDays({
    fruit: grape,
    currentDate,
    days: 21,
  });

  const isRottenAppleAfterTwoWeeks = isRottenAfterDays({
    fruit: apple,
    currentDate,
    days: ROT_DAYS.apple,
  });
  const isRottenGrapeAfterOneWeek = isRottenAfterDays({
    fruit: grape,
    currentDate,
    days: ROT_DAYS.grape,
  });

  const totalNum = apple.num + orange.num + grape.num;

  // -----------------------------
  // 現在どれか腐っている → 腐っているものだけ order、他 discard
  // -----------------------------
  const rottenFruits = fruits.filter((f) => f.isRotten({ date: currentDate }));

  if (rottenFruits.length > 0) {
    rottenFruits.forEach((f) => (f.status = 'order'));

    fruits
      .filter((f) => !f.isRotten({ date: currentDate }))
      .forEach((f) => (f.status = 'discard'));

    return;
  }

  // -----------------------------
  // 全部無事 + 合計 6個以上 → 全部 deliver
  // -----------------------------
  if (totalNum >= 6) {
    fruits.forEach((f) => (f.status = 'deliver'));
    return;
  }

  // -----------------------------
  // apple & orange が3週間後腐る
  // -----------------------------
  if (isRottenAppleAfterThreeWeeks && isRottenOrangeAfterThreeWeeks) {
    apple.status = 'discard';
    orange.status = 'discard';
    grape.status = 'deliver';
    return;
  }

  // -----------------------------
  // grape & orange が3週間後腐る
  // -----------------------------
  if (isRottenGrapeAfterThreeWeeks && isRottenOrangeAfterThreeWeeks) {
    grape.status = 'order';
    orange.status = 'order';
    apple.status = 'discard';
    return;
  }

  // -----------------------------
  // apple が2週間後腐る
  // -----------------------------
  if (isRottenAppleAfterTwoWeeks) {
    apple.status = 'discard';
    orange.status = 'deliver';
    grape.status = 'deliver';
    return;
  }

  // -----------------------------
  // orange が3週間後腐る
  // -----------------------------
  if (isRottenGrapeAfterThreeWeeks) {
    orange.status = 'order';
    apple.status = 'deliver';
    grape.status = 'deliver';
    return;
  }

  // -----------------------------
  // grape が1週間後腐る
  // -----------------------------
  if (isRottenGrapeAfterOneWeek) {
    grape.status = 'discard';
    apple.status = 'deliver';
    orange.status = 'deliver';
    return;
  }

  // -----------------------------
  // 最終（どの条件にも当てはまらない）
  // -----------------------------
  fruits.forEach((f) => (f.status = 'deliver'));
}
