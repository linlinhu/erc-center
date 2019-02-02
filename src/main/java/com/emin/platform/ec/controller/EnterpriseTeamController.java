package com.emin.platform.ec.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.servlet.ModelAndView;
import org.apache.log4j.Logger;
import com.alibaba.fastjson.JSONObject;
import com.emin.base.controller.BaseController;
import com.emin.base.exception.EminException;
import com.emin.platform.ec.filter.MenuOperationFilter;
import com.emin.platform.ec.interfaces.VolunteerApiFeign;
import com.emin.platform.ec.interfaces.VolunteerTeamApiFeign;
import com.emin.platform.ec.util.HttpSessionHelper;


@Controller
@RequestMapping("/enterprise-team")
public class EnterpriseTeamController extends BaseController {
	private static final Logger LOGGER = Logger.getLogger(EnterpriseTeamController.class);
	@Value("${spring.application.code}")
	private String appCode;
	
	@Autowired
	transient MenuOperationFilter menuOperationFilter;

	@Autowired
	VolunteerApiFeign volunteerApiFeign;//区域管理数据接口实现
	@Autowired
	VolunteerTeamApiFeign volunteerTeamApiFeign;//团体管理数据接口实现
	
	@RequestMapping("/index")
	@ResponseBody
	public ModelAndView index(String name,Long groupId, Integer scope) {
		ModelAndView mv = new ModelAndView("modules/team/enterprise-team/manage");
		JSONObject res = new JSONObject();
		try {
			Integer limit = getPageRequestData().getLimit();
			Integer page = getPageRequestData().getCurrentPage();
			JSONObject queryObj = new JSONObject();
			queryObj.putIfAbsent("groupType", 4);
			queryObj.putIfAbsent("scope", scope);
			String queryParam = queryObj.toJSONString();
			if(limit == 10) {
				limit = 12;
			};
			if(name!=null && name != "") {
				mv.addObject("name", name);
			};
			if(scope!=null) {
				mv.addObject("scope", scope);
			};
			if(groupId!=null) {
				mv.addObject("groupId", groupId);
			};
			res = volunteerTeamApiFeign.getPage(queryParam, page, limit);
		} catch (Exception e) {
			LOGGER.error("加载企业团队主页时报错！错误信息->" + e.getMessage());
			e.printStackTrace();
		}
		
		if(!res.isEmpty()){
			if (!res.getBooleanValue("success")) {
				throw new EminException(res.getString("code"));
			};
			mv.addObject("pages", res.get("result"));
		}
		
		try {
			HttpSessionHelper sessionHelper = HttpSessionHelper.create(this);
			Long userId = sessionHelper.sessionUserId();
			JSONObject params = new JSONObject();
			params.putIfAbsent("userId", userId);
			String operationCodes = menuOperationFilter.menuOperations("volunteer-team", params);
			
			mv.addObject("operationCodes", operationCodes);
		} catch (Exception e) {
			LOGGER.error("加载操作权限时报错！错误信息->" + e.getMessage());
			e.printStackTrace();
		}
		
		return mv;
	}
	
	@RequestMapping("/form")
	@ResponseBody
	public ModelAndView goForm(Integer id,Long groupId,String groupType) {
		ModelAndView mv = new ModelAndView("modules/team/volunteer-team/form");
		if (id != null) {
			JSONObject res = new JSONObject();
			try {
				res = volunteerApiFeign.detail(id);
			} catch (Exception e) {
				LOGGER.error("加载志愿者详情时报错！错误信息->" + e.getMessage());
				e.printStackTrace();
			}
			if(!res.isEmpty()){
				if (!res.getBooleanValue("success")) {
					throw new EminException(res.getString("code"));
				}
				mv.addObject("info", res.get("result"));
			}	
		}
		mv.addObject("groupId",groupId);
		mv.addObject("groupType",groupType);
		mv.addObject("formId","enterprise-team-form");
		return mv;
	}
}
