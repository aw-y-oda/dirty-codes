/**
 * 以下のコードは請求書処理システムの一部です。
 * このコードには複数の問題があります。リファクタリングしてください。
 */

interface Invoice {
  id: number;
  customerId: number;
  amount: number;
  items: InvoiceItem[];
  dueDate: string;
  status: "pending" | "paid" | "overdue";
}

interface InvoiceItem {
  productId: number;
  quantity: number;
  unitPrice: number;
}

interface Customer {
  id: number;
  name: string;
  type: "regular" | "premium" | "vip";
  membershipLevel: number;
  creditLimit: number;
  totalPurchases: number;
}

interface PaymentResult {
  success: boolean;
  finalAmount: number;
  discountApplied: number;
  message: string;
}

class InvoiceProcessor {
  calculateFinalAmount(
    invoice: Invoice,
    customer: Customer,
    paymentMethod: string,
    useLoyaltyPoints: boolean,
    loyaltyPoints: number
  ): PaymentResult {
    if (invoice.status === "paid") {
      return {
        success: false,
        finalAmount: 0,
        discountApplied: 0,
        message: "この請求書は既に支払い済みです",
      };
    } else {
      if (customer.type === "regular") {
        if (invoice.amount > customer.creditLimit) {
          return {
            success: false,
            finalAmount: 0,
            discountApplied: 0,
            message: "クレジット限度額を超えています",
          };
        } else {
          if (paymentMethod === "credit_card") {
            if (invoice.amount >= 10000) {
              const discount = invoice.amount * 0.02;
              const finalAmount = invoice.amount - discount;
              return {
                success: true,
                finalAmount: finalAmount,
                discountApplied: discount,
                message: "2%割引が適用されました",
              };
            } else {
              return {
                success: true,
                finalAmount: invoice.amount,
                discountApplied: 0,
                message: "割引なし",
              };
            }
          } else if (paymentMethod === "bank_transfer") {
            if (invoice.amount >= 50000) {
              const discount = invoice.amount * 0.01;
              const finalAmount = invoice.amount - discount;
              return {
                success: true,
                finalAmount: finalAmount,
                discountApplied: discount,
                message: "1%割引が適用されました",
              };
            } else {
              return {
                success: true,
                finalAmount: invoice.amount,
                discountApplied: 0,
                message: "割引なし",
              };
            }
          } else {
            return {
              success: true,
              finalAmount: invoice.amount,
              discountApplied: 0,
              message: "割引なし",
            };
          }
        }
      } else if (customer.type === "premium") {
        if (invoice.amount > customer.creditLimit * 1.5) {
          return {
            success: false,
            finalAmount: 0,
            discountApplied: 0,
            message: "クレジット限度額を超えています",
          };
        } else {
          if (customer.membershipLevel >= 3) {
            if (paymentMethod === "credit_card") {
              if (invoice.amount >= 10000) {
                const discount = invoice.amount * 0.05;
                const finalAmount = invoice.amount - discount;
                if (useLoyaltyPoints && loyaltyPoints > 0) {
                  const pointDiscount = Math.min(loyaltyPoints, finalAmount);
                  const finalWithPoints = finalAmount - pointDiscount;
                  return {
                    success: true,
                    finalAmount: finalWithPoints,
                    discountApplied: discount + pointDiscount,
                    message: "5%割引とポイント割引が適用されました",
                  };
                } else {
                  return {
                    success: true,
                    finalAmount: finalAmount,
                    discountApplied: discount,
                    message: "5%割引が適用されました",
                  };
                }
              } else {
                const discount = invoice.amount * 0.03;
                const finalAmount = invoice.amount - discount;
                return {
                  success: true,
                  finalAmount: finalAmount,
                  discountApplied: discount,
                  message: "3%割引が適用されました",
                };
              }
            } else if (paymentMethod === "bank_transfer") {
              if (invoice.amount >= 50000) {
                const discount = invoice.amount * 0.04;
                const finalAmount = invoice.amount - discount;
                return {
                  success: true,
                  finalAmount: finalAmount,
                  discountApplied: discount,
                  message: "4%割引が適用されました",
                };
              } else {
                const discount = invoice.amount * 0.02;
                const finalAmount = invoice.amount - discount;
                return {
                  success: true,
                  finalAmount: finalAmount,
                  discountApplied: discount,
                  message: "2%割引が適用されました",
                };
              }
            } else {
              const discount = invoice.amount * 0.01;
              const finalAmount = invoice.amount - discount;
              return {
                success: true,
                finalAmount: finalAmount,
                discountApplied: discount,
                message: "1%割引が適用されました",
              };
            }
          } else {
            if (paymentMethod === "credit_card") {
              const discount = invoice.amount * 0.03;
              const finalAmount = invoice.amount - discount;
              return {
                success: true,
                finalAmount: finalAmount,
                discountApplied: discount,
                message: "3%割引が適用されました",
              };
            } else {
              const discount = invoice.amount * 0.01;
              const finalAmount = invoice.amount - discount;
              return {
                success: true,
                finalAmount: finalAmount,
                discountApplied: discount,
                message: "1%割引が適用されました",
              };
            }
          }
        }
      } else if (customer.type === "vip") {
        if (customer.totalPurchases >= 1000000) {
          if (paymentMethod === "credit_card") {
            if (invoice.amount >= 10000) {
              const discount = invoice.amount * 0.1;
              const finalAmount = invoice.amount - discount;
              if (useLoyaltyPoints && loyaltyPoints > 0) {
                const pointDiscount = Math.min(loyaltyPoints, finalAmount);
                const finalWithPoints = finalAmount - pointDiscount;
                return {
                  success: true,
                  finalAmount: finalWithPoints,
                  discountApplied: discount + pointDiscount,
                  message: "10%割引とポイント割引が適用されました",
                };
              } else {
                return {
                  success: true,
                  finalAmount: finalAmount,
                  discountApplied: discount,
                  message: "10%割引が適用されました",
                };
              }
            } else {
              const discount = invoice.amount * 0.07;
              const finalAmount = invoice.amount - discount;
              return {
                success: true,
                finalAmount: finalAmount,
                discountApplied: discount,
                message: "7%割引が適用されました",
              };
            }
          } else if (paymentMethod === "bank_transfer") {
            const discount = invoice.amount * 0.08;
            const finalAmount = invoice.amount - discount;
            return {
              success: true,
              finalAmount: finalAmount,
              discountApplied: discount,
              message: "8%割引が適用されました",
            };
          } else {
            const discount = invoice.amount * 0.05;
            const finalAmount = invoice.amount - discount;
            return {
              success: true,
              finalAmount: finalAmount,
              discountApplied: discount,
              message: "5%割引が適用されました",
            };
          }
        } else {
          if (paymentMethod === "credit_card") {
            const discount = invoice.amount * 0.07;
            const finalAmount = invoice.amount - discount;
            if (useLoyaltyPoints && loyaltyPoints > 0) {
              const pointDiscount = Math.min(loyaltyPoints, finalAmount);
              const finalWithPoints = finalAmount - pointDiscount;
              return {
                success: true,
                finalAmount: finalWithPoints,
                discountApplied: discount + pointDiscount,
                message: "7%割引とポイント割引が適用されました",
              };
            } else {
              return {
                success: true,
                finalAmount: finalAmount,
                discountApplied: discount,
                message: "7%割引が適用されました",
              };
            }
          } else {
            const discount = invoice.amount * 0.05;
            const finalAmount = invoice.amount - discount;
            return {
              success: true,
              finalAmount: finalAmount,
              discountApplied: discount,
              message: "5%割引が適用されました",
            };
          }
        }
      } else {
        return {
          success: false,
          finalAmount: 0,
          discountApplied: 0,
          message: "不正な顧客タイプです",
        };
      }
    }
  }
}
