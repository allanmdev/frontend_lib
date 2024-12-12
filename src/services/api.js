import axios from "axios";

const api = axios.create({
    baseURL: "https://bc6e-2804-18-964-cb52-a054-ef16-dc6e-acd6.ngrok-free.app",
    timeout: 10000,
    headers: {
        "Content-Type": "application/json"
    }   
});

export default api;