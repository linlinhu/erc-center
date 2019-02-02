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
import com.emin.platform.ec.interfaces.OrgChartApiFeign;
import com.emin.platform.ec.util.HttpSessionHelper;
/**
 * 组织机构控制层
 * @author 李丹
 *
 */
@Controller
@RequestMapping("/org-chart")
public class OrgChartController extends BaseController {
	private static final Logger LOGGER = Logger.getLogger(OrgChartController.class);
	
	@Autowired
	OrgChartApiFeign orgChartApiFeign;// 组织机构api
	@Value("${spring.application.code}")
	private String appCode;
	@Autowired
	transient MenuOperationFilter menuOperationFilter;
	
	/**
	 * 主页跳转
	 * @return
	 */
	@RequestMapping("/index")
	@ResponseBody
	public ModelAndView index() {
		ModelAndView mv = new ModelAndView("modules/org-chart/manage");
		String operationCodes = null;

		try {
			HttpSessionHelper sessionHelper = HttpSessionHelper.create(this);
			Long userId = sessionHelper.sessionUserId();
			JSONObject params = new JSONObject();
			params.putIfAbsent("userId", userId);
			operationCodes = menuOperationFilter.menuOperations("org-chart", params);
		} catch (Exception e) {
			LOGGER.error("组织机构主页加载【查询模块权限】报错！错误信息->" + e.getMessage());
        	e.printStackTrace();	
        }
		if (operationCodes != null) {
			mv.addObject("operationCodes", operationCodes);
		}
		
		return mv;
	}
	/**
	 * 保存组织机构
	 * @param data 对象实体字符串
	 * @return
	 */
	@RequestMapping("/save")
	@ResponseBody
	public JSONObject save(String data){
		JSONObject apiResponse = new JSONObject();
		apiResponse = orgChartApiFeign.save(data);
		if (!apiResponse.getBooleanValue("success")) {
			throw new EminException(apiResponse.getString("code"));
		}
		return apiResponse;
    }
	/**
	 * 删除组织机构
	 * @param id 机构编号
	 * @return
	 */
	@RequestMapping("/remove")
	@ResponseBody
	public JSONObject remove(Long id){
		JSONObject apiResponse = new JSONObject();
		apiResponse = orgChartApiFeign.remove(id);
		if (!apiResponse.getBooleanValue("success")) {
			throw new EminException(apiResponse.getString("code"));
		}
		return apiResponse;
    }
	/**
	 * 查询所有组织机构树节点
	 * @return
	 */
	@RequestMapping("/findAll")
	@ResponseBody
	public JSONArray findAll(){
		JSONArray treeNodes = new JSONArray();
		JSONObject apiResponse = new JSONObject();
		apiResponse = orgChartApiFeign.getAll();
		if (!apiResponse.getBooleanValue("success")) {
			throw new EminException(apiResponse.getString("code"));
		}
		treeNodes = apiResponse.getJSONArray("result");
		return treeNodes;
    }
	
	/**
	 * 组织机构关联工作人员保存
	 * @param personIds 人员编号，多个用逗号分隔 
	 * @param orgId 组织机构编号
	 * @param orgName 组织机构名称（冗余字段）
	 * @return
	 */
	@RequestMapping("/relateStaffs")
	@ResponseBody
	public JSONObject relateStaffs(String personIds, Long orgId, String orgName){
		JSONObject apiResponse = new JSONObject();
		apiResponse = orgChartApiFeign.relateStaffs(personIds, orgId, orgName);
		if (!apiResponse.getBooleanValue("success")) {
			throw new EminException(apiResponse.getString("code"));
		}
		return apiResponse;
    }
	/**
	 * 转移工作人员至新的组织机构
	 * @param personIds 人员编号，多个用逗号分隔 
	 * @param oldOrgId 原组织编号
	 * @param orgId 新组织编号
	 * @param orgName 新组织名称（冗余字段）
	 * @return
	 */
	@RequestMapping("/exchangeStaffs")
	@ResponseBody
	public JSONObject relateStaffs(String personIds, Long oldOrgId, Long orgId, String orgName){
		JSONObject apiResponse = new JSONObject();
		apiResponse = orgChartApiFeign.exchangeStaffs(personIds, oldOrgId, orgId, orgName);
		if (!apiResponse.getBooleanValue("success")) {
			throw new EminException(apiResponse.getString("code"));
		}
		return apiResponse;
    }
	/**
	 * 组织机构删除关联工作人员
	 * @param personIds 人员编号，多个用逗号分隔 
	 * @param orgId 组织机构名称
	 * @return
	 */
	@RequestMapping("/removeStaffs")
	@ResponseBody
	public JSONObject removeStaffs(String personIds, Long orgId){
		JSONObject apiResponse = new JSONObject();
		apiResponse = orgChartApiFeign.removeStaffs(personIds, orgId);
		if (!apiResponse.getBooleanValue("success")) {
			throw new EminException(apiResponse.getString("code"));
		}
		return apiResponse;
    }
	/**
	 * 查询组织机构详情
	 * @param id 组织机构编号
	 * @return
	 */
	@RequestMapping("/detail")
	@ResponseBody
	public JSONObject detail(Long id){
		JSONObject apiResponse = new JSONObject();
		apiResponse = orgChartApiFeign.detail(id);
		if (!apiResponse.getBooleanValue("success")) {
			throw new EminException(apiResponse.getString("code"));
		}
		return apiResponse.getJSONObject("result");
    }
	

}
