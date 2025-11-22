# 1. runtime base image
FROM mcr.microsoft.com/dotnet/aspnet:10.0 AS base
WORKDIR /app
EXPOSE 80

# 2. build image
FROM mcr.microsoft.com/dotnet/sdk:10.0 AS build
WORKDIR /src

# copy csproj สองโปรเจกต์ก่อน (เพื่อ cache ได้ดี)
COPY ["api/api.xraycare/api.xraycare.csproj", "api/api.xraycare/"]
COPY ["database/db.xraycare/db.xraycare.csproj", "database/db.xraycare/"]

# restore จากโปรเจกต์ API (มันจะดึงของ db.xraycare มาด้วยเพราะมี ProjectReference)
RUN dotnet restore "api/api.xraycare/api.xraycare.csproj"

# copy source ที่เหลือทั้งหมด
COPY . .

# build
RUN dotnet build "api/api.xraycare/api.xraycare.csproj" -c Release -o /app/build

# 3. publish
FROM build AS publish
RUN dotnet publish "api/api.xraycare/api.xraycare.csproj" -c Release -o /app/publish

# 4. final image
FROM base AS final
WORKDIR /app
COPY --from=publish /app/publish .

ENTRYPOINT ["dotnet", "api.xraycare.dll"]
