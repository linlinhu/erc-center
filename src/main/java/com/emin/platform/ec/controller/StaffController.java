package com.emin.platform.ec.controller;


import org.apache.log4j.Logger;
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

import com.emin.platform.ec.interfaces.StaffApiFeign;
import com.emin.platform.ec.util.HttpSessionHelper;


@Controller
@RequestMapping("/staff")
public class StaffController extends BaseController {
	private static final Logger LOGGER = Logger.getLogger(StaffController.class);
	@Value("${spring.application.code}")
	private String appCode;
	
	@Autowired
	transient MenuOperationFilter menuOperationFilter;

	@Autowired
	StaffApiFeign staffApiFeign;

	@RequestMapping("/index")
	public ModelAndView index(String keyword, Long orgId, String orgName, Long id) {
		ModelAndView mv = new ModelAndView("modules/staff/manage");
		JSONObject res = new JSONObject();
		try {
			Integer page = getPageRequestData().getCurrentPage();
			Integer limit = getPageRequestData().getLimit();
			if (keyword != null) {
				mv.addObject("keyword", keyword);
			}
			if (orgId != null) {
				mv.addObject("orgId", orgId);
				mv.addObject("orgName", orgName);
			}
			mv.addObject("limit", limit);
			res = staffApiFeign.queryPage(keyword, page, limit, orgId);
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

	/**
	 * 分页查询
	 * 
	 * @param keyword 查询字段
	 * @param orgId 组织结构的id
	 * @return
	 */
	@RequestMapping("/getPage")
	@ResponseBody
	public JSONObject getPage(Long orgId, String keyword) {
		JSONObject apiResponse = new JSONObject();
		Integer page = getPageRequestData().getCurrentPage();
		Integer limit = getPageRequestData().getLimit();
		apiResponse = staffApiFeign.queryPage(keyword, page, limit, orgId);
		if (!apiResponse.getBooleanValue("success")) {
			throw new EminException(apiResponse.getString("code"));
		}
		apiResponse = apiResponse.getJSONObject("result");
		return apiResponse;
	}
	
	@RequestMapping("/getValidPage")
	@ResponseBody
	public JSONObject getValidPage(Long orgId, String keyword) {
		JSONObject apiResponse = new JSONObject();
		Integer page = getPageRequestData().getCurrentPage();
		Integer limit = getPageRequestData().getLimit();
		apiResponse = staffApiFeign.queryValidPage(keyword, page, limit, orgId);
		if (!apiResponse.getBooleanValue("success")) {
			throw new EminException(apiResponse.getString("code"));
		}
		apiResponse = apiResponse.getJSONObject("result");
		return apiResponse;
	}

	/**
	 * 根据id查询详情
	 * 
	 * @param personId 工作人员id
	 * @return
	 */
	@RequestMapping("/detail")
	@ResponseBody
	public JSONObject detail(Long id) {
		JSONObject apiResponse = new JSONObject();
		apiResponse = staffApiFeign.queryDetail(id);
		if (!apiResponse.getBooleanValue("success")) {
			throw new EminException(apiResponse.getString("code"));
		}
		apiResponse = apiResponse.getJSONObject("result");
		return apiResponse;
	}

	@RequestMapping("/form")
	@ResponseBody
	public ModelAndView goForm(Long id) {
		ModelAndView mv = new ModelAndView("modules/staff/form");
		JSONObject res = new JSONObject();
		if (id != null) {
			try {
				res = staffApiFeign.queryDetail(id);
			} catch (Exception e) {
				LOGGER.error("加载工作人员详情时报错！错误信息->" + e.getMessage());
	    		e.printStackTrace();
			}
			if(!res.isEmpty()){
				if (!res.getBooleanValue("success")) {
					throw new EminException(res.getString("code"));
				}
				mv.addObject("info", res.getJSONObject("result"));
			}
		}
		return mv;
	}

	@RequestMapping("/save")
	@ResponseBody
	public JSONObject save(Long[] orgIds, String mobile, String realName, Integer gender, Long id, String[] orgNames) {
		JSONObject res = staffApiFeign.saveOrUpdate(orgIds, orgNames, id, mobile, realName, gender);
		if (!res.getBooleanValue("success")) {
			throw new EminException(res.getString("code"));
		}
		;
		return res;
	}

	@RequestMapping("/remove")
	@ResponseBody
	public JSONObject remove(Long id) {
		JSONObject res = staffApiFeign.delete(id);
		if (!res.getBooleanValue("success")) {
			throw new EminException(res.getString("code"));
		}
		return res;
	}

	/**
	 * 变更用户所属组织关系
	 * 
	 * @param orgIds
	 *            所属组织的id数组
	 * @param orgNames
	 *            所属组织的名称数组
	 * @param personId
	 *            工作人员id
	 * @return
	 */
	@RequestMapping("/modifyPersonOrg")
	@ResponseBody
	public JSONObject modifyPersonOrg(Long[] orgIds, Long personId, String[] orgNames) {
		JSONObject res = staffApiFeign.saveOrUpdate(orgIds, orgNames, personId, null, null, null);
		if (!res.getBooleanValue("success")) {
			throw new EminException(res.getString("code"));
		}
		return res;
	}

	/**
	 * 删除工作人员的所属组织
	 * 
	 * @param personId
	 *            工作人员personId
	 * @param orgIds
	 *            组织的id数组,当该参数为空时，移除工作人员所有的组织关系
	 * @return
	 */
	@RequestMapping("/deletePersonOrg")
	@ResponseBody
	public JSONObject deletePersonOrg(Long[] orgIds, Long personId) {
		JSONObject res = staffApiFeign.deletePersonOrgByPersonId(personId, orgIds);
		if (!res.getBooleanValue("success")) {
			throw new EminException(res.getString("code"));
		}
		return res;
	}

	/**
	 * 工作人员的启用与禁用
	 * 
	 * @param id
	 *            工作人员id
	 * @param status
	 *            状态 true or false
	 * @return
	 */
	@RequestMapping("/changeStatus")
	@ResponseBody
	public JSONObject changeStatus(Long id, Boolean status) {
		JSONObject res = staffApiFeign.changeStatus(id, status);
		if (!res.getBooleanValue("success")) {
			throw new EminException(res.getString("code"));
		}
		return res;
	}

}
