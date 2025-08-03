import axios from "axios";
import { useEffect, useState } from "react";

const host = import.meta.env.VITE_HOST;

function Messages() {
  const [messages, setMessages] = useState([]);
  const [formData, setFormData] = useState({});

  useEffect(() => {
    fetchMessages();
  }, []);

  function fetchMessages() {
    axios
      .get(`${host}/messages`)
      .then((res) => setMessages(res.data))
      .catch((err) => console.error(err));
  }

  const handleFormChange = (event) => {
    setFormData((prev) => ({
      ...prev,
      [event.target.name]: event.target.value,
      tstamp: new Date().toLocaleString("hr-HR"),
    }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    axios
      .post(`${host}/messages`, formData)
      .then((res) => {
        console.log(`${res.status} ${res.statusText}: ${res.data}`);
        setFormData({});
        fetchMessages();
      })
      .catch((err) => {
        console.log(`${err.message}: ${err.response.data}`);
        console.log(err);
      });
  };

  function handleDelete(index) {
    axios
      .delete(`${host}/messages/${index}`)
      .then((res) => {
        console.log(res);
        fetchMessages();
      })
      .catch((err) => {
        console.log(err);
      });
  }

  return (
    <div className="flex flex-col gap-2 max-w-2xl">
      <div className="my-5">
        <form action="" className="flex flex-row gap-2">
          <div className="flex flex-row gap-2 items-start">
            <label htmlFor="user" className="text-gray-600">
              User:
            </label>
            <input
              type="text"
              name="user"
              value={formData.user || ""}
              onChange={handleFormChange}
              required
              className="border w-[150px] border-gray-300 rounded-lg p-1 focus:outline-1 focus:outline-gray-400"
            />
          </div>
          <div className="flex flex-row gap-2 items-start flex-1">
            <label htmlFor="user" className="text-gray-600">
              Message:
            </label>
            <textarea
              type="textarea"
              name="content"
              required
              value={formData.content || ""}
              onChange={handleFormChange}
              className="border flex-1 border-gray-300 rounded-lg p-1 focus:outline-1 focus:outline-gray-400"
            />
          </div>
          <div>
            <button
              onClick={handleSubmit}
              className="p-2 px-3 hover:bg-blue-400 bg-blue-500 rounded-lg text-gray-100 font-semibold text-sm"
            >
              Submit
            </button>
          </div>
        </form>
      </div>
      {messages.map((message, index) => {
        return (
          <div
            key={index}
            className="flex flex-col justify-between bg-slate-200 p-2 rounded-lg"
          >
            <div className="flex flex-row justify-between">
              <div className="text-gray-500 text-sm">{message.user}</div>
              <div className="text-gray-500 text-xs">{message.tstamp}</div>
            </div>
            <div className="flex flex-row justify-between gap-1">
              <div>{message.content}</div>
              <div
                className="text-red-400 cursor-pointer text-sm self-end"
                onClick={() => handleDelete(index)}
              >
                Delete
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default Messages;
