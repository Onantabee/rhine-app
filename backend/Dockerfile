# Stage 1: Extraction
FROM eclipse-temurin:21-jre-alpine as builder
WORKDIR /app
COPY target/rhine-0.0.1-SNAPSHOT.jar app.jar
RUN java -Djarmode=layertools -jar app.jar extract

# Stage 2: Runtime
FROM eclipse-temurin:21-jre-alpine
WORKDIR /app
COPY --from=builder /app/dependencies/ ./
COPY --from=builder /app/spring-boot-loader/ ./
COPY --from=builder /app/snapshot-dependencies/ ./
COPY --from=builder /app/application/ ./
EXPOSE 8080
ENTRYPOINT java ${JAVA_OPTS} org.springframework.boot.loader.launch.JarLauncher
