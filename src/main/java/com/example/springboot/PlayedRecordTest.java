package com.example.springboot;

import org.codehaus.jackson.annotate.JsonIgnoreProperties;

@JsonIgnoreProperties(ignoreUnknown = true)
public class PlayedRecordTest {
    public String record;
    public String datetime;

    // constructor
    public PlayedRecordTest(String record) {
        this.record = record;
        this.datetime = "";
    }
    public PlayedRecordTest(String record,String datetime) {
        this.record = record;
        this.datetime = datetime;
    }
    public PlayedRecordTest() {
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
