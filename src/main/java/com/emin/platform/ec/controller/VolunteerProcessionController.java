package com.emin.platform.ec.controller;

import org.apache.log4j.Logger;
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
import com.emin.platform.ec.interfaces.VolunteerApiFeign;
import com.emin.platform.ec.interfaces.VolunteerProcessionApiFeign;
import com.emin.platform.ec.interfaces.VolunteerTeamApiFeign;
import com.emin.platform.ec.util.HttpSessionHelper;

/**
 * 志愿者队伍控制层
 * @author 李丹
 *
 */
@Controller
@RequestMapping("/volunteer-procession")
public class VolunteerProcessionController extends BaseController {
	private static final Logger LOGGER = Logger.getLogger(VolunteerProcessionController.class);

	@Autowired
	VolunteerProcessionApiFeign volunteerProcessionApiFeign; // 志愿者队伍api
	@Autowired
	VolunteerTeamApiFeign volunteerTeamApiFeign; // 志愿者团队api
	@Autowired
	VolunteerApiFeign volunteerApiFeign; // 志愿者api
	@Value("${spring.application.code}")
	private String appCode;
	@Autowired
	transient MenuOperationFilter menuOperationFilter;
	
	/**
	 * 主页跳转
	 * @param keyword
	 * @return
	 */
	@RequestMapping("/index")
	@ResponseBody
	public ModelAndView index(String keyword) {
		ModelAndView mv = new ModelAndView("modules/volunteer-procession/manage");
		String operationCodes = null;
		try {
		HttpSessionHelper sessionHelper = HttpSessionHelper.create(this);
		Long userId = sessionHelper.sessionUserId();
		JSONObject params = new JSONObject();
		params.putIfAbsent("userId", userId);
		operationCodes = menuOperationFilter.menuOperations("volunteer-procession", params);
		} catch (Exception e) {
			LOGGER.error("应急队伍管理主页加载【查询模块权限】报错！错误信息->" + e.getMessage());
        	e.printStackTrace();
		}
		
		if (operationCodes != null) {
			mv.addObject("operationCodes", operationCodes);
		}
		return mv;
	}

	/**
	 * 分页查询
	 * @param name 关键字魔化查询
	 * @param gridId 网格编号
	 * @return
	 */
	@RequestMapping("/getPages")
	@ResponseBody
	public JSONObject getPages(String name, Long gridId) {
		JSONObject apiResponse = new JSONObject();
		
		JSONObject queryParam = null;
				
		if (name != null || gridId != null) {
			queryParam = new JSONObject();
		}
		if (name != null) {
			queryParam.put("name", name);
		}
		if (gridId != null) {
			queryParam.put("gridId", gridId);
		}
		
		Integer limit = getPageRequestData().getLimit();
		Integer page = getPageRequestData().getCurrentPage();
		
		apiResponse = volunteerProcessionApiFeign.getPage(queryParam != null ? JSONObject.toJSONString(queryParam) : null, page, limit);
		if (!apiResponse.getBooleanValue("success")) {
			throw new EminException(apiResponse.getString("code"));
		}
		
		return apiResponse.getJSONObject("result");
	}
	/**
	 * 查询队伍网格聚合列表
	 * @param keyword 关键字
	 * @return
	 */
	@RequestMapping("gridAggregation")
	@ResponseBody
	public JSONArray GridAggregation(String keyword){
		JSONObject apiResponse = new JSONObject();
		
		JSONObject queryParam = new JSONObject();
		queryParam.put("keyword", keyword);
		
		apiResponse = volunteerProcessionApiFeign.getGridAggregation(JSONObject.toJSONString(queryParam));
		if (!apiResponse.getBooleanValue("success")) {
			throw new EminException(apiResponse.getString("code"));
		}
		
		return apiResponse.getJSONArray("result");
    }
	/**
	 * 志愿者队伍与详情
	 * @param id 编号
	 * @return
	 */
	@RequestMapping("/detail")
	@ResponseBody
	public JSONObject detail(Integer id) {
		JSONObject apiResponse = new JSONObject();
		
		apiResponse = volunteerProcessionApiFeign.detail(id);
		if (!apiResponse.getBooleanValue("success")) {
			throw new EminException(apiResponse.getString("code"));
		}
		
		return apiResponse.getJSONObject("result");
	}
	
	/**
	 * 保存
	 * @param data 志愿者实体信息字符串
	 * @return
	 */
	@RequestMapping("/save")
	@ResponseBody
	public JSONObject save(String data){
		JSONObject apiResponse = new JSONObject();
		
		apiResponse = volunteerProcessionApiFeign.save(data);
		if (!apiResponse.getBooleanValue("success")) {
			throw new EminException(apiResponse.getString("code"));
		}
		
		return apiResponse;
    }
	/**
	 * 删除
	 * @param id 志愿者队伍编号
	 * @return
	 */
	@RequestMapping("/remove")
	@ResponseBody
	public JSONObject remove(Integer id){
		JSONObject apiResponse = new JSONObject();
		
		apiResponse = volunteerProcessionApiFeign.dismiss(id);
		if (!apiResponse.getBooleanValue("success")) {
			throw new EminException(apiResponse.getString("code"));
		}
		
		return apiResponse;
    }
	
	/**
	 * 分页查询志愿者队伍关联团队列表
	 * @param mixTeamId 队伍编号
	 * @param groupType 团队类型
	 * @param keyword 关键字模糊查询
	 * @return
	 */
	@RequestMapping("/getTeamPage")
	@ResponseBody
	public JSONObject getTeamPage(Integer mixTeamId, Integer groupType, String keyword) {
		JSONObject apiResponse = new JSONObject();
		JSONObject queryParam = new JSONObject();;

		queryParam.put("mixTeamId", mixTeamId);
		if (groupType != null) {
			queryParam.put("groupType", groupType);
		}
		
		if (keyword != null) {
			queryParam.put("groupName", keyword);
		}
		
		
		Integer limit = getPageRequestData().getLimit();
		Integer page = getPageRequestData().getCurrentPage();
		
		apiResponse = volunteerProcessionApiFeign.getTeamPage(!queryParam.isEmpty() ? JSONObject.toJSONString(queryParam) : null, page, limit);
		if (!apiResponse.getBooleanValue("success")) {
			throw new EminException(apiResponse.getString("code"));
		}
		
		return apiResponse.getJSONObject("result");
	}
	/**
	 * 分页查询应急队伍关联志愿者列表
	 * @param mixTeamId 队伍编号
	 * @param keyword 关键字模糊查询
	 * @return
	 */
	@RequestMapping("/getVolunteersPage")
	@ResponseBody
	public JSONObject getVolunteersPage(Integer mixTeamId, String keyword) {
		JSONObject apiResponse = new JSONObject();
		
		JSONObject queryParam = new JSONObject();;

		queryParam.put("mixTeamId", mixTeamId);
		if (keyword != null) {
			queryParam.put("realName", keyword);
		}
		
		Integer limit = getPageRequestData().getLimit();
		Integer page = getPageRequestData().getCurrentPage();
		
		apiResponse = volunteerProcessionApiFeign.getVolunteersPage(!queryParam.isEmpty() ? JSONObject.toJSONString(queryParam) : null, page, limit);
		if (!apiResponse.getBooleanValue("success")) {
			throw new EminException(apiResponse.getString("code"));
		}
		
		return apiResponse.getJSONObject("result");
	}
	/**
	 * 批量关联团队或删除团队
	 * @param vpId 应急队伍编号
	 * @param relateIds 关联团队编号
	 * @param removeIds 移除团队关联编号
	 * @return
	 */
	@RequestMapping("/batchHandlerGroup")
	@ResponseBody
	public JSONObject batchHandlerGroup(Integer vpId, String relateIds, String removeIds) {
		JSONObject apiResponse = new JSONObject();
		
		apiResponse = volunteerProcessionApiFeign.batchHandlerGroup(vpId, relateIds, removeIds);
		if (!apiResponse.getBooleanValue("success")) {
			throw new EminException(apiResponse.getString("code"));
		}
		
		return apiResponse;
	}
	
	/**
	 * 批量关联志愿者或删除志愿者
	 * @param vpId 应急队伍编号
	 * @param relateIds 关联志愿者编号
	 * @param removeIds 移除志愿者关联编号
	 * @return
	 */
	@RequestMapping("/batchHandlerHashVolunteer")
	@ResponseBody
	public JSONObject batchHandlerHashVolunteer(Integer vpId, String relateIds, String removeIds) {
		JSONObject apiResponse = new JSONObject();
		
		apiResponse = volunteerProcessionApiFeign.batchHandlerHashVolunteer(vpId, relateIds, removeIds);
		if (!apiResponse.getBooleanValue("success")) {
			throw new EminException(apiResponse.getString("code"));
		}
		
		return apiResponse;
	}
	
	/**
	 * 分页获取自由可关联团队列表
	 * @param mixTeamId 应急团队编号
	 * @param groupType 团队类型
	 * @param keyword 关键字模糊查询
	 * @param isFilterMixTeam 是否过滤掉当前应急团队
	 * @return
	 */
	@RequestMapping("/getFreeTeamPage")
	@ResponseBody
	public JSONObject getFreeTeamPage(Integer mixTeamId, Integer groupType, String keyword, String isFilterMixTeam) {
		JSONObject apiResponse = new JSONObject();
		JSONObject queryParam = new JSONObject();;

		queryParam.put("mixTeamId", mixTeamId);
		
		if (groupType != null) {
			queryParam.put("groupType", groupType);
		}
		
		if (keyword != null) {
			queryParam.put("groupName", keyword);
		}
		
		queryParam.put("isFilterMixTeam", true);
		
		
		Integer limit = getPageRequestData().getLimit();
		Integer page = getPageRequestData().getCurrentPage();
		
		apiResponse = volunteerTeamApiFeign.getPage(!queryParam.isEmpty() ? JSONObject.toJSONString(queryParam) : null, page, limit);
		if (!apiResponse.getBooleanValue("success")) {
			throw new EminException(apiResponse.getString("code"));
		}
		
		return apiResponse.getJSONObject("result");
	}
	
	/**
	 * 分页获取自由可关联志愿者列表
	 * @param mixTeamId 应急团队编号
	 * @param keyword 关键字模糊查询
	 * @param isFilterMixTeam 是否过滤掉当前应急团队
	 * @return
	 */
	@RequestMapping("/getFreeVolunteersPage")
	@ResponseBody
	public JSONObject getFreeVolunteersPage(Integer mixTeamId, String keyword, String isFilterMixTeam) {
		JSONObject apiResponse = new JSONObject();
		JSONObject queryParam = new JSONObject();;

		queryParam.put("mixTeamId", mixTeamId);
		
		if (keyword != null) {
			queryParam.put("realName", keyword);
		}
		
		queryParam.put("isFilterMixTeam", true);
		queryParam.put("groupType", "-1");
		
		
		Integer limit = getPageRequestData().getLimit();
		Integer page = getPageRequestData().getCurrentPage();
		
		System.out.println(JSONObject.toJSONString(queryParam));
		apiResponse = volunteerApiFeign.getPage(!queryParam.isEmpty() ? JSONObject.toJSONString(queryParam) : null, page, limit);
		if (!apiResponse.getBooleanValue("success")) {
			throw new EminException(apiResponse.getString("code"));
		}
		
		return apiResponse.getJSONObject("result");
	}
	
	/**
	 * 设置领队
	 * @param data
	 * @return
	 */
	@RequestMapping("/relateLeader")
	@ResponseBody
	public JSONObject relateLeader(String data){
		JSONObject apiResponse = new JSONObject();
		
		apiResponse = volunteerProcessionApiFeign.relateLeader(data);
		if (!apiResponse.getBooleanValue("success")) {
			throw new EminException(apiResponse.getString("code"));
		}
		
		return apiResponse;
    }
	
	@RequestMapping("/removeLeader")
	@ResponseBody
	public JSONObject removeLeader(Integer id){
		JSONObject apiResponse = new JSONObject();
		
		apiResponse = volunteerProcessionApiFeign.removeLeader(id);
		if (!apiResponse.getBooleanValue("success")) {
			throw new EminException(apiResponse.getString("code"));
		}
		
		return apiResponse;
    }
	/**
	 * 批量设置领队
	 * @param data
	 * @return
	 */
	@RequestMapping("/relateLeaders")
	@ResponseBody
	public JSONObject relateLeaders(String data){
		JSONObject apiResponse = new JSONObject();
		
		apiResponse = volunteerProcessionApiFeign.relateLeaders(data);
		if (!apiResponse.getBooleanValue("success")) {
			throw new EminException(apiResponse.getString("code"));
		}
		
		return apiResponse;
    }
	
	/**
	 * 移动关联团队至心的应急队伍
	 * @param vpId 当前应急队伍id
	 * @param exchangeId 新的应急队伍编号
	 * @param ids 关联团队编号，多个用逗号分隔
	 * @return
	 */
	@RequestMapping("/exchangeTeams")
	@ResponseBody
	public JSONObject exchangeTeams(Integer vpId, Integer exchangeId, String ids){
		JSONObject apiResponse = new JSONObject();
		
		apiResponse = volunteerProcessionApiFeign.exchangeTeams(vpId, exchangeId, ids);
		if (!apiResponse.getBooleanValue("success")) {
			throw new EminException(apiResponse.getString("code"));
		}
		
		return apiResponse;
    }
	/**
	 * 移动关联志愿者至新的应急队伍
	 * @param vpId 当前应急队伍id
	 * @param exchangeId 新的应急队伍编号
	 * @param ids 关联志愿者编号，多个用逗号分隔
	 * @return
	 */
	@RequestMapping("/exchangeVolunteers")
	@ResponseBody
	public JSONObject exchangeVolunteers(Integer vpId, Integer exchangeId, String ids){
		JSONObject apiResponse = new JSONObject();
		
		apiResponse = volunteerProcessionApiFeign.exchageVolunteers(vpId, exchangeId, ids);
		if (!apiResponse.getBooleanValue("success")) {
			throw new EminException(apiResponse.getString("code"));
		}
		
		return apiResponse;
    }
}
