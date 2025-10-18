# Dockerfile (para .NET 8) - Versión simplificada y confiable
FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS base
USER root
WORKDIR /app
EXPOSE 80

# Instalar solo netcat para verificar conectividad (mucho más simple)
RUN apt-get update && \
    apt-get install -y netcat-openbsd && \
    apt-get clean && \
    rm -rf /var/lib/apt/lists/*

FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /src
COPY ["ApiPrueba.csproj", "./"]
RUN dotnet restore "./ApiPrueba.csproj"
COPY . .
RUN dotnet publish "./ApiPrueba.csproj" -c Release -o /app/publish

FROM base AS final
WORKDIR /app
COPY --from=build /app/publish .
COPY entrypoint.sh .
RUN chmod +x entrypoint.sh

ENTRYPOINT ["./entrypoint.sh"]