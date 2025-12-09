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

const MINIMUM_STOCK_LEVEL = 6;

const addDays = (date: Date, days: number): Date => {
  const result = new Date(date.getTime());
  result.setDate(result.getDate() + days);
  return result;
};

const getTotalQuantity = (order: Order): number => {
  return order.apple.quantity + order.orange.quantity + order.grape.quantity;
};

const hasAnyRotten = (order: Order, date: Date): boolean => {
  return (
    order.apple.isRotten(date) ||
    order.orange.isRotten(date) ||
    order.grape.isRotten(date)
  );
};

const processWhenAnyRotten = (order: Order): Order => {
  return {
    apple: {
      ...order.apple,
      isNeedToOrder: true,
      isNeedToDeliver: false,
      isNeedToDiscard: false,
    },
    orange: {
      ...order.orange,
      isNeedToOrder: true,
      isNeedToDeliver: false,
      isNeedToDiscard: false,
    },
    grape: {
      ...order.grape,
      isNeedToOrder: true,
      isNeedToDeliver: false,
      isNeedToDiscard: false,
    },
  };
};

const processWhenSufficientStock = (order: Order, currentDate: Date): Order => {
  const in3Weeks = addDays(currentDate, 21);
  const grapeRottenIn3Weeks = order.grape.isRotten(in3Weeks);
  const orangeRottenIn3Weeks = order.orange.isRotten(in3Weeks);
  const needToOrder = grapeRottenIn3Weeks && orangeRottenIn3Weeks;

  return {
    apple: {
      ...order.apple,
      isNeedToOrder: needToOrder,
      isNeedToDeliver: true,
      isNeedToDiscard: false,
    },
    orange: {
      ...order.orange,
      isNeedToOrder: needToOrder,
      isNeedToDeliver: true,
      isNeedToDiscard: false,
    },
    grape: {
      ...order.grape,
      isNeedToOrder: needToOrder,
      isNeedToDeliver: true,
      isNeedToDiscard: false,
    },
  };
};

const processWhenInsufficientStock = (
  order: Order,
  currentDate: Date
): Order => {
  const in1Week = addDays(currentDate, 7);
  const in2Weeks = addDays(currentDate, 14);
  const in3Weeks = addDays(currentDate, 21);

  const appleRottenIn3Weeks = order.apple.isRotten(in3Weeks);
  const orangeRottenIn3Weeks = order.orange.isRotten(in3Weeks);
  const grapeRottenIn3Weeks = order.grape.isRotten(in3Weeks);
  const appleRottenIn2Weeks = order.apple.isRotten(in2Weeks);
  const grapeRottenIn1Week = order.grape.isRotten(in1Week);
  const grapeAndOrangeRottenIn3Weeks =
    grapeRottenIn3Weeks && orangeRottenIn3Weeks;

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
      ...order.apple,
      isNeedToOrder: shouldOrderApple,
      isNeedToDeliver: shouldDeliverApple,
      isNeedToDiscard: shouldDiscardApple,
    },
    orange: {
      ...order.orange,
      isNeedToOrder: shouldOrderOrange,
      isNeedToDeliver: shouldDeliverOrange,
      isNeedToDiscard: shouldDiscardOrange,
    },
    grape: {
      ...order.grape,
      isNeedToOrder: shouldOrderGrape,
      isNeedToDeliver: shouldDeliverGrape,
      isNeedToDiscard: shouldDiscardGrape,
    },
  };
};

const processOrder = (order: Order, currentDate: Date): Order => {
  if (hasAnyRotten(order, currentDate)) {
    return processWhenAnyRotten(order);
  }

  const isStockSufficient = getTotalQuantity(order) >= MINIMUM_STOCK_LEVEL;
  if (isStockSufficient) {
    return processWhenSufficientStock(order, currentDate);
  }
  return processWhenInsufficientStock(order, currentDate);
};

type FruitLotInput = {
  name: string;
  quantity: number;
  isRotten: (date: Date) => boolean;
  isNeedToDeliver: boolean;
  isNeedToOrder: boolean;
  isNeedToDiscard: boolean;
};

type AppleLotInput = FruitLotInput & { name: "apple" };
type OrangeLotInput = FruitLotInput & { name: "orange" };
type GrapeLotInput = FruitLotInput & { name: "grape" };

type OrderInput = {
  apple: AppleLotInput;
  orange: OrangeLotInput;
  grape: GrapeLotInput;
};

type ProcessOrderRequest = {
  order: OrderInput;
  currentDate: Date;
};

type FruitLotOutput = {
  name: string;
  quantity: number;
  isRotten: (date: Date) => boolean;
  isNeedToDeliver: boolean;
  isNeedToOrder: boolean;
  isNeedToDiscard: boolean;
};

type OrderOutput = {
  apple: FruitLotOutput;
  orange: FruitLotOutput;
  grape: FruitLotOutput;
};

type ProcessOrderResponse = {
  order: OrderOutput;
};

function executeProcessOrder(
  request: ProcessOrderRequest
): ProcessOrderResponse {
  const result = processOrder(request.order, request.currentDate);

  return { order: result };
}

export { executeProcessOrder };
export type { ProcessOrderRequest, ProcessOrderResponse };
