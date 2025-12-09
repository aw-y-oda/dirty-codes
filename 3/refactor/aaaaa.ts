type FruitLot = {
  name: string;
  quantity: number;
  isRotten: (date: Date) => boolean;
  isNeedToDeliver: boolean;
  isNeedToOrder: boolean;
  isNeedToDiscard: boolean;
};

type AppleLot = FruitLot & { name: "apple" };
type OrangeLot = FruitLot & { name: "orange" };
type GrapeLot = FruitLot & { name: "grape" };

type Order = {
  apple: AppleLot;
  orange: OrangeLot;
  grape: GrapeLot;
};

type ProcessOrderRequest = {
  order: Order;
  currentDate: Date;
};

type ProcessOrderResponse = {
  order: Order;
};

const addDays = (date: Date, days: number): Date => {
  const result = new Date(date.getTime());
  result.setDate(result.getDate() + days);
  return result;
};

function processOrder(order: Order, currentDate: Date): Order {
  const { apple, orange, grape } = order;

  const isAnyRotten =
    apple.isRotten(currentDate) ||
    orange.isRotten(currentDate) ||
    grape.isRotten(currentDate);

  // いずれかが腐っている場合
  if (isAnyRotten) {
    return {
      apple: {
        ...apple,
        isNeedToOrder: true,
        isNeedToDeliver: false,
        isNeedToDiscard: false,
      },
      orange: {
        ...orange,
        isNeedToOrder: true,
        isNeedToDeliver: false,
        isNeedToDiscard: false,
      },
      grape: {
        ...grape,
        isNeedToOrder: true,
        isNeedToDeliver: false,
        isNeedToDiscard: false,
      },
    };
  }

  const in1Week = addDays(currentDate, 7);
  const in2Weeks = addDays(currentDate, 14);
  const in3Weeks = addDays(currentDate, 21);

  const totalQuantity = apple.quantity + orange.quantity + grape.quantity;

  const MINIMUM_STOCK_LEVEL = 6;
  const isStockSufficient = totalQuantity >= MINIMUM_STOCK_LEVEL;

  const appleRottenIn3Weeks = apple.isRotten(in3Weeks);
  const orangeRottenIn3Weeks = orange.isRotten(in3Weeks);
  const grapeRottenIn3Weeks = grape.isRotten(in3Weeks);
  const grapeAndOrangeRottenIn3Weeks =
    grapeRottenIn3Weeks && orangeRottenIn3Weeks;

  // 在庫がある場合
  if (isStockSufficient) {
    return {
      apple: {
        ...apple,
        isNeedToOrder: grapeAndOrangeRottenIn3Weeks,
        isNeedToDeliver: true,
        isNeedToDiscard: false,
      },
      orange: {
        ...orange,
        isNeedToOrder: grapeAndOrangeRottenIn3Weeks,
        isNeedToDeliver: true,
        isNeedToDiscard: false,
      },
      grape: {
        ...grape,
        isNeedToOrder: grapeAndOrangeRottenIn3Weeks,
        isNeedToDeliver: true,
        isNeedToDiscard: false,
      },
    };
  }
  // 在庫が不足している場合

  const appleRottenIn2Weeks = apple.isRotten(in2Weeks);
  const grapeRottenIn1Week = grape.isRotten(in1Week);

  const shouldOrderApple = grapeAndOrangeRottenIn3Weeks;
  const shouldOrderGrape = grapeAndOrangeRottenIn3Weeks;
  const shouldOrderOrange =
    shouldOrderApple ||
    (!appleRottenIn3Weeks &&
      !grapeRottenIn3Weeks &&
      !appleRottenIn2Weeks &&
      orangeRottenIn3Weeks);

  const shouldDeliverApple =
    grapeAndOrangeRottenIn3Weeks ||
    (!appleRottenIn3Weeks && !orangeRottenIn3Weeks && !appleRottenIn2Weeks);
  const shouldDeliverOrange =
    !appleRottenIn3Weeks &&
    !grapeRottenIn3Weeks &&
    !orangeRottenIn3Weeks &&
    appleRottenIn2Weeks;
  const shouldDeliverGrape =
    (appleRottenIn3Weeks && orangeRottenIn3Weeks) ||
    (!appleRottenIn3Weeks && !orangeRottenIn3Weeks && appleRottenIn2Weeks);

  const shouldDiscardApple =
    (appleRottenIn3Weeks && orangeRottenIn3Weeks) ||
    grapeAndOrangeRottenIn3Weeks;
  const shouldDiscardOrange = appleRottenIn3Weeks && orangeRottenIn3Weeks;
  const shouldDiscardGrape =
    !appleRottenIn3Weeks &&
    !orangeRottenIn3Weeks &&
    !appleRottenIn2Weeks &&
    grapeRottenIn1Week;

  return {
    apple: {
      ...apple,
      isNeedToOrder: shouldOrderApple,
      isNeedToDeliver: shouldDeliverApple,
      isNeedToDiscard: shouldDiscardApple,
    },
    orange: {
      ...orange,
      isNeedToOrder: shouldOrderOrange,
      isNeedToDeliver: shouldDeliverOrange,
      isNeedToDiscard: shouldDiscardOrange,
    },
    grape: {
      ...grape,
      isNeedToOrder: shouldOrderGrape,
      isNeedToDeliver: shouldDeliverGrape,
      isNeedToDiscard: shouldDiscardGrape,
    },
  };
}

// エントリーポイント
function executeProcessOrder(
  request: ProcessOrderRequest
): ProcessOrderResponse {
  const processedOrder = processOrder(request.order, request.currentDate);
  return { order: processedOrder };
}

export { executeProcessOrder };
