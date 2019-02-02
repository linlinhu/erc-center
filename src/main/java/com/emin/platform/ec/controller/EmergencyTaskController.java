package com.emin.platform.ec.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.servlet.ModelAndView;

import com.alibaba.fastjson.JSONObject;
import com.emin.base.controller.BaseController;

@Controller
@RequestMapping("/emergency-task")
public class EmergencyTaskController extends BaseController {

	
	@RequestMapping("/index")
	@ResponseBody
	public ModelAndView index(String name, String code) {
		ModelAndView mv = new ModelAndView("modules/emergency-task/manage");
		return mv;
	}
	
	@RequestMapping("/form")
	@ResponseBody
	public ModelAndView goForm(Integer id) {
		ModelAndView mv = new ModelAndView("modules/emergency-task/form");
		return mv;
	}
	
	@RequestMapping("/save")
	@ResponseBody
	public JSONObject save(String data){
		JSONObject resJson = new JSONObject();
		return resJson;
    }
	
	@RequestMapping("/remove")
	@ResponseBody
	public JSONObject remove(Integer id){
		JSONObject resJson = new JSONObject();
		return resJson;
    }
	
	



}
