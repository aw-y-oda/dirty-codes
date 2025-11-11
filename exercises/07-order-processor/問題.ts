/**
 * 以下のコードはECサイトの注文処理システムの一部です。
 * このコードには複数の問題があります。リファクタリングしてください。
 */

interface Product {
  id: string;
  name: string;
  price: number;
  stock: number;
  category: string;
}

interface User {
  id: string;
  name: string;
  email: string;
  isPremium: boolean;
  address?: string;
}

interface OrderItem {
  productId: string;
  quantity: number;
}

class OrderProcessor {
  processOrder(user: User, items: OrderItem[], products: Product[]): string {
    if (user) {
      if (user.email) {
        if (items && items.length > 0) {
          let total = 0;
          let allAvailable = true;

          for (let i = 0; i < items.length; i++) {
            const item = items[i];
            const product = products.find((p) => p.id === item.productId);

            if (product) {
              if (product.stock >= item.quantity) {
                if (product.price > 0) {
                  total += product.price * item.quantity;
                } else {
                  return `商品「${product.name}」の価格が不正です`;
                }
              } else {
                allAvailable = false;
                return `商品「${product.name}」の在庫が不足しています`;
              }
            } else {
              return `商品ID「${item.productId}」が見つかりません`;
            }
          }

          if (allAvailable) {
            if (total > 0) {
              if (user.isPremium) {
                total = total * 0.9;
              }

              if (total >= 10000) {
                total = total * 0.95;
              }

              if (user.address) {
                return `注文が完了しました。合計金額: ${total}円`;
              } else {
                return "配送先住所が登録されていません";
              }
            } else {
              return "合計金額が0円です";
            }
          } else {
            return "在庫不足の商品があります";
          }
        } else {
          return "注文商品が指定されていません";
        }
      } else {
        return "メールアドレスが登録されていません";
      }
    } else {
      return "ユーザー情報が見つかりません";
    }
  }
}
