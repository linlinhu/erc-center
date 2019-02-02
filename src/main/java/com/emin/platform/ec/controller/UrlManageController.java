package com.emin.platform.ec.controller;


import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.servlet.ModelAndView;

import com.alibaba.fastjson.JSONObject;
import com.emin.base.controller.BaseController;
import com.emin.base.exception.EminException;

import com.emin.platform.ec.filter.MenuOperationFilter;

import com.emin.platform.ec.util.HttpSessionHelper;


@Controller
@RequestMapping("/url-manage")
public class UrlManageController extends BaseController {

	@Value("${spring.application.code}")
	private String appCode;
	
	@Autowired
	transient MenuOperationFilter menuOperationFilter;

	@RequestMapping("/index")
	public ModelAndView index(String keyword, Long orgId, String orgName, Long id) {
		ModelAndView mv = new ModelAndView("modules/url-manage/manage");
		return mv;
	}
}
