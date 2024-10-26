import axios from "axios";
import CryptoJS from "crypto-js";

const apiHost = import.meta.env.VITE_API_HOST;
const secretKey = import.meta.env.VITE_ENCRYPT_KEY;

const requestApi = async (method, url, data, navigate) => {
  try {
    const encryptedToken = localStorage.getItem("D!");
    if (!encryptedToken) {
      navigate("/login");
      throw new Error("No auth token found. Please log in.");
    }

    // Decrypt token from localStorage
    const bytes = CryptoJS.AES.decrypt(encryptedToken, secretKey);
    const decryptedData = JSON.parse(bytes.toString(CryptoJS.enc.Utf8));

    if (!decryptedData?.token) {
      throw new Error("Invalid or corrupted token data.");
    }

    // Prepare headers
    const headers = {
      "Content-Type": "application/json",
      Authorization: `Bearer ${decryptedData.token}`,
    };

    // Make API request
    let response;
    switch (method.toUpperCase()) {
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

    // Return structured response
    return { success: true, data: response.data };
  } catch (error) {
    console.error("Error in requestApi:", error);

    if (error.response?.status === 401) {
      // Navigate to login if unauthorized
      navigate("/login");
    }

    return {
      success: false,
      error: error.response ? error.response.data : error.message,
    };
  }
};

export default requestApi;
