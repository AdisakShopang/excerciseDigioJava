package com.example.springboot;

import java.beans.Transient;

// import com.sun.tools.sjavac.Log;

import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;

@Controller
public class HelloController {

	@GetMapping("/xo")
	public String greeting(Model model,
		@RequestParam(name="name", required=false, defaultValue="World") String name, 
		@RequestParam(name="historyPlayed", required=false, defaultValue="empty") String historyPlayed) {
		model.addAttribute("name", name);
		// model.addAttribute("historyPlayed", RelationalDataAccessApplication.rtnDataFromQuery);
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
		Log.info("getSearchResultViaAjax");
		return String.valueOf(historyPlay); 
	}
	
}