import * as signalR from "@microsoft/signalr"

const API_URL = "http://localhost:5058"

export const createConnection = (userId) => {
  if (!userId) {
    console.error("SignalR: userId es requerido para crear la conexión")
    throw new Error("userId es requerido para crear la conexión SignalR")
  }

  const hubUrl = `${API_URL}/Hub/NotificacionesHub?userId=${userId}`

  const connection = new signalR.HubConnectionBuilder()
    .withUrl(hubUrl, {
      skipNegotiation: true,
      transport: signalR.HttpTransportType.WebSockets,
      withCredentials: true,
    })
    .withAutomaticReconnect([0, 0, 0, 5000, 10000, 30000])
    .withServerTimeout(30000)
    .configureLogging(signalR.LogLevel.Warning)
    .build()

  connection.onreconnecting((error) => {
    console.warn("SignalR reconectando:", error?.message)
  })

  connection.onreconnected((connectionId) => {
    console.log("SignalR reconectado")
  })

  connection.onclose((error) => {
    if (error) {
      console.error("SignalR cerrado con error:", error.message)
    }
  })

  return connection
}

export const startConnection = async (connection) => {
  if (connection.state === signalR.HubConnectionState.Disconnected) {
    try {
      await connection.start()
      console.log("✓ SignalR conectado")
      return true
    } catch (error) {
      console.error("Error al conectar SignalR:", error.message)
      return false
    }
  }
  return connection.state === signalR.HubConnectionState.Connected
}

export const stopConnection = async (connection) => {
  if (connection && connection.state === signalR.HubConnectionState.Connected) {
    try {
      await connection.stop()
    } catch (error) {
      console.error("Error al desconectar SignalR:", error.message)
    }
  }
}
