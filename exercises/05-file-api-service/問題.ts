/**
 * 以下のコードはファイル処理とAPI呼び出しを行うサービスです。
 * このコードには複数の問題があります。リファクタリングしてください。
 */

interface User {
  id: string;
  name: string;
  email: string;
}

class FileService {
  readFile(path: string): string {
    const content = '{"users": [{"id": "1", "name": "John"}]}';
    return content;
  }

  writeFile(path: string, content: string): void {
    console.log(`Writing to ${path}`);
  }

  deleteFile(path: string): void {
    console.log(`Deleting ${path}`);
  }
}

class ApiService {
  async fetchUser(userId: string): Promise<User> {
    const response = await fetch(`https://api.example.com/users/${userId}`);
    const data = await response.json();
    return data;
  }

  async updateUser(user: User): Promise<void> {
    await fetch(`https://api.example.com/users/${user.id}`, {
      method: "PUT",
      body: JSON.stringify(user),
    });
  }
}

class UserDataService {
  private fileService: FileService;
  private apiService: ApiService;

  constructor() {
    this.fileService = new FileService();
    this.apiService = new ApiService();
  }

  loadUsersFromFile(filePath: string): User[] {
    const content = this.fileService.readFile(filePath);
    const data = JSON.parse(content);
    return data.users;
  }

  async syncUserData(userId: string, localPath: string): Promise<void> {
    // ローカルファイルから読み込み
    const localData = this.fileService.readFile(localPath);
    const localUser = JSON.parse(localData);

    // APIからデータを取得
    const remoteUser = await this.apiService.fetchUser(userId);

    // データをマージ
    const mergedUser = {
      ...remoteUser,
      ...localUser,
    };

    // APIに更新
    await this.apiService.updateUser(mergedUser);

    // ローカルファイルを更新
    this.fileService.writeFile(localPath, JSON.stringify(mergedUser));
  }

  async batchUpdateUsers(userIds: string[]): Promise<void> {
    for (const userId of userIds) {
      const user = await this.apiService.fetchUser(userId);
      user.name = user.name.toUpperCase();
      await this.apiService.updateUser(user);
    }
  }

  cleanupOldFiles(paths: string[]): void {
    for (const path of paths) {
      this.fileService.deleteFile(path);
    }
  }
}

async function example() {
  const service = new UserDataService();

  const users = service.loadUsersFromFile("/path/to/users.json");
  console.log(users);

  await service.syncUserData("123", "/path/to/user-123.json");

  await service.batchUpdateUsers(["1", "2", "3", "4", "5"]);
}
