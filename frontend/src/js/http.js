import axios from 'axios'

export default axios.create({
  baseURL: "http://localhost:3000/api/",
  headers: {
    // "Content-type": "application/json",
    Authorization: "Bearer " + localStorage.getItem("token")
  }
});

// axios.defaults.baseURL = "http://localhost:3000/api/";

// axios.defaults.headers.common['Authorization'] = "Bearer " + localStorage.getItem("token");

// axios.defaults.headers.common['Content-type'] = "application/json";