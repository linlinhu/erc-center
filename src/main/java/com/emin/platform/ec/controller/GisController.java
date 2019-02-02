package com.emin.platform.ec.controller;

import java.io.UnsupportedEncodingException;

import javax.servlet.http.HttpServletRequest;

import org.apache.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.servlet.ModelAndView;

import com.alibaba.fastjson.JSONObject;
import com.emin.base.controller.BaseController;
import com.emin.base.exception.EminException;
import com.emin.platform.ec.interfaces.RegionApiFeign;

/**
 * gis控制层
 * @author 李丹
 *
 */
@Controller
@RequestMapping("/gis")
public class GisController extends BaseController {
	private static final Logger LOGGER = Logger.getLogger(GisController.class);
	
	@Autowired
	RegionApiFeign regionApiFeign; //区域api
	
	/**
	 * gis页面跳转
	 * @param request
	 * @return
	 * @throws UnsupportedEncodingException
	 */
	@RequestMapping("/index")
	@ResponseBody
	public ModelAndView index(HttpServletRequest request) throws UnsupportedEncodingException {
		ModelAndView mv = new ModelAndView("modules/gis/manage");
		JSONObject apiResponse = new JSONObject();
		Long regionId = null;
		regionId = 2l;
		try {
			apiResponse = regionApiFeign.findById(regionId);
		} catch (Exception e) {
			LOGGER.error("GIS主页加载【查询登录用户关联权限区域详情信息】报错！错误信息->" + e.getMessage());
        	e.printStackTrace();	
        }
        if (!apiResponse.isEmpty()) {
			if (!apiResponse.getBooleanValue("success")) {
				throw new EminException(apiResponse.getString("code"));
			}
			mv.addObject("topRegion", apiResponse.getJSONObject("result"));
        }
		return mv;
	}


}
