package com.emin.platform.ec.controller;

import org.apache.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;
import com.alibaba.fastjson.JSONObject;
import com.emin.base.controller.BaseController;
import com.emin.base.exception.EminException;
import com.emin.platform.ec.interfaces.TempProcessionApiFeign;
import com.emin.platform.ec.interfaces.VolunteerApiFeign;
import com.emin.platform.ec.interfaces.VolunteerTeamApiFeign;

/**
 * 志愿者队伍控制层
 * @author 李丹
 *
 */
@Controller
@RequestMapping("/temp-procession")
public class TempProcessionController extends BaseController {
	private static final Logger LOGGER = Logger.getLogger(TempProcessionController.class);
	@Autowired
	VolunteerApiFeign volunteerApiFeign; // 志愿者api
	@Autowired
	VolunteerTeamApiFeign volunteerTeamApiFeign; // 志愿者团队api
	@Autowired
	TempProcessionApiFeign tempProcessionApiFeign; // 临时应急队伍api
	
	@RequestMapping("/detail")
	@ResponseBody
	public JSONObject detail(Integer id) {
		JSONObject apiResponse = new JSONObject();
		apiResponse = tempProcessionApiFeign.detail(id);
		if (!apiResponse.getBooleanValue("success")) {
			throw new EminException(apiResponse.getString("code"));
		}
		return apiResponse;
	}
	
	/**
	 * 保存临时团队
	 * @param data
	 * @return
	 */
	@RequestMapping("/save")
	@ResponseBody
	public JSONObject save(String data) {
		JSONObject apiResponse = new JSONObject();
		apiResponse = tempProcessionApiFeign.save(data);
		if (!apiResponse.getBooleanValue("success")) {
			throw new EminException(apiResponse.getString("code"));
		}
		return apiResponse;
	}
	/**
	 * 查询关联志愿者团队
	 * @return
	 */
	@RequestMapping("/getRelateTeams")
	@ResponseBody
	public JSONObject getRelateTeams(Integer tempMixTeamId, String keyword, Integer groupType) {
		JSONObject apiResponse = new JSONObject();
		JSONObject queryParam = new JSONObject();;

		queryParam.put("tempMixTeamId", tempMixTeamId);
		
		if (keyword != null) {
			queryParam.put("groupName", keyword);
		}
		
		queryParam.put("groupType", groupType);
		Integer limit = getPageRequestData().getLimit();
		Integer page = getPageRequestData().getCurrentPage();
		LOGGER.info("临时队伍创建查询关联志愿者团队 -> 参数传递 -> " + JSONObject.toJSONString(queryParam));
		apiResponse = tempProcessionApiFeign.getTeamPage(!queryParam.isEmpty() ? JSONObject.toJSONString(queryParam) : null, page, limit);
		if (!apiResponse.getBooleanValue("success")) {
			throw new EminException(apiResponse.getString("code"));
		}
		return apiResponse;
	}
	/**
	 * 查询关联志愿者
	 * @return
	 */
	@RequestMapping("/getRelateVolunteers")
	@ResponseBody
	public JSONObject getRelateVolunteers(Integer tempMixTeamId, String keyword) {
		JSONObject apiResponse = new JSONObject();
		JSONObject queryParam = new JSONObject();;

		queryParam.put("tempMixTeamId", tempMixTeamId);
		
		if (keyword != null) {
			queryParam.put("realName", keyword);
		}
		
		Integer limit = getPageRequestData().getLimit();
		Integer page = getPageRequestData().getCurrentPage();
		LOGGER.info("临时队伍创建查询关联志愿者 -> 参数传递 -> " + JSONObject.toJSONString(queryParam));
		apiResponse = tempProcessionApiFeign.getVolunteersPage(!queryParam.isEmpty() ? JSONObject.toJSONString(queryParam) : null, page, limit);
		if (!apiResponse.getBooleanValue("success")) {
			throw new EminException(apiResponse.getString("code"));
		}
		return apiResponse;
	}
	/**
	 * 查询自由可选志愿者团队
	 * @return
	 */
	@RequestMapping("/getFreeTeams")
	@ResponseBody
	public JSONObject getFreeTeams(Integer tempMixTeamId, String keyword, Integer groupType) {
		JSONObject apiResponse = new JSONObject();
		JSONObject queryParam = new JSONObject();;

		queryParam.put("tempMixTeamId", tempMixTeamId);
		
		if (keyword != null) {
			queryParam.put("groupName", keyword);
		}
		
		queryParam.put("isFilterTempMixTeam", true);
		queryParam.put("groupType", groupType);
		Integer limit = getPageRequestData().getLimit();
		Integer page = getPageRequestData().getCurrentPage();
		
		LOGGER.info("临时队伍创建查询自由可选志愿者团队 -> 参数传递 -> " + JSONObject.toJSONString(queryParam));
		apiResponse = volunteerTeamApiFeign.getPage(!queryParam.isEmpty() ? JSONObject.toJSONString(queryParam) : null, page, limit);
		if (!apiResponse.getBooleanValue("success")) {
			throw new EminException(apiResponse.getString("code"));
		}
		return apiResponse;
	}
	/**
	 * 查询自由可选志愿者
	 * @return
	 */
	@RequestMapping("/getFreeVolunteers")
	@ResponseBody
	public JSONObject getFreeVolunteers(Integer tempMixTeamId, String keyword) {
		JSONObject apiResponse = new JSONObject();
		JSONObject queryParam = new JSONObject();;

		queryParam.put("tempMixTeamId", tempMixTeamId);
		
		if (keyword != null) {
			queryParam.put("realName", keyword);
		}
		
		queryParam.put("isFilterTempMixTeam", true);
		queryParam.put("groupType", "-1");
		Integer limit = getPageRequestData().getLimit();
		Integer page = getPageRequestData().getCurrentPage();
		
		LOGGER.info("临时队伍创建查询自由可选志愿者 -> 参数传递 -> " + JSONObject.toJSONString(queryParam));
		apiResponse = volunteerApiFeign.getPage(!queryParam.isEmpty() ? JSONObject.toJSONString(queryParam) : null, page, limit);
		if (!apiResponse.getBooleanValue("success")) {
			throw new EminException(apiResponse.getString("code"));
		}
		return apiResponse;
	}

	@RequestMapping("/batchAssign")
	@ResponseBody
	public JSONObject batchAssign(String data) {
		JSONObject apiResponse = new JSONObject();;
		
		apiResponse = tempProcessionApiFeign.batchAssign(data);
		if (!apiResponse.getBooleanValue("success")) {
			throw new EminException(apiResponse.getString("code"));
		}
		return apiResponse;
	}

	@RequestMapping("/removeRelateTeams")
	@ResponseBody
	public JSONObject removeRelateTeams(Integer tempTeamId, Long[] teamIds) {
		JSONObject apiResponse = new JSONObject();;
		
		apiResponse = tempProcessionApiFeign.batchDelTempSubTeam(tempTeamId, teamIds);
		if (!apiResponse.getBooleanValue("success")) {
			throw new EminException(apiResponse.getString("code"));
		}
		return apiResponse;
	}

	@RequestMapping("/removeRelateVols")
	@ResponseBody
	public JSONObject removeRelateVols(Integer tempTeamId, Long[] volIds) {
		JSONObject apiResponse = new JSONObject();;
		
		apiResponse = tempProcessionApiFeign.batchDelTempHashVol(tempTeamId, volIds);
		if (!apiResponse.getBooleanValue("success")) {
			throw new EminException(apiResponse.getString("code"));
		}
		return apiResponse;
	}
	
	
}
