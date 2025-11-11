/**
 * 以下のコードはユーザー管理システムの一部です。
 * このコードには複数の問題があります。リファクタリングしてください。
 */

interface User {
  id: string;
  name: string;
  email: string;
  age: number;
  role: string;
}

interface Product {
  id: string;
  name: string;
  price: number;
  stock: number;
}

class UserValidator {
  validateUserName(name: string): string[] {
    const errors: string[] = [];

    if (!name) {
      errors.push("名前は必須です");
    }

    if (name.length < 2) {
      errors.push("名前は2文字以上である必要があります");
    }

    if (name.length > 50) {
      errors.push("名前は50文字以内である必要があります");
    }

    return errors;
  }

  validateEmail(email: string): string[] {
    const errors: string[] = [];

    if (!email) {
      errors.push("メールアドレスは必須です");
    }

    if (email.length < 5) {
      errors.push("メールアドレスは5文字以上である必要があります");
    }

    if (email.length > 100) {
      errors.push("メールアドレスは100文字以内である必要があります");
    }

    if (!email.includes("@")) {
      errors.push("メールアドレスの形式が不正です");
    }

    return errors;
  }

  validateAge(age: number): string[] {
    const errors: string[] = [];

    if (!age) {
      errors.push("年齢は必須です");
    }

    if (age < 0) {
      errors.push("年齢は0以上である必要があります");
    }

    if (age > 150) {
      errors.push("年齢は150以下である必要があります");
    }

    return errors;
  }
}

class ProductValidator {
  validateProductName(name: string): string[] {
    const errors: string[] = [];

    if (!name) {
      errors.push("商品名は必須です");
    }

    if (name.length < 2) {
      errors.push("商品名は2文字以上である必要があります");
    }

    if (name.length > 100) {
      errors.push("商品名は100文字以内である必要があります");
    }

    return errors;
  }

  validatePrice(price: number): string[] {
    const errors: string[] = [];

    if (!price) {
      errors.push("価格は必須です");
    }

    if (price < 0) {
      errors.push("価格は0以上である必要があります");
    }

    if (price > 10000000) {
      errors.push("価格は10000000以下である必要があります");
    }

    return errors;
  }

  validateStock(stock: number): string[] {
    const errors: string[] = [];

    if (stock === null || stock === undefined) {
      errors.push("在庫数は必須です");
    }

    if (stock < 0) {
      errors.push("在庫数は0以上である必要があります");
    }

    if (stock > 100000) {
      errors.push("在庫数は100000以下である必要があります");
    }

    return errors;
  }
}
