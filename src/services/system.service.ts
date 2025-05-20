import crypto from "crypto";
import { IResult, IAdminDoc, } from "../utils/interface.util";
import { DecryptDataDTO, EncryptDataDTO } from "../dtos/system.dto";

class SystemService {
  public result: IResult;

  constructor() {
    this.result = { error: false, message: "", code: 200, data: {} };
  }

  /**
   * Private method for encrypting data using AES-GCM
   * @param data - Object containing the payload to encrypt
   * @param data.payload - String to encrypt
   * @param password - Password used for key derivation
   * @param iv - Optional initialization vector (Buffer)
   * @returns Object containing encryption result, encrypted data, and IV
   */
  private static encryptAESGCM(
    data: { payload: string },
    password: string,
    iv?: Buffer
  ): { error: boolean; data?: string; vector?: string } {
    try {
      const key = crypto.createHash("sha256").update(password).digest();

      // If IV is not provided, generate a new random one
      const vector = iv || crypto.randomBytes(12);

      const cipher = crypto.createCipheriv("aes-256-gcm", key, vector);
      let encrypted = cipher.update(data.payload, "utf8", "hex");
      encrypted += cipher.final("hex");

      return {
        error: false,
        data: encrypted,
        vector: vector.toString("hex"), // Store IV as hex
      };
    } catch (error) {
      console.error("Encryption failed:", error);
      return { error: true };
    }
  }

  /**
   * Encrypts data using AES-GCM with a custom separator
   * @param data - Encryption data transfer object
   * @param data.password - Password for encryption
   * @param data.separator - Separator for combining encrypted data and IV
   * @param data.payload - Data to encrypt
   * @returns Promise resolving to encrypted string
   */
  public async encryptData(data: EncryptDataDTO): Promise<string> {
    let result: string = "";
    const { password, separator, payload } = data;

    // Generate a fixed IV from the email
    const iv = crypto
      .createHash("sha256")
      .update(password)
      .digest()
      .slice(0, 12); // 12-byte IV

    const encrypted = SystemService.encryptAESGCM({ payload }, password, iv);

    if (encrypted.error === false) {
      result = encrypted.data + separator + iv.toString("hex"); // Convert IV to hex
    }

    return result;
  }

  /**
   * Private method for decrypting AES-GCM encrypted data
   * @param data - Object containing the encrypted payload
   * @param data.payload - Encrypted string to decrypt
   * @param password - Password used for key derivation
   * @param iv - Initialization vector (Buffer)
   * @returns Object containing decryption result and decrypted data
   */
  private static decryptAESGCM(
    data: { payload: string },
    password: string,
    iv: Buffer
  ): { error: boolean; data?: string } {
    try {
      const key = crypto.createHash("sha256").update(password).digest();
      const decipher = crypto.createDecipheriv("aes-256-gcm", key, iv);

      let decrypted = decipher.update(data.payload, "hex", "utf8");
      decrypted += decipher.final("utf8");

      return { error: false, data: decrypted };
    } catch (error) {
      console.error("Decryption failed:", error);
      return { error: true };
    }
  }

  /**
   * Decrypts data that was encrypted using AES-GCM
   * @param data - Decryption data transfer object
   * @param data.password - Password for decryption
   * @param data.payload - Encrypted data to decrypt
   * @param data.separator - Separator used in encrypted data
   * @returns Promise resolving to decryption result
   */
  public async decryptData(data: DecryptDataDTO): Promise<any> {
    let result: any = null;
    const { password, payload, separator } = data;

    try {
      const hashed = payload.split(separator);
      if (hashed.length !== 2) {
        return { error: true, message: "Invalid encrypted format" };
      }

      const cipher = hashed[0];
      const vector = Buffer.from(hashed[1], "hex"); // Convert IV from hex to Buffer

      let decrypted = SystemService.decryptAESGCM(
        { payload: cipher },
        password,
        vector
      );

      if (decrypted.error || !decrypted.data) {
        return { error: true, message: "Decryption failed" };
      }

      // ✅ Fix: Ensure decrypted.data is a valid string before parsing
      if (typeof decrypted.data !== "string") {
        return { error: true, message: "Decryption returned invalid data" };
      }

      // ✅ Safe JSON parsing
      try {
        const parsed = JSON.parse(decrypted.data);
        decrypted.data = parsed.payload; // Ensure it contains a 'payload' key
      } catch (error) {
        return {
          error: true,
          message: "Invalid JSON format in decrypted data",
        };
      }

      result = decrypted;
    } catch (error) {
      console.error("Decryption error:", error);
      return { error: true, message: "Unexpected error during decryption" };
    }

    return result;
  }

  /**
   * Generates a secure API key with customizable length and optional prefix
   * @param length - Length of the API key (default: 32)
   * @param prefix - Optional prefix to add to the API key
   * @returns Generated API key string
   * @throws Error if API key generation fails
   */
  public async generateAPIKey(
    length: number = 32,
    prefix?: string
  ): Promise<string> {
    try {
      // Generate random bytes for the API key
      const randomBytes = crypto.randomBytes(length);
      let apiKey = randomBytes
        .toString("base64")
        .replace(/[^a-zA-Z0-9]/g, "")
        .slice(0, length);

      if (prefix) {
        apiKey = `${prefix}_${apiKey}`;
      }

      // Encrypt the API key
      const encryptedKey = await this.encryptData({
        payload: apiKey,
        password: process.env.API_KEY_SECRET || "default-secret",
        separator: ".",
      });

      return encryptedKey;
    } catch (error) {
      console.error("API key generation failed:", error);
      throw new Error("Failed to generate API key");
    }
  }

  /**
   * Revokes an API key by adding it to a blacklist
   * @param apiKey - API key to revoke
   * @returns Promise resolving to operation result
   * @throws Error if revocation fails
   */
  public async validateAPIKey(apiKey: string): Promise<IResult> {
    try {
      // Decrypt the API key
      const decrypted = await this.decryptData({
        payload: apiKey,
        password: process.env.API_KEY_SECRET || "default-secret",
        separator: ".",
      });

      if (decrypted.error || !decrypted.data) {
        this.result.error = true;
        this.result.message = "Invalid API key";
        this.result.code = 400;
        return this.result;
      }

      // Basic format validation on decrypted key
      const apiKeyRegex = /^[A-Za-z0-9_-]+$/;
      if (!apiKeyRegex.test(decrypted.data)) {
        this.result.error = true;
        this.result.message = "Invalid API key format";
        this.result.code = 400;
        return this.result;
      }

      this.result.error = false;
      this.result.message = "API key is valid";
      this.result.code = 200;
      this.result.data = { originalKey: decrypted.data };
      return this.result;
    } catch (error) {
      console.error("API key validation failed:", error);
      this.result.error = true;
      this.result.message = "Failed to validate API key";
      this.result.code = 500;
      return this.result;
    }
  }

}

export default new SystemService();
