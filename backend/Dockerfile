# Stage 1: Build the application using Google Cloud Maven Mirror (prevents 429 rate limits)
FROM maven:3.9.6-eclipse-temurin-21 AS build
WORKDIR /app
COPY .mvn ./.mvn
COPY pom.xml .
COPY src ./src
RUN mvn clean package -s .mvn/settings.xml -DskipTests

# Stage 2: Run the lightweight application
FROM eclipse-temurin:21-jre-alpine
WORKDIR /app
COPY --from=build /app/target/*.jar app.jar
EXPOSE 8080
ENV PORT=8080
ENTRYPOINT ["java", "-jar", "app.jar"]
