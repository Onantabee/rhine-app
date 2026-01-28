FROM maven:3.9.4-eclipse-temurin-21 AS build
WORKDIR /workspace
COPY pom.xml ./
COPY src ./src
# Add retry logic and SSL workaround for Maven Central connectivity issues
RUN mvn -e -B -Dmaven.test.skip=true package || \
    (sleep 5 && mvn -e -B -Dmaven.test.skip=true package) || \
    (sleep 10 && mvn -e -B -Dmaven.test.skip=true -Dmaven.wagon.http.retryHandler.count=3 package)

FROM eclipse-temurin:21-jre
WORKDIR /app
COPY --from=build /workspace/target/rhine-0.0.1-SNAPSHOT.jar ./app.jar
EXPOSE 8080
ENTRYPOINT ["java","-jar","/app/app.jar"]
