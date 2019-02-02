package com.emin.platform.ec.controller;

import java.io.UnsupportedEncodingException;

import javax.servlet.http.HttpServletRequest;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.servlet.ModelAndView;

import com.alibaba.fastjson.JSONArray;
import com.alibaba.fastjson.JSONObject;
import com.emin.base.controller.BaseController;
import com.emin.base.exception.EminException;
import com.emin.platform.ec.interfaces.ClueApiFeign;
import com.emin.platform.ec.interfaces.RegionApiFeign;
import com.emin.platform.ec.interfaces.RegionGridApiFeign;
/**
 * 实时线索控制层
 * @author 李丹
 *
 */
@Controller
@RequestMapping("/realtime-clue")
public class RealtimeClueController extends BaseController {
	@Autowired
	RegionApiFeign regionApiFeign; //区域api
	@Autowired
	RegionGridApiFeign regionGridApiFeign; //区域网格api
	@Autowired
	ClueApiFeign clueApiFeign; // 线索api
	
	/**
	 * 主页跳转
	 * @param request
	 * @return
	 * @throws UnsupportedEncodingException
	 */
	@RequestMapping("/index")
	@ResponseBody
	public ModelAndView index(HttpServletRequest request) throws UnsupportedEncodingException {
		ModelAndView mv = new ModelAndView("modules/realtime-clue/manage");
		JSONObject apiResponse = new JSONObject();
		JSONObject topRegion = new JSONObject();
		Long regionId = 2l;
		apiResponse = regionApiFeign.findById(regionId);
		if (!apiResponse.getBooleanValue("success")) {
			throw new EminException(apiResponse.getString("code"));
		}
		topRegion = apiResponse.getJSONObject("result");
		mv.addObject("topRegion", topRegion);
		return mv;
	}
	/**
	 * 获取滚动线索集合
	 * @return
	 */
	@RequestMapping("/getList")
	@ResponseBody
	public JSONArray getList(String systemId){
		JSONArray result = new JSONArray();
		JSONObject apiResponse = new JSONObject();
		apiResponse = clueApiFeign.getList(2, "{\"requestId\": \"" + systemId + "\"}");
		if (apiResponse.getBooleanValue("success")) {
			result = apiResponse.getJSONArray("result");
		}
		return result;
    }
	/**
	 * 获取线索点集合
	 * @param strategy
	 * @param param
	 * @return
	 */
	@RequestMapping("/getPoints")
	@ResponseBody
	public JSONArray getPoints(String systemId){
		JSONArray result = new JSONArray();
		JSONObject apiResponse = new JSONObject();
		apiResponse = clueApiFeign.getPoints(2, "{\"requestId\": \"" + systemId + "\"}");
		if (apiResponse.getBooleanValue("success")) {
			result = apiResponse.getJSONArray("result");
		}
		return result;
    }

	/**
	 * 获取线索详情
	 * @param id
	 * @return
	 */
	@RequestMapping("/detail")
	@ResponseBody
	public JSONObject detail(Integer id){
		JSONObject apiResponse = new JSONObject();
		apiResponse = clueApiFeign.detail(id);
		if (!apiResponse.getBooleanValue("success")) {
			throw new EminException(apiResponse.getString("code"));
		}
		return apiResponse;
    }
	/**
	 * 线索处理
	 * @param id
	 * @param clueStatus
	 * 10 已报告
	 * 20 已忽略
	 * 30 已标记
	 * @return
	 */
	@RequestMapping("/mark")
	@ResponseBody
	public JSONObject mark(Integer id, Integer clueStatus){
		JSONObject result = new JSONObject();
		JSONObject apiResponse = new JSONObject();
		apiResponse = clueApiFeign.mark(id, clueStatus);
		if (!apiResponse.getBooleanValue("success")) {
			throw new EminException(apiResponse.getString("code"));
		}
		return result;
    }
}
