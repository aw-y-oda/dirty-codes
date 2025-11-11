/**
 * 以下のコードはAPIクライアントの実装です。
 * このコードには複数の問題があります。リファクタリングしてください。
 */

class ApiClient {
  private baseUrl: string;

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
  }

  async get(endpoint: string): Promise<any> {
    const response = await fetch(`${this.baseUrl}${endpoint}`);
    const data = await response.json();
    return data;
  }

  async post(endpoint: string, body: any): Promise<any> {
    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });
    const data = await response.json();
    return data;
  }
}

class UserService {
  private apiClient: ApiClient;

  constructor(apiClient: ApiClient) {
    this.apiClient = apiClient;
  }

  async getUser(userId: string): Promise<any> {
    const user = await this.apiClient.get(`/users/${userId}`);
    return user;
  }

  async createUser(userData: any): Promise<any> {
    const user = await this.apiClient.post("/users", userData);
    return user;
  }

  async updateUser(userId: string, userData: any): Promise<any> {
    const user = await this.apiClient.post(`/users/${userId}`, userData);
    return user;
  }
}

class ProductService {
  private apiClient: ApiClient;

  constructor(apiClient: ApiClient) {
    this.apiClient = apiClient;
  }

  async getProduct(productId: string): Promise<any> {
    const product = await this.apiClient.get(`/products/${productId}`);
    return product;
  }

  async listProducts(filters: any): Promise<any> {
    const query = new URLSearchParams(filters).toString();
    const products = await this.apiClient.get(`/products?${query}`);
    return products;
  }
}

// 使用例
async function example() {
  const apiClient = new ApiClient("https://api.example.com");
  const userService = new UserService(apiClient);

  const user = await userService.getUser("123");
  console.log(user.name);
  console.log(user.emai);

  await userService.createUser({
    name: "John",
    age: "30",
    invalid: "field",
  });
}
