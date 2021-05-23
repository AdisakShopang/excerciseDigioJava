package com.example.springboot;

import org.codehaus.jackson.annotate.JsonIgnoreProperties;

import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

@Getter
@Setter
@ToString
@JsonIgnoreProperties(ignoreUnknown = true)
public class PlayedHistory {
    public Long id;
    public String playedDateTime;
    public String playedRecord;

    public PlayedHistory(Long id, String playedDateTime, String playedRecord) {
        this.id = id;
        this.playedDateTime = playedDateTime;
        this.playedRecord = playedRecord;
    }

    @Override
    public String toString() {
        return String.format(
            "PlayedHistory[id=%d, playedDateTime='%s', playedRecord='%s']",
            id, playedDateTime, playedRecord);
    }

    // getter and setter
    public Long getId() {return id;}
    public void setId(Long id) {this.id = id;}

    public String getPlayedDateTime() {return playedDateTime;}
    public void setPlayedDateTime(String input) {this.playedDateTime = input;}

    public String getPlayedRecord() {return playedRecord;}
    public void setPlayedRecord(String input) {this.playedRecord = input;}

    // getters & setters omitted for brevity
}