import axios from "axios";
import CryptoJS from "crypto-js";
import { decryptData, removeEncryptedCookie } from "./encrypt";

const apiHost = import.meta.env.VITE_API_HOST;
const secretKey = import.meta.env.VITE_ENCRYPT_KEY;

const requestApi = async (method, url, data ) => {
  try {
    const encryptedToken = localStorage.getItem("D!");
    // if (!encryptedToken) {
    //   navigate("/login");
    //   throw new Error("No auth token found. Please log in.");
    // }

    const bytes = CryptoJS.AES.decrypt(encryptedToken, secretKey);
    const decryptedData = JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
    console.log("Decrypted User Data:", decryptedData);
    console.log(decryptedData.token)

    if (!decryptedData ||  !decryptedData.token) {
      throw new Error("Invalid or corrupted token data.");
    }

    const headers = {
      "Content-Type": "application/json",
      Authorization: `Bearer ${decryptedData.token}`, 
    };

    let response;
    switch (method) {
      case "POST":
        response = await axios.post(apiHost + url, data, { headers });
        break;
      case "GET":
        response = await axios.get(apiHost + url, { headers });
        break;
      case "PUT":
        response = await axios.put(apiHost + url, data, { headers });
        break;
      case "DELETE":
        response = await axios.delete(apiHost + url, { headers });
        break;
      default:
        throw new Error(`Unsupported request method: ${method}`);
    }

    if (!response) {
      throw new Error("No response from the server");
    }

    return { success: true, data: response.data };
  } catch (error) {
    console.error("Error in requestApi:", error);

    return {
      success: false,
      error: error.response ? error.response.data : error.message,
    };
  }
};

export default requestApi;
