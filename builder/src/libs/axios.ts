import axiosLib from "axios";
import {config} from "../app.config.ts";

const axios = axiosLib.create({
    baseURL: config.API_URL,
    withCredentials: true,
    headers: {
        "Content-Type": "application/json",
    },
});

export { axios };
export default axios;