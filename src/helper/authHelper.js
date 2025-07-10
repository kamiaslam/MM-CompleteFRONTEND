import { jwtDecode } from "jwt-decode";
import axios from "axios";
import toast from "react-hot-toast";
import { SESSION_EXPIRED } from "./constant";

export const authHeader = () => {
  let sessionObj = getSession();
  if (sessionObj && sessionObj.access_token) {
    return {
      Authorization: "Bearer " + sessionObj.access_token,
      "Content-Security-Policy": "default-src 'self',frame-src 'self'",
      "Access-Control-Allow-Origin": "*",
      "X-Content-Type-Options": "nosniff",
      "Access-Control-Allow-Methods": "*",
      "Access-Control-Allow-Headers": "*",
      "Content-Type": "application/json",
      "X-Frame-Options": "SAMEORIGIN",
      "ngrok-skip-browser-warning": true,
      // "User-Agent": true,
    };
  } else {
    return {
      "Content-Security-Policy": "default-src 'self',frame-src 'self'",
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "*",
      "Access-Control-Allow-Headers": "*",
      "Content-Type": "application/json",
      "X-Frame-Options": "SAMEORIGIN",
      "X-Content-Type-Options": "nosniff",
      "ngrok-skip-browser-warning": true,
      // "User-Agent": true,
    };
  }
};
export const refreshAuthHeader = () => {
  let sessionObj = getSession();
  if (sessionObj && sessionObj.refresh_token) {
    return {
      Authorization: "Bearer " + sessionObj.refresh_token,
      "Content-Security-Policy": "default-src 'self',frame-src 'self'",
      "Access-Control-Allow-Origin": "*",
      "X-Content-Type-Options": "nosniff",
      "Access-Control-Allow-Methods": "*",
      "Access-Control-Allow-Headers": "*",
      "Content-Type": "application/json",
      "X-Frame-Options": "SAMEORIGIN",
      "ngrok-skip-browser-warning": true,
      // "User-Agent": true,
    };
  } else {
    return {
      "Content-Security-Policy": "default-src 'self',frame-src 'self'",
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "*",
      "Access-Control-Allow-Headers": "*",
      "Content-Type": "application/json",
      "X-Frame-Options": "SAMEORIGIN",
      "X-Content-Type-Options": "nosniff",
      "ngrok-skip-browser-warning": true,
      // "User-Agent": true,
    };
  }
};

export const authHeaderForm = () => {
  let sessionObj = getSession();
  if (sessionObj && sessionObj.access_token) {
    return {
      Authorization: "Bearer " + sessionObj.access_token,
      "Content-Security-Policy": "default-src 'self',frame-src 'self'",
      "Access-Control-Allow-Origin": "*",
      "X-Content-Type-Options": "nosniff",
      "Access-Control-Allow-Methods": "*",
      "Access-Control-Allow-Headers": "*",
      "Content-Type": "multipart/form-data",
      "X-Frame-Options": "SAMEORIGIN",
      "ngrok-skip-browser-warning": true,
      // "User-Agent": true,
    };
  } else {
    return {
      "Content-Security-Policy": "default-src 'self',frame-src 'self'",
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "*",
      "Access-Control-Allow-Headers": "*",
      "Content-Type": "multipart/form-data",
      "X-Frame-Options": "SAMEORIGIN",
      "X-Content-Type-Options": "nosniff",
      "ngrok-skip-browser-warning": true,
      // "User-Agent": true,
    };
  }
};



export const getSession = () => {
  if (typeof localStorage !== "undefined") {
    return JSON.parse(localStorage?.getItem("authUser"));
  } else {
    return null;
  }
};
export const isTokenExpired = (token) => {
  if (!token) return true;
  const decodedToken = jwtDecode(token);
  const currentTime = Date.now() / 1000; // Convert to seconds
  return decodedToken.exp < currentTime;
};
export const logout = () => {
  localStorage.removeItem("authUser");
  localStorage.removeItem("userInfo");
  localStorage.removeItem("token");
  localStorage.removeItem("data");
};
export const checkToken = async () => {
  const userInfo = getSession();
  const expTime = 10 * 60 * 1000; // 5 minutes in milliseconds

  const token = userInfo?.access_token;

  if (token && userInfo?.refresh_token) {
    const tokenData = jwtDecode(token);
    const timeStamp = tokenData.exp * 1000 - Date.now();

    if (timeStamp <= expTime) {
      try {
        const res = await axios.get(
          import.meta.env.VITE_API_URL + "/auth/refresh-token",
          {
            headers: refreshAuthHeader(),
          }
        );
        if (res?.data?.success) {
          const info = JSON.parse(localStorage.getItem("authUser"));
          if (res && res.data && res.data.data) {
            const updatedData = {
              ...info,
              access_token: res.data.data.access_token,
            };
            localStorage.setItem("authUser", JSON.stringify(updatedData));
          }
          return true;
        } else {
          return false;
        }
      } catch (error) {
        if (error.response && error.response.status === 401) {
          toast.error(SESSION_EXPIRED);
          localStorage.clear();
          window.location.href = "/login";
          return false;
        }
      }
      return "time";
    } else {
      return false;
    }
  }
};

export function convertObjectToFormData(object) {
  const formData = new FormData();

  for (const key in object) {
    if (object.hasOwnProperty(key)) {
      const value = object[key];

      if (value !== null && value !== undefined && value !== "") {
        if (Array.isArray(value)) {
          for (const item of value) {
            formData.append(`${key}[]`, item);
          }
        } else if (typeof value === "object" && value !== null) {
          const nestedFormData = convertObjectToFormData(value);
          for (const [nestedKey, nestedValue] of nestedFormData.entries()) {
            formData.append(`${key}[${nestedKey}]`, nestedValue);
          }
        } else {
          formData.append(key, String(value));
        }
      }
    }
  }
  if (object.hasOwnProperty("image")) {
    if (typeof object["image"] === "object") {
      formData.append("image", object["image"] || "");
    }
  }

  return formData;
}
