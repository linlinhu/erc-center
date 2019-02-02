package com.emin.platform.ec.controller;


import org.apache.log4j.Logger;
import org.apache.poi.ss.formula.functions.Code;
import org.hibernate.validator.group.GroupSequenceProvider;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.servlet.ModelAndView;

import com.alibaba.fastjson.JSONArray;
import com.alibaba.fastjson.JSONObject;
import com.emin.base.controller.BaseController;
import com.emin.base.exception.EminException;

import com.emin.platform.ec.filter.MenuOperationFilter;

import com.emin.platform.ec.util.HttpSessionHelper;
import com.fasterxml.jackson.core.sym.Name;

import net.sf.json.JSONString;

import com.emin.platform.ec.interfaces.DataDicApiFeign;
import com.emin.platform.ec.interfaces.ProfessionalAbilityApiFeign;

@Controller
@RequestMapping("/professional-ability")
public class ProfessionalAbilityController extends BaseController {
	private static final Logger LOGGER = Logger.getLogger(StaffController.class);
	@Value("${spring.application.code}")
	private String appCode;
	
	@Autowired
	transient MenuOperationFilter menuOperationFilter;
	
	@Autowired
	DataDicApiFeign dataDicApiFeign; // 数据字典api
	
	@Autowired
	ProfessionalAbilityApiFeign professionalAbilityApiFeign;

	@RequestMapping("/index")
	public ModelAndView index(String name) {
		ModelAndView mv = new ModelAndView("modules/professional-ability/manage");
		JSONObject res = new JSONObject();
		JSONObject listGroup = new JSONObject();
		try {
			Integer page = getPageRequestData().getCurrentPage();
			Integer limit = getPageRequestData().getLimit();
			JSONObject queryObj = new JSONObject();
			
			if (name != null) {
				mv.addObject("name", name);
				queryObj.putIfAbsent("name", name);
			}
			mv.addObject("limit", limit);
			String queryParam = queryObj.toString();
			res = professionalAbilityApiFeign.queryPage(page, limit, queryParam, "pro-ability-class");
		} catch (Exception e) {
			LOGGER.error("加载工作人员管理主页时报错！错误信息->" + e.getMessage());
    		e.printStackTrace();
		}
		if (!res.isEmpty()) {
			 if (!res.getBooleanValue("success")) {
				throw new EminException(res.getString("code"));
			}
			mv.addObject("pages", res.getJSONObject("result"));
		 }
		
		try {
			listGroup = dataDicApiFeign.listGroup(null, "pro-ability-class");
		} catch (Exception e) {
			LOGGER.error("加载数据字典时报错！错误信息->" + e.getMessage());
    		e.printStackTrace();
		}
		
		 if (!listGroup.isEmpty()) {
			 if (!listGroup.getBooleanValue("success")) {
				throw new EminException(listGroup.getString("code"));
			}
			 JSONArray groupObj = listGroup.getJSONArray("result");
			 JSONObject groupItem = groupObj.getJSONObject(0);
			mv.addObject("groupId", groupItem.getString("id"));
		 }
		try {
			HttpSessionHelper sessionHelper = HttpSessionHelper.create(this);
			Long userId = sessionHelper.sessionUserId();
			JSONObject params = new JSONObject();
			params.putIfAbsent("userId", userId);
			String operationCodes = menuOperationFilter.menuOperations("staff", params);
			
			mv.addObject("operationCodes", operationCodes);
		} catch (Exception e) {
			LOGGER.error("获取操作权限数据时报错！错误信息->" + e.getMessage());
    		e.printStackTrace();
		}
		
		return mv;
	}

	@RequestMapping("/save")
	@ResponseBody
	public JSONObject save(String data){
		JSONObject resJson = new JSONObject();
		resJson = dataDicApiFeign.saveItem(data);
		if(!resJson.getBoolean("success")){
			throw new EminException(resJson.getString("code"));
		}
		return resJson;
    }

	@RequestMapping("/remove")
	@ResponseBody
	public JSONObject remove(Integer id) {
		JSONObject res = dataDicApiFeign.delItem(id);
		if (!res.getBooleanValue("success")) {
			throw new EminException(res.getString("code"));
		}
		return res;
	}
	
	@RequestMapping("/queryProAbilityClassPage")
	@ResponseBody
	public JSONObject queryProAbilityClassPage(String code) {
		Integer page = getPageRequestData().getCurrentPage();
		Integer limit = getPageRequestData().getLimit();
		JSONObject queryObj = new JSONObject();
		queryObj.putIfAbsent("code", code);
		String queryParam = queryObj.toString();
		JSONObject res = professionalAbilityApiFeign.queryProAbilityClassPage(page, limit, queryParam);
		if (!res.getBooleanValue("success")) {
			throw new EminException(res.getString("code"));
		}
		return res.getJSONObject("result");
	}
}
