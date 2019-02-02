package com.emin.platform.ec.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.servlet.ModelAndView;

import com.alibaba.fastjson.JSONObject;
import com.emin.base.controller.BaseController;
import com.emin.base.exception.EminException;
import com.emin.platform.ec.interfaces.EmergencyEventApiFeign;

@Controller
@RequestMapping("/emergency-event")
public class EmergencyEventController extends BaseController {

	@Autowired 
	EmergencyEventApiFeign emergencyEventApiFeign;
	
	@RequestMapping("/index")
	@ResponseBody
	public ModelAndView index(Long regionId,String eventType, Integer eventNature,String regionName, String eventTypeName) {
		ModelAndView mv = new ModelAndView("modules/emergency-event/manage");
		Integer page = getPageRequestData().getCurrentPage();
		Integer limit = getPageRequestData().getLimit();
		if(regionId == null) {
			regionId = 3L;
		}
		JSONObject realRes = emergencyEventApiFeign.queryPage(page, limit, regionId, eventType, 1);//真实事件
		if (!realRes.getBooleanValue("success")) {
			throw new EminException(realRes.getString("code"));
		};
		mv.addObject("realPages", realRes.getJSONObject("result"));
		JSONObject rehearsalRes = emergencyEventApiFeign.queryPage(page, limit, regionId, eventType, 2);//演练事件
		if (!rehearsalRes.getBooleanValue("success")) {
			throw new EminException(rehearsalRes.getString("code"));
		};
		mv.addObject("rehearsalPages", rehearsalRes.getJSONObject("result"));
		if(eventNature!=null) {
			mv.addObject("eventNature",eventNature);
		};
		if(eventType != null) {
			mv.addObject("eventType",eventType);
			mv.addObject("eventTypeName",eventTypeName);
		};
		mv.addObject("regionId",regionId);
		mv.addObject("regionName",regionName);
		return mv;
	}
	
	@RequestMapping("/form")
	@ResponseBody
	public ModelAndView goForm(Long id) {
		ModelAndView mv = new ModelAndView("modules/emergency-event/form");
		if (id != null) {
			JSONObject info = emergencyEventApiFeign.findById(id);
			if (!info.getBooleanValue("success")) {
				throw new EminException(info.getString("code"));
			}
			mv.addObject("info", info.getJSONObject("result"));
		}
		return mv;
	}
	
	/**
	 * @param regionId 区域id
	 * @param eventType 事件类型
	 * @param eventNature 事件性质：真实1、演练2
	 * @return
	 */
	@RequestMapping("/getPage")
	@ResponseBody
	public JSONObject getPage(Long regionId,String eventType, Integer eventNature) {
		
		Integer page = getPageRequestData().getCurrentPage();
		Integer limit = getPageRequestData().getLimit();
		regionId = 3L;
		JSONObject res = emergencyEventApiFeign.queryPage(page, limit, regionId, eventType, eventNature);
		return res.getJSONObject("result");
	}
	
	@RequestMapping("/save")
	@ResponseBody
	public JSONObject save(String data){
		JSONObject resJson = emergencyEventApiFeign.saveOrUpdate(data);
		if (!resJson.getBooleanValue("success")) {
			throw new EminException(resJson.getString("code"));
		}
		return resJson;
    }
	
	@RequestMapping("/remove")
	@ResponseBody
	public JSONObject remove(Long id){
		JSONObject resJson = emergencyEventApiFeign.deleteById(id);
		if (!resJson.getBooleanValue("success")) {
			throw new EminException(resJson.getString("code"));
		}
		return resJson;
    }
	
	/**
	 * 发布应急事件
	 * @param eventId 事件的id
	 * @return
	 */
	@RequestMapping("/publish")
	@ResponseBody
	public JSONObject publish(Long id){
		JSONObject resJson = emergencyEventApiFeign.publish(id);
		if (!resJson.getBooleanValue("success")) {
			throw new EminException(resJson.getString("code"));
		}
		return resJson;
    }
	
	/**
	 * 撤销应急事件
	 * @param eventId 事件的id
	 * @return
	 */
	@RequestMapping("/undo")
	@ResponseBody
	public JSONObject undo(Long id){
		JSONObject resJson = emergencyEventApiFeign.undo(id);
		if (!resJson.getBooleanValue("success")) {
			throw new EminException(resJson.getString("code"));
		}
		return resJson;
    }
}
