import React from "react";
import axios from "axios";
import Users from "./Users";
import { useState } from "react";
import { useEffect } from "react";
const API_URL = import.meta.env.VITE_API_URL;

const Form = () => {

  const [users, setUsers] = useState({});
  const [fetchTrigger, setFetchTrigger] = useState(0);

  useEffect(() => {
    (async () => {
      try {
        const response = await axios.get(`${API_URL}/users`);
        setUsers(response.data);
      } catch (error) {
        console.error("Error fetching users: ", error)
      }
    })()
  }, [fetchTrigger])

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    const data = Object.fromEntries((new FormData(e.target)).entries());
    
    try {
      console.log("Sending user for POST", data);
      const response = await axios.post(`${API_URL}/users`, data);
      console.log("Server response: ", response.data);
      e.target.reset();
      setFetchTrigger(fetchTrigger === 0 ? 1 : 0);
    } catch (error) {
      console.log("Error submitting form: ", error);
    }
  }

  return (
    <div>
      <form method="POST"  onSubmit={handleFormSubmit} className="mb-7">
        <label htmlFor="firstName">First Name:</label>
        <input
          placeholder="John Doe"
          type="text"
          name="firstName"
          id="firstName"
        />
        <label htmlFor="lastName">Last Name:</label>
        <input
          placeholder="John Doe"
          type="text"
          name="lastName"
          id="lastName"
        />
        <button type="submit">Submit</button>
      </form>
      <Users users={users}/>
    </div>
  );
};

export default Form;
