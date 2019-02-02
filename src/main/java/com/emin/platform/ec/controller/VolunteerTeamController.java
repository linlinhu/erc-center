package com.emin.platform.ec.controller;

import com.alibaba.fastjson.JSON;
import org.apache.commons.lang3.StringUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.servlet.ModelAndView;

import com.alibaba.fastjson.JSONObject;
import org.apache.log4j.Logger;
import com.emin.base.controller.BaseController;
import com.emin.base.exception.EminException;
import com.emin.platform.ec.filter.MenuOperationFilter;
import com.emin.platform.ec.interfaces.VolunteerApiFeign;
import com.emin.platform.ec.interfaces.VolunteerTeamApiFeign;
import com.emin.platform.ec.util.HttpSessionHelper;

@Controller
@RequestMapping("/volunteer-team")
public class VolunteerTeamController extends BaseController {
	private static final Logger LOGGER = Logger.getLogger(VolunteerTeamController.class);
	
	@Value("${spring.application.code}")
	private String appCode;
	@Autowired
	transient MenuOperationFilter menuOperationFilter;
	@Autowired
	VolunteerApiFeign volunteerApiFeign;//个人管理数据接口实现
	@Autowired
	VolunteerTeamApiFeign volunteerTeamApiFeign;//团体管理数据接口实现
	
	@RequestMapping("/index")
	@ResponseBody
	public ModelAndView index(String name,Long groupId, Integer scope) {
		ModelAndView mv = new ModelAndView("modules/team/volunteer-team/manage");
		JSONObject res = new JSONObject();
		try {
			Integer limit = getPageRequestData().getLimit();
			Integer page = getPageRequestData().getCurrentPage();
			JSONObject queryObj = new JSONObject();
			queryObj.putIfAbsent("groupType", 2);
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
			LOGGER.error("加载社会团队主页时报错！错误信息->" + e.getMessage());
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
	public ModelAndView goForm(Integer id, Long groupId,String groupType) {
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
		mv.addObject("formId","volunteer-team-form");
		return mv;
	}
	
	/**
	 * 保存组信息
	 * @param data 新建或者更新的组信息
	 * @return
	 */
	@RequestMapping("/save")
	@ResponseBody
	public JSONObject save(String data){
		String key = "mixTeamIds";
		JSONObject resJson = JSON.parseObject(data);
		String minxTeamIds = resJson.containsKey(resJson) ? "" : resJson.getString(key);
		if (StringUtils.isBlank(minxTeamIds)) {
			resJson.remove(key);
		}
		resJson = volunteerTeamApiFeign.groupCreateOrUpdate(resJson.toJSONString());
		if (!resJson.getBooleanValue("success")) {
			throw new EminException(resJson.getString("code"));
		};
		return resJson;
    }
	
	/**
	 * 查询组的详情
	 * @param id 组id
	 * @return
	 */
	@RequestMapping("/groupDetail")
	@ResponseBody
	public JSONObject groupDetail(Integer id){
		JSONObject resJson = new JSONObject();
		resJson = volunteerTeamApiFeign.groupDetail(id);
		if (!resJson.getBooleanValue("success")) {
			throw new EminException(resJson.getString("code"));
		};
		JSONObject memberCount = volunteerTeamApiFeign.memberCount(id);
		if (!memberCount.getBooleanValue("success")) {
			throw new EminException(memberCount.getString("code"));
		};
		JSONObject result =  resJson.getJSONObject("result");
		result.put("memberCount", memberCount.getString("result"));
		resJson.put("result", result);
		return resJson;
    }
	
	/**
	 * 删除组（当存在成员时，不能删除）
	 * @param id 被删除的组的id
	 * @return
	 */
	@RequestMapping("/remove")
	@ResponseBody
	public JSONObject remove(Integer id){
		JSONObject resJson = new JSONObject();
		resJson = volunteerTeamApiFeign.groupDelete(id);
		if (!resJson.getBooleanValue("success")) {
			throw new EminException(resJson.getString("code"));
		};
		return resJson;
    }
	
	/**
	 * 查询志愿者
	 * @param groupId 组的id
	 * @param name 志愿者姓名
	 * @return
	 */
	@RequestMapping("/getVolunteers")
	@ResponseBody
	public JSONObject getItems(String groupId,String name){
		JSONObject resJson = new JSONObject();
		JSONObject queryParams = new JSONObject();
		String queryParam = null;
		Integer limit = getPageRequestData().getLimit();
		Integer page = getPageRequestData().getCurrentPage();
		if(limit == 10) {
			limit = 12;
		};
		if(groupId!=null && groupId != "") {
			resJson.put("groupId", groupId);
		} else {
			groupId = null;
		}
		if(name!=null && name != "") {
			resJson.put("name", name);
		} else {
			name = null;
		}
		
		queryParams.putIfAbsent("realName", name);
		queryParams.putIfAbsent("groupId", groupId);
		queryParam = queryParams.toJSONString();
		resJson = volunteerApiFeign.getPage(queryParam, page, limit);
		if (!resJson.getBooleanValue("success")) {
			throw new EminException(resJson.getString("code"));
		}
		resJson = resJson.getJSONObject("result");
		return resJson;
    }
	
	/**
	 * 删除组（当存在成员时，不能删除）
	 * @param id 被删除的组的id
	 * @return
	 */
	@RequestMapping("/changeTeam")
	@ResponseBody
	public JSONObject changeTeam(Integer id, Integer newGroupId){
		JSONObject resJson = new JSONObject();
		resJson = volunteerTeamApiFeign.changeTeam(id, newGroupId);
		if (!resJson.getBooleanValue("success")) {
			throw new EminException(resJson.getString("code"));
		}
		return resJson;
    }
	
	/**
	 * 淘汰团体志愿者
	 * @param id 组的id
	 */
	@RequestMapping("/dismissal")
	@ResponseBody
	public JSONObject dismissal(Integer id){
		JSONObject resJson = new JSONObject();
		resJson = volunteerTeamApiFeign.dismissal(id);
		if (!resJson.getBooleanValue("success")) {
			throw new EminException(resJson.getString("code"));
		}
		return resJson;
    }
	
	/**
	 * 录用团体志愿者
	 * @param id 组的id
	 */
	@RequestMapping("/employment")
	@ResponseBody
	public JSONObject employment(Integer id){
		JSONObject resJson = new JSONObject();
		resJson = volunteerTeamApiFeign.employment(id);
		if (!resJson.getBooleanValue("success")) {
			throw new EminException(resJson.getString("code"));
		}
		return resJson;
    }
}
