FROM amazoncorretto:21.0.1
WORKDIR /app

# As github actions lacks support for Java 21, let's send all files and use Docker to build the
# image and run it
COPY ./ .

RUN mvn spring-boot:run

# Expose the port that your Spring Boot application listens on (default is 8080)
EXPOSE 4000
