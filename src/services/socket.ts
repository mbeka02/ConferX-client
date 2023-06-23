import { io } from "socket.io-client";
//change in prod
const URL = "http://localhost:3000";
export const socket = io(URL);
