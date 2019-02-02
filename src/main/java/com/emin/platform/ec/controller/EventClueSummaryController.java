package com.emin.platform.ec.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.servlet.ModelAndView;

import com.emin.base.controller.BaseController;


@Controller
@RequestMapping("/event-clue-summary")
public class EventClueSummaryController extends BaseController {

	@RequestMapping("/index")
	@ResponseBody
	public ModelAndView index(String name, String code) {
		ModelAndView mv = new ModelAndView("modules/event-clue/event-clue-summary/manage");
		
		return mv;
	}	
}
