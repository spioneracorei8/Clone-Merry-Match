import axios from "axios";

const instance = axios.create({
    baseURL: "http://localhost:30001",
    headers: {
        "Content-Type": "application/json",
    },
});

const instanceAttToken = axios.create({
    baseURL: "http://localhost:30001",
    headers: {
        "Authorization": `Bearer ${localStorage.getItem("token")}`,
    },
})

export { instance, instanceAttToken };