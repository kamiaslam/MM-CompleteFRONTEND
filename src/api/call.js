// src/api/call.js
import axios from "axios";
import { authHeader } from "../helper/authHelper"; // Make sure this exists and returns your auth headers

// Get the call API base URL from the environment variable
const callApiUrl = import.meta.env.VITE_CALL_API_URL;

const callAxiosApi = axios.create({
  baseURL: callApiUrl,
});

// Optional: Add a response interceptor if you want to handle errors globally for call endpoints.
callAxiosApi.interceptors.response.use(
  (response) => response,
  (error) => {
    // You can add specific error handling here if needed.
    return Promise.reject(error);
  }
);

/**
 * postCall - Helper function to perform POST requests for call-related endpoints.
 *
 * @param {string} url - The endpoint path (e.g., "/start-call").
 * @param {Object} data - The data payload to send.
 * @param {Object} config - Optional additional config.
 * @returns {Promise} - Resolves with the response or error response.
 */
export async function postCall(url, data, config = {}) {
  try {
    const response = await callAxiosApi.post(url, data, {
      ...config,
      headers: authHeader(),
    });
    return response;
  } catch (error) {
    console.error("Error in call API post request:", error);
    return error.response;
  }
}



/**
 * getCallPreDataV2 - Fetch pre-call data such as duration, voice_id, and first name.
 *
 * @param {string} schedule_id - ID of the scheduled call.
 * @param {string} patient_id - ID of the patient.
 * @returns {Promise<Object|null>} - Call details or null if error.
 */
export async function getCallPreDataV2(schedule_id, patient_id) {
  try {
    const response = await callAxiosApi.get(
      `/api/call/get-data-before-call?schedule_id=${schedule_id}&patient_id=${patient_id}`,
      { headers: authHeader() }
    );
    return response?.data;
  } catch (error) {
    console.error("Error fetching call pre-data:", error);
    return null;
  }
}
