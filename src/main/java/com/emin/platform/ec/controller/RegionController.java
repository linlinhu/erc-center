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
import com.emin.platform.ec.interfaces.RegionApiFeign;
import com.emin.platform.ec.interfaces.RegionGridApiFeign;
import com.emin.platform.ec.util.HttpSessionHelper;

/**
 * 控制层-区域信息管理
 * @author 李丹
 *
 */
@Controller
@RequestMapping("/region")
public class RegionController extends BaseController{
	private static final Logger LOGGER = Logger.getLogger(RegionController.class);
	
	@Autowired
	RegionApiFeign regionApiFeign;//区域管理数据接口实现
	@Autowired
	RegionGridApiFeign regionGridApiFeign;
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
	public ModelAndView goManage(){
		ModelAndView mv = new ModelAndView("modules/region/manage");
		JSONObject apiResponse = new JSONObject();
		JSONObject topRegion = new JSONObject();
		JSONArray secondRegions = new JSONArray();
		
		Long regionId = null;
		regionId = 2l;
		try {
			apiResponse = regionApiFeign.findById(regionId);
		} catch(Exception e) {
			LOGGER.error("区域管理主页加载【查询登录用户最高权限组织详情】报错！错误信息->" + e.getMessage());
        	e.printStackTrace();
		}
		if (!apiResponse.isEmpty()) {
			if (!apiResponse.getBooleanValue("success")) {
				throw new EminException(apiResponse.getString("code"));
			}
			topRegion = apiResponse.getJSONObject("result");
			mv.addObject("topRegion", topRegion);
		}

		try {
			apiResponse = regionApiFeign.findByPid(topRegion.getLong("id"));
		} catch(Exception e) {
			LOGGER.error("区域管理主页加载【查询登录用户二级权限组织集合】报错！错误信息->" + e.getMessage());
        	e.printStackTrace();
		}
		if (!apiResponse.isEmpty()) {
			if (!apiResponse.getBooleanValue("success")) {
				throw new EminException(apiResponse.getString("code"));
			}
			secondRegions = apiResponse.getJSONArray("result");
			if (secondRegions.size() > 0) {
				switch(topRegion.getInteger("level")) {
					case 0: 
						mv.addObject("provinceList", secondRegions);
					case 1:
						mv.addObject("cityList", secondRegions);
						
				};
			}
		}
		
		
		String operationCodes = null;
		try {
			HttpSessionHelper sessionHelper = HttpSessionHelper.create(this);
			Long userId = sessionHelper.sessionUserId();
			JSONObject params = new JSONObject();
			params.putIfAbsent("userId", userId);
			operationCodes = menuOperationFilter.menuOperations("region", params);
		} catch(Exception e) {
			LOGGER.error("区域管理主页加载【查询模块权限】报错！错误信息->" + e.getMessage());
        	e.printStackTrace();
		}
		if (operationCodes != null) {
			mv.addObject("operationCodes", operationCodes);	
		}
		return mv;
    }
	/**
	 * 根据区域加载网格集合
	 * @param regionId
	 * @return
	 */
	@RequestMapping("/getGrids")
	@ResponseBody
	public JSONArray getGrids(Long regionId){
		JSONArray result = new JSONArray();
		JSONObject apiResponse = new JSONObject();
		apiResponse = regionGridApiFeign.findAllByRegionId(regionId);
		if (apiResponse.getBooleanValue("success")) {
			result = apiResponse.getJSONArray("result");
		}
		return result;
    }

	/**
	 * 区域树加载
	 * @param pid 父节点编号
	 * @return
	 */
	@RequestMapping("/findByPid")
	@ResponseBody
	public JSONArray findByPid(Long pid){
		JSONArray result = new JSONArray();
		JSONObject res = new JSONObject();
		try {
			res = regionApiFeign.findByPid(pid);
			if (res.getBooleanValue("success")) {
				result = res.getJSONArray("result");
			}
		} catch(Exception e) {
			
		}
		return result;
		
    }
	
	/**
	 * 查询网格详情
	 * @param id 网格编号
	 * @return
	 */
	@RequestMapping("/gridDetail")
	@ResponseBody
	public JSONObject gridDetail(Long id){
		JSONObject apiResponse = new JSONObject();
		apiResponse = regionGridApiFeign.detail(id);
		if (!apiResponse.getBooleanValue("success")) {
			throw new EminException(apiResponse.getString("code"));
		}

		apiResponse = apiResponse.getJSONObject("result");
		return apiResponse;
		
    }
	
	/**
	 * 删除区域信息实体
	 * @param ids 删除项的id
	 * @return
	 */
	@RequestMapping("/remove")
	@ResponseBody
	public JSONObject deleteRegion(Long ids){
		JSONObject resJson = new JSONObject();
		Long ecmId = null;
		if (getRequest().getHeader("ecmId") != null) {
			ecmId = Long.valueOf(getRequest().getHeader("ecmId").toString());
		}
		if (ecmId != null) {
			resJson = regionApiFeign.delete(ecmId, ids);
			if(!resJson.getBoolean("success")){
				throw new EminException(resJson.getString("code"));
			}
		} else {
			throw new EminException("BASE_0.0.001");
		}
		
		return resJson;
    }
	
	/**
	 * 保存网格
	 * @param datas
	 * @return
	 */
	@RequestMapping("/saveGrids")
	@ResponseBody
	public JSONObject saveGrids(String datas){
		JSONObject resJson = new JSONObject();
		resJson = regionGridApiFeign.save(datas);
		if(!resJson.getBoolean("success")){
			throw new EminException(resJson.getString("code"));
		}
		return resJson;
    }
}
