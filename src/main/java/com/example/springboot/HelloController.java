package com.example.springboot;

import java.beans.Transient;
import java.text.ParseException;
import java.util.List;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;

import javax.servlet.http.HttpServletRequest;
import java.io.IOException;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;

import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;

@Controller
public class HelloController {

	private static final Logger log = LoggerFactory.getLogger(RelationalDataAccessApplication.class);
	public static List<PlayedRecord> rtnDataFromQuery;

	@GetMapping("/xo")
	public String greeting(Model model,
		@RequestParam(name="name", required=false, defaultValue="World") String name, 
		@RequestParam(name="historyPlayed", required=false, defaultValue="empty") String historyPlayed) {
		model.addAttribute("name", name);
		model.addAttribute("historyPlayed", rtnDataFromQuery);
		return "index";
	}

	// @CrossOrigin(origins = "http://localhost:8080")
	// @PostMapping(path =  "/historyPlayed")
	// public String Test(@RequestParam("paramName") String param, @RequestBody String test) {
	// 	return String.valueOf(test);
	// }
	
	@Transient
	@ResponseBody 
	@RequestMapping(value = "/SendHistoryPlay/{historyPlay}")
	public String getSearchResultViaAjax(@PathVariable(value = "historyPlay") String historyPlay) { 
		// Log.info("getSearchResultViaAjax");
		return String.valueOf(historyPlay); 
	}

	@RequestMapping(value = "/addHistoryData", method = RequestMethod.POST)
    public @ResponseBody
    PlayedRecord[] addHistoryDatan(@RequestBody PlayedRecord[] data) throws ParseException, IOException {
			// Log.info("Adding new person");
			// Log.info(String.valueOf(data));

			// PlayedHistory rtnData = data = "help me plz";
			
			// Long field1 = data.getId();
			// String field2 = data.getPlayedDateTime();
			// String field3 = data.getPlayedRecord();
			// String rtnData = String.valueOf(field1) + "/" + field2 + "/" + field3;

			// PlayedHistory rtnData = new PlayedHistory(Long.valueOf(0),"test1","test2");

			// PlayedRecord[] rtnData = data;
			List<PlayedRecord> rtnDataList = insertPlayedRecord(data);
			log.info("rtnDataList : " + String.valueOf(rtnDataList));
			PlayedRecord[] rtnData = new PlayedRecord[rtnDataList.size()];
			rtnData = rtnDataList.toArray(rtnData);
			for(PlayedRecord each : rtnData){
				log.info("each : " + String.valueOf(each));
			}
			
        try {
           	// perform add operation
			// String rtnTxt = "Successfully added data. ";
            // return rtnTxt.concat(String.valueOf(rtnData));
			return (rtnData);

        } catch (Exception ex) {
            // error case
			// String rtnTxt = "Error added data. ";
            // return rtnTxt.concat(String.valueOf(rtnData));
			return (rtnData);
        }

    }
	
	@Autowired
  	JdbcTemplate jdbcTemplate;

	public List<PlayedRecord> insertPlayedRecord(PlayedRecord[] input){

		jdbcTemplate.execute("DROP TABLE PlayedRecordTable IF EXISTS");
		log.info("!!! DONE DROP TABLE !!!");
		jdbcTemplate.execute("CREATE TABLE PlayedRecordTable(" + "id SERIAL, played_record VARCHAR(1000), created_at VARCHAR(100)) ");
		log.info("!!! DONE CREATE TABLE !!!");
		
		String allValue = "";
		for(Integer index = 0 ; index < input.length; index++){
			allValue += input[index].getRecord();
			if(index != input.length -1){
				allValue += "//";
			}
		}
		DateTimeFormatter forrmatter = DateTimeFormatter.ofPattern("dd-MM-yyyy HH:mm:ss");
		String formattedDateTime = LocalDateTime.now().format(forrmatter);
		log.info("allValue:"+allValue);
		log.info("formattedDateTime:"+formattedDateTime);
		jdbcTemplate.update("INSERT INTO PlayedRecordTable(played_record, created_at) VALUES ('" + allValue + "','" + formattedDateTime + "')");
		// jdbcTemplate.update("INSERT INTO PlayedRecordTable(played_record) VALUES (" + "'TEST'" + ")");
		log.info("!!! DONE INSERT TABLE !!!");

		List<PlayedRecord> result = jdbcTemplate.query(
			"SELECT id, played_record, created_at FROM PlayedRecordTable",
			(rs, rowNum) -> new PlayedRecord(rs.getString("played_record"), rs.getString("created_at"))
    	);/*.forEach(PlayedRecord -> 
			log.info("Data:" + PlayedRecord.toString())
		);*/

		rtnDataFromQuery = result;
		log.info("result : " + String.valueOf(result));
		log.info("rtnDataFromQuery : " + String.valueOf(rtnDataFromQuery));
		
		return result;
	  }
	
}