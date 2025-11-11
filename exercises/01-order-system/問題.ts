/**
 * 以下のコードは注文管理システムの一部です。
 * このコードには複数の問題があります。リファクタリングしてください。
 */

interface Order {
  id: string;
  status: number;
  totalAmount: number;
  userId: string;
  createdAt: Date;
}

class OrderService {
  processOrder(order: Order): string {
    if (order.status === 0) {
      return "注文は保留中です";
    }

    if (order.status === 1) {
      return "注文を処理中です";
    }

    if (order.status === 2) {
      return "注文が完了しました";
    }

    if (order.status === 3) {
      return "注文がキャンセルされました";
    }

    if (order.status === 4) {
      return "返金処理中です";
    }

    return "不明なステータスです";
  }

  calculateDiscount(order: Order): number {
    if (order.totalAmount > 10000) {
      return order.totalAmount * 0.1;
    }

    if (order.totalAmount > 5000) {
      return order.totalAmount * 0.05;
    }

    return 0;
  }

  validateOrder(order: Order): boolean {
    if (order.totalAmount < 100) {
      return false;
    }

    if (order.totalAmount > 1000000) {
      return false;
    }

    return true;
  }
}
