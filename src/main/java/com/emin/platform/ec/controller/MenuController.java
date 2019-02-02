/**
 * 
 */
package com.emin.platform.ec.controller;

import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;

import com.alibaba.fastjson.JSONObject;
import com.emin.base.controller.BaseController;
import com.emin.platform.ec.interfaces.ApplicationApiFeign;
import com.emin.platform.ec.interfaces.MenuApiFeign;
import com.emin.platform.ec.interfaces.OperationApiFeign;
import com.emin.platform.ec.interfaces.ResultCheckUtil;

/**
 * @author jim.lee
 *
 */
@Controller
@RequestMapping("/menu")
public class MenuController extends BaseController{

	@Autowired
	private ApplicationApiFeign applicationApiFeign;
	
	@Autowired
	private MenuApiFeign menuApiFeign;
	
	@Autowired
	private OperationApiFeign operationApiFeign;
	
	
	@GetMapping("/index")
	public String index(Map<String,Object> data,Long id) {
		JSONObject appListResult = applicationApiFeign.loadApplications();
		ResultCheckUtil.check(appListResult);
		data.put("applications", appListResult.getJSONArray("result"));
		Long appId = null;
		if(id!=null ) {
			appId = id;
		}else {
			appId = appListResult.getJSONArray("result").size()>0?appListResult.getJSONArray("result").getJSONObject(0).getLong("id"):null;
		}
		if(appId!=null) {
			JSONObject menuResult = menuApiFeign.menuList(appId, null, true);
			ResultCheckUtil.check(menuResult);
			data.put("menus", menuResult.getJSONArray("result"));
			data.put("appId", appId);
		}
		
		return "modules/menu/index";
	}
	@GetMapping("/form")
	public String form(Map<String,Object> data,Long id,Long appId,Long pid) {
		
		if(id!=null) {
			JSONObject menuDetailResult = menuApiFeign.menuDetail(id);
			ResultCheckUtil.check(menuDetailResult);
			data.put("menu", menuDetailResult.getJSONObject("result"));
		}
		JSONObject menuTypeResult = menuApiFeign.menuType();
		ResultCheckUtil.check(menuTypeResult);
		data.put("menuTypes", menuTypeResult.getJSONArray("result"));
		data.put("appId", appId);
		data.put("pid", pid);
		return "modules/menu/form";
	}
	
	@PostMapping("/saveMenu")
	@ResponseBody
	public JSONObject saveMenu(String menu) {
		JSONObject result = menuApiFeign.createOrUpdate(menu);
		ResultCheckUtil.check(result);
		return result;
	}
	
	@PostMapping("/deleteMenu")
	@ResponseBody
	public JSONObject deleteMenu(String ids) {
		JSONObject result = menuApiFeign.delete(Long.valueOf(ids));
		ResultCheckUtil.check(result);
		return result;
	}
	
	@GetMapping("/operations/{menuId}")
	public String operations(Map<String,Object> data, @PathVariable Long menuId) {
		JSONObject result = operationApiFeign.operationList(menuId);
		ResultCheckUtil.check(result);
		data.put("operationList", result.getJSONArray("result"));
		return "modules/menu/operation";
	}
	
}
