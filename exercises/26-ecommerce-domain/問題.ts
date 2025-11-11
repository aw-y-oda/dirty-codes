/**
 * 以下のコードは、ECサイトのドメインモデルです。
 * このコードには複数の問題があります。リファクタリングしてください。
 */

type IdAndName = {
  id: string;
  name: string;
};

type EntityWithTimestamp = {
  id: string;
  createdAt: Date;
  updatedAt: Date;
};

class ProductService {
  getProduct(id: string): IdAndName {
    return {
      id: "1",
      name: "Laptop",
    };
  }

  getCategory(id: string): IdAndName {
    return {
      id: "electronics",
      name: "Electronics",
    };
  }

  displayInfo(item: IdAndName): void {
    console.log(`ID: ${item.id}, Name: ${item.name}`);
  }
}

class OrderService {
  getOrder(id: string): EntityWithTimestamp {
    return {
      id: "order-123",
      createdAt: new Date("2025-01-01"),
      updatedAt: new Date("2025-01-02"),
    };
  }

  getShipment(id: string): EntityWithTimestamp {
    return {
      id: "shipment-456",
      createdAt: new Date("2025-01-03"),
      updatedAt: new Date("2025-01-04"),
    };
  }

  getInvoice(id: string): EntityWithTimestamp {
    return {
      id: "invoice-789",
      createdAt: new Date("2025-01-05"),
      updatedAt: new Date("2025-01-06"),
    };
  }
}

function example() {
  const productService = new ProductService();
  const orderService = new OrderService();

  const product = productService.getProduct("1");
  const category = productService.getCategory("electronics");

  productService.displayInfo(category);
  productService.displayInfo(product);

  const order = orderService.getOrder("order-123");
  const shipment = orderService.getShipment("shipment-456");

  processOrder(shipment);
  processShipment(order);
}

function processOrder(order: EntityWithTimestamp): void {
  console.log(`Processing order: ${order.id}`);
}

function processShipment(shipment: EntityWithTimestamp): void {
  console.log(`Processing shipment: ${shipment.id}`);
}
