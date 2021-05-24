package com.example.springboot.classes;

import org.codehaus.jackson.annotate.JsonIgnoreProperties;
import org.springframework.stereotype.Service;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.boot.context.properties.EnableConfigurationProperties;

@Service
@EnableConfigurationProperties(PlayedRecord.class)
@ConfigurationProperties("service")
@JsonIgnoreProperties(ignoreUnknown = true)
public class PlayedRecord {
    public String record;
    public String datetime;

    // constructor
    public PlayedRecord(String record) {
        this.record = record;
        this.datetime = "";
    }
    public PlayedRecord(String record,String datetime) {
        this.record = record;
        this.datetime = datetime;
    }
    public PlayedRecord() {
        this.record = "default";
        this.datetime = "default";
    }

    @Override
    public String toString() {
        return String.format(
            "PlayedRecord[record='%s', datetime='%s']",
            record, datetime);
    }

    // getter and setter
    public String getRecord() {return record;}
    public void setRecord(String input) {this.record = input;}

    public String getDatetime() {return datetime;}
    public void setDatetime(String input) {this.datetime = input;}

}
