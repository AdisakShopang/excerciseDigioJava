package com.example.springboot;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.jdbc.core.JdbcTemplate;

import java.util.Arrays;
import java.util.List;
import java.util.stream.Collectors;

import java.util.Collections;

@SpringBootApplication
public class RelationalDataAccessApplication implements CommandLineRunner {

  private static final Logger log = LoggerFactory.getLogger(RelationalDataAccessApplication.class);
  public static List<PlayedHistory> rtnDataFromQuery;

  // public static void main(String args[]) {
  //   // SpringApplication.run(RelationalDataAccessApplication.class, args);
  //   SpringApplication app = new SpringApplication(RelationalDataAccessApplication.class);
  //       app.setDefaultProperties(Collections
  //         .singletonMap("server.port", "8083"));
  //       app.run(args);
  // }

  @Autowired
  JdbcTemplate jdbcTemplate;

  @Override
  public void run(String... strings) throws Exception {

    log.info("Creating tables");

    jdbcTemplate.execute("DROP TABLE PlayedHistory IF EXISTS");
    jdbcTemplate.execute("CREATE TABLE PlayedHistory(" +
        "id SERIAL, played_dateTime VARCHAR(255), played_record VARCHAR(255))");

    // Split up the array of whole names into an array of first/last names
    List<Object[]> splitUpData = Arrays.asList("John Woo", "Jeff Dean", "Josh Bloch", "Josh Long").stream()
        .map(data -> data.split(" "))
        .collect(Collectors.toList());

    // Use a Java 8 stream to print out each tuple of the list
    splitUpData.forEach(data -> log.info(String.format("Inserting PlayedHistory record for %s %s", data[0], data[1])));

    // Uses JdbcTemplate's batchUpdate operation to bulk load data
    jdbcTemplate.batchUpdate("INSERT INTO PlayedHistory(played_dateTime, played_record) VALUES (?,?)", splitUpData);

    log.info("Querying for PlayedHistory records where played_dateTime = 'Josh':");
    jdbcTemplate.query(
        // "SELECT id, played_dateTime, played_record FROM PlayedHistory WHERE played_dateTime = ?", new Object[] { "Josh" },
        "SELECT id, played_dateTime, played_record FROM PlayedHistory",
        (rs, rowNum) -> new PlayedHistory(rs.getLong("id"), rs.getString("played_dateTime"), rs.getString("played_record"))
    ).forEach(PlayedHistory -> log.info("Data:" + PlayedHistory.toString()));

    List<PlayedHistory> result = jdbcTemplate.query(
        // "SELECT id, played_dateTime, played_record FROM PlayedHistory WHERE played_dateTime = ?", new Object[] { "Josh" },
        "SELECT id, played_dateTime, played_record FROM PlayedHistory",
        (rs, rowNum) -> new PlayedHistory(rs.getLong("id"), rs.getString("played_dateTime"), rs.getString("played_record"))
    );
    log.info("result : " + String.valueOf(result));
    log.info("result[0] : " + String.valueOf(result.get(0).id));
    log.info("result[0] : " + String.valueOf(result.get(0).playedDateTime));
    log.info("result[0] : " + String.valueOf(result.get(0).playedRecord));

    rtnDataFromQuery = result;
    log.info("rtnDataFromQuery : " + String.valueOf(rtnDataFromQuery));
    log.info("rtnDataFromQuery[0] : " + String.valueOf(rtnDataFromQuery.get(0).id));
    log.info("rtnDataFromQuery[0] : " + String.valueOf(rtnDataFromQuery.get(0).playedDateTime));
    log.info("rtnDataFromQuery[0] : " + String.valueOf(rtnDataFromQuery.get(0).playedRecord));

    log.info("rtnDataFromQuery[0] : " + String.valueOf(rtnDataFromQuery.get(0).getId()));
    log.info("rtnDataFromQuery[0] : " + String.valueOf(rtnDataFromQuery.get(0).getPlayedDateTime()));
    log.info("rtnDataFromQuery[0] : " + String.valueOf(rtnDataFromQuery.get(0).getPlayedRecord()));

  }
}
