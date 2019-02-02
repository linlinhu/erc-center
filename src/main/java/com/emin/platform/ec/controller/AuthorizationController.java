package com.emin.platform.ec.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.servlet.ModelAndView;

import com.alibaba.fastjson.JSONObject;
import com.emin.base.controller.BaseController;
import com.emin.base.exception.EminException;
import com.emin.platform.ec.interfaces.AuthorizationApiFeign;

/**
 * @author Administrator
 *
 */
/**
 * @author Administrator
 *
 */
@Controller
@RequestMapping("/authorization")
public class AuthorizationController extends BaseController {

	@Autowired
	AuthorizationApiFeign authorizationApiFeign;
	
	@RequestMapping("/index")
	@ResponseBody
	public ModelAndView index(String module, String personName,String operation) {
		ModelAndView mv = new ModelAndView("modules/authorization/manage");
		Integer page = getPageRequestData().getCurrentPage();
		Integer limit = getPageRequestData().getLimit();
		if(personName != null && personName != "") {
			mv.addObject("personName", personName);
		} else {
			personName = null;
		};
		JSONObject res = authorizationApiFeign.queryPage(page, limit, module, personName, operation);
		if (!res.getBooleanValue("success")) {
			throw new EminException(res.getString("code"));
		};
		if(module != null) {
			mv.addObject("module", module);
		};
		
		if(operation != null) {
			mv.addObject("operation", operation);
		};
		mv.addObject("pages", res.getJSONObject("result"));
		return mv;
	}
	
	@RequestMapping("/form")
	@ResponseBody
	public ModelAndView goForm(Long id) {
		ModelAndView mv = new ModelAndView("modules/data-dic/form");
		if (id != null) {
			JSONObject info = authorizationApiFeign.findById(id);
			if (!info.getBooleanValue("success")) {
				throw new EminException(info.getString("code"));
			}
			mv.addObject("info", info.getJSONObject("result"));
		}
		return mv;
	}
	
	@RequestMapping("/save")
	@ResponseBody
	public JSONObject save(String warrantStr){
		JSONObject resJson = new JSONObject();
		resJson = authorizationApiFeign.saveOrUpdate(warrantStr);
		if(!resJson.getBoolean("success")){
			throw new EminException(resJson.getString("code"));
		}
		return resJson;
    }
	
	@RequestMapping("/remove")
	@ResponseBody
	public JSONObject remove(Long warrantId){
		JSONObject resJson = new JSONObject();
		
		resJson = authorizationApiFeign.deleteById(warrantId);
		if(!resJson.getBoolean("success")){
			throw new EminException(resJson.getString("code"));
		}
		return resJson;
    }
	
	/**
	 * 授权的启用或者禁用
	 * @param warrantIds 授权id集合
	 * @param activeStatus 状态参数 启用1/禁用0
	 * @return
	 */
	@RequestMapping("/enabled")
	@ResponseBody
	public JSONObject enabled(Integer warrantIds,Integer[] activeStatus){
		JSONObject resJson = new JSONObject();
		resJson = authorizationApiFeign.enabled(warrantIds, activeStatus);
		if(!resJson.getBoolean("success")){
			throw new EminException(resJson.getString("code"));
		}
		return resJson;
    }
}
