import axios from "axios";

const instance = axios.create({
    baseURL: "http://localhost:30001",
})

export { instance };