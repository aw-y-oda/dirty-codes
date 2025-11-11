/**
 * 以下のコードは注文処理サービスの一部です。
 * このコードには複数の問題があります。リファクタリングしてください。
 */

interface OrderRequest {
  customerId: number;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  shippingAddress: string;
  shippingPostalCode: string;
  items: Array<{
    productId: number;
    quantity: number;
    price: number;
  }>;
  paymentMethod: string;
  couponCode?: string;
}

interface OrderResponse {
  orderId: number;
  totalAmount: number;
  discountAmount: number;
  finalAmount: number;
  estimatedDeliveryDate: string;
}

class OrderService {
  async processOrder(
    request: OrderRequest
  ): Promise<OrderResponse | { error: string }> {
    if (!request.customerName || request.customerName.trim() === "") {
      return { error: "顧客名を入力してください" };
    }
    if (request.customerName.length < 2) {
      return { error: "顧客名は2文字以上で入力してください" };
    }
    if (request.customerName.length > 50) {
      return { error: "顧客名は50文字以内で入力してください" };
    }
    if (!request.customerEmail || request.customerEmail.trim() === "") {
      return { error: "メールアドレスを入力してください" };
    }
    if (!request.customerEmail.includes("@")) {
      return { error: "正しいメールアドレスを入力してください" };
    }
    if (!request.customerEmail.includes(".")) {
      return { error: "正しいメールアドレスを入力してください" };
    }
    if (!request.customerPhone || request.customerPhone.trim() === "") {
      return { error: "電話番号を入力してください" };
    }
    if (request.customerPhone.length < 10) {
      return { error: "正しい電話番号を入力してください" };
    }
    if (!request.shippingAddress || request.shippingAddress.trim() === "") {
      return { error: "配送先住所を入力してください" };
    }
    if (request.shippingAddress.length < 5) {
      return { error: "配送先住所を正しく入力してください" };
    }
    if (
      !request.shippingPostalCode ||
      request.shippingPostalCode.trim() === ""
    ) {
      return { error: "郵便番号を入力してください" };
    }
    if (!/^\d{3}-?\d{4}$/.test(request.shippingPostalCode)) {
      return { error: "正しい郵便番号を入力してください" };
    }
    if (!request.items || request.items.length === 0) {
      return { error: "商品を選択してください" };
    }
    for (let i = 0; i < request.items.length; i++) {
      if (request.items[i].quantity <= 0) {
        return { error: "商品の数量は1以上で入力してください" };
      }
      if (request.items[i].quantity > 999) {
        return { error: "商品の数量は999以下で入力してください" };
      }
      if (request.items[i].price <= 0) {
        return { error: "不正な価格が設定されています" };
      }
    }
    if (!request.paymentMethod || request.paymentMethod.trim() === "") {
      return { error: "支払い方法を選択してください" };
    }
    if (
      ![
        "credit_card",
        "bank_transfer",
        "cash_on_delivery",
        "convenience_store",
      ].includes(request.paymentMethod)
    ) {
      return { error: "不正な支払い方法です" };
    }

    for (let i = 0; i < request.items.length; i++) {
      const product = await this.getProductById(request.items[i].productId);
      if (!product) {
        return {
          error: `商品ID ${request.items[i].productId} が見つかりません`,
        };
      }
      if (product.stock < request.items[i].quantity) {
        return { error: `商品「${product.name}」の在庫が不足しています` };
      }
      if (!product.isActive) {
        return { error: `商品「${product.name}」は現在販売停止中です` };
      }
    }

    let subtotal = 0;
    for (let i = 0; i < request.items.length; i++) {
      subtotal += request.items[i].price * request.items[i].quantity;
    }

    let discountAmount = 0;
    if (request.couponCode) {
      const coupon = await this.getCouponByCode(request.couponCode);
      if (coupon) {
        if (new Date(coupon.expiryDate) < new Date()) {
          return { error: "このクーポンは有効期限切れです" };
        }
        if (coupon.minOrderAmount && subtotal < coupon.minOrderAmount) {
          return {
            error: `このクーポンは${coupon.minOrderAmount}円以上の注文で使用できます`,
          };
        }
        if (coupon.usageLimit && coupon.usedCount >= coupon.usageLimit) {
          return { error: "このクーポンは使用上限に達しています" };
        }
        if (coupon.discountType === "percentage") {
          discountAmount = subtotal * (coupon.discountValue / 100);
          if (
            coupon.maxDiscountAmount &&
            discountAmount > coupon.maxDiscountAmount
          ) {
            discountAmount = coupon.maxDiscountAmount;
          }
        } else if (coupon.discountType === "fixed") {
          discountAmount = coupon.discountValue;
        }
      }
    }

    let shippingFee = 0;
    if (subtotal < 5000) {
      shippingFee = 800;
    } else if (subtotal < 10000) {
      shippingFee = 500;
    }

    const finalAmount = subtotal - discountAmount + shippingFee;

    await this.saveCustomer({
      id: request.customerId,
      name: request.customerName,
      email: request.customerEmail,
      phone: request.customerPhone,
    });

    const orderId = await this.saveOrder({
      customerId: request.customerId,
      totalAmount: subtotal,
      discountAmount: discountAmount,
      shippingFee: shippingFee,
      finalAmount: finalAmount,
      status: "pending",
      paymentMethod: request.paymentMethod,
      shippingAddress: request.shippingAddress,
      shippingPostalCode: request.shippingPostalCode,
    });

    for (let i = 0; i < request.items.length; i++) {
      await this.saveOrderItem({
        orderId: orderId,
        productId: request.items[i].productId,
        quantity: request.items[i].quantity,
        price: request.items[i].price,
      });
    }

    for (let i = 0; i < request.items.length; i++) {
      await this.updateStock(
        request.items[i].productId,
        -request.items[i].quantity
      );
    }

    if (request.couponCode) {
      await this.incrementCouponUsage(request.couponCode);
    }

    await this.sendOrderConfirmationEmail(request.customerEmail, orderId);

    const today = new Date();
    const deliveryDate = new Date(today.setDate(today.getDate() + 3));
    const estimatedDeliveryDate = `${deliveryDate.getFullYear()}-${String(
      deliveryDate.getMonth() + 1
    ).padStart(2, "0")}-${String(deliveryDate.getDate()).padStart(2, "0")}`;

    return {
      orderId: orderId,
      totalAmount: subtotal,
      discountAmount: discountAmount,
      finalAmount: finalAmount,
      estimatedDeliveryDate: estimatedDeliveryDate,
    };
  }

  private async getProductById(id: number) {
    return { id, name: "Sample Product", stock: 10, isActive: true };
  }

  private async getCouponByCode(code: string) {
    return null;
  }

  private async saveCustomer(customer: any) {
    return customer.id;
  }

  private async saveOrder(order: any) {
    return Math.floor(Math.random() * 100000);
  }

  private async saveOrderItem(item: any) {
    return item;
  }

  private async updateStock(productId: number, quantity: number) {
    return true;
  }

  private async incrementCouponUsage(code: string) {
    return true;
  }

  private async sendOrderConfirmationEmail(email: string, orderId: number) {
    return true;
  }
}
