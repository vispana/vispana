FROM amazoncorretto:21.0.1

RUN mkdir /app

COPY src/ /app/src/
COPY target/vispana-0.0.1-SNAPSHOT.jar /app/target/vispana-0.0.1-SNAPSHOT.jar
#COPY src /app

WORKDIR /app

# Expose the port that your Spring Boot application listens on (default is 8080)
EXPOSE 4000

ENTRYPOINT ["java","--enable-preview", "-jar", "target/vispana-0.0.1-SNAPSHOT.jar"]
