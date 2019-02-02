package com.emin.platform.ec.controller;

import java.io.UnsupportedEncodingException;
import java.net.URLDecoder;

import javax.servlet.http.HttpServletRequest;

import org.apache.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;

import com.alibaba.fastjson.JSONArray;
import com.alibaba.fastjson.JSONObject;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.servlet.ModelAndView;
import com.emin.platform.ec.interfaces.PersonApiFeign;
import com.emin.platform.ec.interfaces.MenuApiFeign;
import com.emin.platform.ec.interfaces.ResultCheckUtil;
import com.emin.platform.ec.filter.MenuFilter;
import com.emin.platform.ec.util.HttpSessionHelper;

import com.emin.base.controller.BaseController;

import java.util.Map;

@Controller
public class IndexController extends BaseController {
	private static final Logger LOGGER = Logger.getLogger(IndexController.class);
	
	@Autowired
	PersonApiFeign personApiFeign;

    @Autowired
    private MenuFilter menuFilter;
	
    
    @RequestMapping(value = "/", method = RequestMethod.GET)
    public String index(Map<String, Object> data) {
        HttpSessionHelper sessionHelper = HttpSessionHelper.create(this);

    	if (getRequest().getParameter("token") != null) {
            data.put("g_token", getRequest().getParameter("token"));
    	}
    	if (getRequest().getParameter("ecmId") != null) {
            data.put("g_ecmId", getRequest().getParameter("ecmId"));
    		sessionHelper.putSessionEcmId(Long.valueOf(getRequest().getParameter("ecmId")));
    	}
    	if (getRequest().getParameter("ecmName") != null) {
            data.put("g_ecmName", getRequest().getParameter("ecmName"));
    		try {
				sessionHelper.putSessionEcmName(URLDecoder.decode(getRequest().getParameter("ecmName"), "UTF-8"));
			} catch (UnsupportedEncodingException e) {
				// TODO Auto-generated catch block
				e.printStackTrace();
			}
    	}
    	if (getRequest().getParameter("userId") != null) {
            data.put("g_userId", getRequest().getParameter("userId"));
    		sessionHelper.putSessionUserId(Long.valueOf(getRequest().getParameter("userId")));
    	}
        Long userId = sessionHelper.sessionUserId();
        if (userId != null) {

            JSONObject userDetail = new JSONObject();
            JSONObject user =  new JSONObject();
            try {
	            userDetail = personApiFeign.detail(userId);
	        } catch (Exception e) {
	        	LOGGER.error("主页加载用户详情时接口出错，详情->" + e.getMessage());
	        	e.printStackTrace();
	        }
            if (!userDetail.isEmpty()) {
                user = userDetail.getJSONObject("result");
                ResultCheckUtil.check(userDetail);
            }
            JSONObject flockResult = new JSONObject();
            try {
                flockResult = personApiFeign.getUserFlocks(userId);
	        } catch (Exception e) {
	        	LOGGER.error("主页加载用户flockResult接口出错，详情->" + e.getMessage());
	        	e.printStackTrace();
	        }
            JSONArray flocks = new JSONArray();
            if (!flockResult.isEmpty()) {
                flocks = flockResult.getJSONArray("result");
            }
            
            Integer userType = null;
            if (!user.isEmpty()) {
            	userType = user.getIntValue("userType");
            }
            if (userType != null && !flocks.isEmpty()) {
                if (flocks.size() == 0 && userType != 1) {
                    data.put("noPermissions", true);
                } else {
                    JSONArray menuList = new JSONArray();
                    try {
                        if (flocks.size() > 0) {
                            Long[] groupIds = new Long[flocks.size()];
                            for (int j = 0; j < flocks.size(); j++) {
                                groupIds[j] = flocks.getJSONObject(j).getLong("id");
                            }
                            menuList = menuFilter.buildMenByUserType(userType, groupIds);
                        } else {
                            menuList = menuFilter.buildMenByUserType(userType);
                        }
                    } catch (Exception e) {
                    	LOGGER.error("主页加载用户权限菜单列表时出错，详情->" + e.getMessage());
                    	e.printStackTrace();
                    }
                    data.put("menus", menuList);
                }
                data.put("userDetail", user);
            }
            return "index";
        } else {
        	return "login";
        }
    }


	@RequestMapping("/404")
	public ModelAndView pageNotFound() {
		ModelAndView mv = new ModelAndView("404");
		return mv;
	}

	@RequestMapping("/500")
	public ModelAndView pageError() {
		ModelAndView mv = new ModelAndView("500");
		return mv;
	}

}
