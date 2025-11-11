/**
 * 以下のコードは通知システムの実装です。
 * このコードには複数の問題があります。リファクタリングしてください。
 */

class EmailService {
  sendEmail(to: string, subject: string, body: string): void {
    console.log(`Sending email to ${to}`);
    console.log(`Subject: ${subject}`);
    console.log(`Body: ${body}`);
    // 実際のメール送信処理
  }
}

class SMSService {
  sendSMS(phoneNumber: string, message: string): void {
    console.log(`Sending SMS to ${phoneNumber}`);
    console.log(`Message: ${message}`);
    // 実際のSMS送信処理
  }
}

class NotificationService {
  private emailService: EmailService;
  private smsService: SMSService;

  constructor() {
    this.emailService = new EmailService();
    this.smsService = new SMSService();
  }

  notifyUser(userId: string, message: string, type: string): void {
    const userEmail = this.getUserEmail(userId);
    const userPhone = this.getUserPhone(userId);

    if (type === "email") {
      this.emailService.sendEmail(userEmail, "Notification", message);
    } else if (type === "sms") {
      this.smsService.sendSMS(userPhone, message);
    } else if (type === "both") {
      this.emailService.sendEmail(userEmail, "Notification", message);
      this.smsService.sendSMS(userPhone, message);
    }
  }

  private getUserEmail(userId: string): string {
    return `user${userId}@example.com`;
  }

  private getUserPhone(userId: string): string {
    return `090-1234-${userId}`;
  }
}

class OrderService {
  private notificationService: NotificationService;

  constructor() {
    this.notificationService = new NotificationService();
  }

  createOrder(userId: string, productId: string): void {
    console.log(`Creating order for user ${userId}`);

    this.notificationService.notifyUser(
      userId,
      "Your order has been placed successfully!",
      "email"
    );
  }

  cancelOrder(userId: string, orderId: string): void {
    console.log(`Cancelling order ${orderId}`);

    this.notificationService.notifyUser(
      userId,
      "Your order has been cancelled.",
      "both"
    );
  }
}

const orderService = new OrderService();
orderService.createOrder("123", "product-456");
