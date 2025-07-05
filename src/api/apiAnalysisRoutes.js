import axios from 'axios';

// Fetch base URL from .env file
const baseUrl = import.meta.env.VITE_CALL_API_URL;

// Axios instance with base URL
const api = axios.create({
  baseURL: baseUrl,
  headers: {
    'Content-Type': 'application/json',
  },
});


// Fetch Cold Call Script
export const getColdCallScript = async () => {
  try {
    const response = await api.get('/api/cold-call/get-cold-call-script');
    return response.data; // Expected response: Script (string)
  } catch (error) {
    console.error("Error fetching cold call script:", error);
    throw error;
  }
};

// Update Cold Call Script
export const updateColdCallScript = async (payload) => {
  try {
    const response = await api.put('/api/cold-call/edit-cold-call-script', payload);
    return response.data; // Expected response: Updated script (string)
  } catch (error) {
    console.error("Error updating cold call script:", error);
    throw error;
  }
};

// Fetch All Users With Time
export const getAllActiveUsersWithRemainingTime = async () => {
  try {
    const response = await api.get('/api/analytics/users-with-time');
    return response.data; // Expected response: List of all users with their usage data
  } catch (error) {
    console.error("Error fetching all users with time:", error);
    throw error;
  }
};

// Fetch All Active Users (those who used the bot at least once)
export const getActiveUsers = async () => {
  try {
    const response = await api.get('/api/analytics/active-users');
    return response.data; // Expected response: List of all active users with their usage data
  } catch (error) {
    console.error("Error fetching active users:", error);
    throw error;
  }
};

// Fetch Percentage of Users Who Completed 30 Minutes Usage
export const getUsers30MinutesCompletedPercentage = async () => {
  try {
    const response = await api.get('/api/analytics/30minutes-completed-users-percentage');
    return response.data; // Expected response: Percentage of users who completed 30 minutes usage
  } catch (error) {
    console.error("Error fetching users 30 minutes completed percentage:", error);
    throw error;
  }
};

// Fetch Percentage of Users Who Never Used the Bot
export const getNeverUsedUsersPercentage = async () => {
  try {
    const response = await api.get('/api/analytics/never-used-users-percentage');
    return response.data; // Expected response: Percentage of users who never used the bot
  } catch (error) {
    console.error("Error fetching never used users percentage:", error);
    throw error;
  }
};

// Fetch Percentage of Users Not Accessed By Admin
export const getNotAccessedByAdminUsersPercentage = async () => {
  try {
    const response = await api.get('/api/analytics/not-accessed-by-admin-users-percentage');
    return response.data; // Expected response: Percentage of users not accessed by admin
  } catch (error) {
    console.error("Error fetching not accessed by admin users percentage:", error);
    throw error;
  }
};

// Fetch All Users Not Accessed By Admin
export const getAllUsersNotAccessedByAdmin = async () => {
  try {
    const response = await api.get('/api/analytics/all-users-not-accessed-by-admin');
    return response.data; // Expected response: List of all users who have not accessed the bot by admin
  } catch (error) {
    console.error("Error fetching all users not accessed by admin:", error);
    throw error;
  }
};

// Fetch Percentage of Users Registered Back After 30 Minutes Usage
export const getRegisteredBackAfter30MinutesPercentage = async () => {
  try {
    const response = await api.get('/api/analytics/registered-back-after-30-minutes-usage-percentage');
    return response.data; // Expected response: Percentage of users who registered back after 30 minutes usage
  } catch (error) {
    console.error("Error fetching registered back after 30 minutes usage percentage:", error);
    throw error;
  }
};

// Fetch Count of People Who Never Registered Back After First Usage
export const getNeverRegisteredBackAfterFirstUsage = async () => {
  try {
    const response = await api.get('/api/analytics/never-registered-back-after-first-usage');
    return response.data; // Expected response: Count of people who never registered back after first usage
  } catch (error) {
    console.error("Error fetching never registered back after first usage:", error);
    throw error;
  }
};

// Give access to a user
export const giveAccessToUser = async (email) => {
    console.log(email);
 try {
    const response = await api.post(`/api/allow-access/give-access-to-user?email=${encodeURIComponent(email)}`);
    return response.data; // Expected response: Success message or data confirming access granted
  } catch (error) {
    console.error("Error giving access to user:", error);
    throw error;
  }
};
