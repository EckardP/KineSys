import {HubConnectionBuilder, LogLevel} from "@microsoft/signalr";

const API_URL = import.meta.env.VITE_SIGNALR_URL || "http://localhost:5058"

export const createConection = () =>
    new HubConnectionBuilder()
.withUrl(`${API_URL}/Hub/NotificacionesHub`, {
    accessTokenFactory: () => sessionStorage.getItem("authToken") || "",
})
.withAutomaticReconnect()
.configureLogging(LogLevel.Information)
.build();
