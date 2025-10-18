#!/bin/sh
# entrypoint.sh - espera a SQL Server y arranca la app

: "${SQL_SERVER_HOST:=sqlserver}"
: "${SQL_SERVER_PORT:=1433}"
: "${RETRY_COUNT:=30}"
: "${RETRY_WAIT:=2}"

echo "Esperando a SQL Server en $SQL_SERVER_HOST:$SQL_SERVER_PORT ..."

i=0
while [ $i -lt "$RETRY_COUNT" ]; do
  # Usar netcat para verificar si el puerto está abierto
  if nc -z "$SQL_SERVER_HOST" "$SQL_SERVER_PORT" 2>/dev/null; then
    echo "✅ SQL Server está disponible."
    break
  fi
  i=$((i+1))
  echo "Intento $i/$RETRY_COUNT: esperando $RETRY_WAIT s..."
  sleep $RETRY_WAIT
done

if [ $i -ge "$RETRY_COUNT" ]; then
  echo "❌ ERROR: SQL Server no respondió después de $RETRY_COUNT intentos."
  exit 1
fi

# Pequeña espera adicional para asegurar que SQL Server esté completamente listo
echo "Esperando 5 segundos adicionales para que SQL Server esté completamente listo..."
sleep 5

echo "🚀 Iniciando la aplicación..."
exec dotnet ApiPrueba.dll