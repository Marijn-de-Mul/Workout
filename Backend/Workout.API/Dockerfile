FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS base
USER $APP_UID
WORKDIR /app
EXPOSE 8080
EXPOSE 8081

FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
ARG BUILD_CONFIGURATION=Release
WORKDIR /src
COPY ["Workout.API/Workout.API.csproj", "Workout.API/"]
COPY ["Workout.SAL/Workout.SAL.csproj", "Workout.SAL/"]
COPY ["Workout.DAL/Workout.DAL.csproj", "Workout.DAL/"]
RUN dotnet restore "Workout.API/Workout.API.csproj"
COPY . .
WORKDIR "/src/Workout.API"
RUN dotnet build "Workout.API.csproj" -c $BUILD_CONFIGURATION -o /app/build

FROM build AS publish
ARG BUILD_CONFIGURATION=Release
RUN dotnet publish "Workout.API.csproj" -c $BUILD_CONFIGURATION -o /app/publish /p:UseAppHost=false

FROM base AS final
WORKDIR /app
COPY --from=publish /app/publish .
ENTRYPOINT ["dotnet", "Workout.API.dll"]
