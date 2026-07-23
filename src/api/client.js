import axios from "axios";

const client = axios.create({
  baseURL: "https://dummyjson.com",
});

export default client;