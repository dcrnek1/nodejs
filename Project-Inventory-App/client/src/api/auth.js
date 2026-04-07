import axios from "axios";

export const logoutApi = async () => {
  // This is the raw logic to tell the server "we're out"
  const response = await axios.get(
    `${import.meta.env.VITE_API_URL}/auth/logout`,
    {
      withCredentials: true, // Note: Use true for boolean, not "include" (fetch uses "include")
    },
  );
  return response;
};

export const refreshAuthApi = async () => {
  const response = await axios.get(
    `${import.meta.env.VITE_API_URL}/auth/refresh`,
    {
      withCredentials: true, // Note: Use true for boolean, not "include" (fetch uses "include")
    },
  );
  return response;
};
