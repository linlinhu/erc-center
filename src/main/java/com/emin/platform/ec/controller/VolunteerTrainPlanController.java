package com.emin.platform.ec.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.servlet.ModelAndView;

import com.emin.base.controller.BaseController;


@Controller
@RequestMapping("/volunteer-train-plan")
public class VolunteerTrainPlanController extends BaseController {

	@RequestMapping("/index")
	@ResponseBody
	public ModelAndView index(String name, String code) {
		ModelAndView mv = new ModelAndView("modules/volunteer-train/volunteer-train-plan/manage");
		return mv;
	}	
}