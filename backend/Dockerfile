FROM maven:3.9.4-eclipse-temurin-21 AS build
WORKDIR /workspace
COPY pom.xml ./

RUN mvn -e -B dependency:go-offline

COPY src ./src

RUN mvn -e -B -Dmaven.test.skip=true package || \
    (sleep 5 && mvn -e -B -Dmaven.test.skip=true package) || \
    (sleep 10 && mvn -e -B -Dmaven.test.skip=true -Dmaven.wagon.http.retryHandler.count=3 package)

FROM eclipse-temurin:21-jre
WORKDIR /app
COPY --from=build /workspace/target/rhine-0.0.1-SNAPSHOT.jar ./app.jar
EXPOSE 8080
ENTRYPOINT ["java","-jar","/app/app.jar"]
