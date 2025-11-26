import {HubConnectionBuilder, LogLevel} from "@microsoft/signalr";

export const createConection = () =>
    new HubConnectionBuilder()
.withUrl("https://localhost:7164/Hub/NotificacionesHub")
.withAutomaticReconnect()
.configureLogging(LogLevel.Information)
.build();
