# Dockerfile for Spring Boot App (Standard JAR build)

# --- Build Stage ---
# Use a standard JDK image for building the application
FROM eclipse-temurin:21-jdk-jammy AS builder

# Set the working directory
WORKDIR /app

# Copy the Gradle wrapper and build files
COPY build.gradle.kts settings.gradle.kts gradlew ./
COPY gradle ./gradle
COPY src ./src

# Grant execute permission to the gradlew script
RUN chmod +x ./gradlew

# Build the application and create the JAR, skipping tests
# Using --no-daemon is recommended for CI/CD environments
RUN ./gradlew build -x test --no-daemon

# --- Final Image Stage ---
# Use a smaller JRE image for the final container
FROM eclipse-temurin:21-jre-jammy

# Set the working directory
WORKDIR /app

# Expose the port the app will run on
EXPOSE 9000

# Copy the JAR from the builder stage. Using a wildcard is safer
# in case the version number is part of the JAR name.
COPY --from=builder /app/build/libs/*.jar app.jar

# Set the entrypoint to run the application
ENTRYPOINT ["java", "-jar", "app.jar"]
