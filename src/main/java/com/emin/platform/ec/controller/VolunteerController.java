package com.emin.platform.ec.controller;

import com.alibaba.fastjson.JSON;
import com.alibaba.fastjson.JSONObject;
import com.emin.base.controller.BaseController;
import com.emin.base.exception.EminException;
import com.emin.platform.ec.filter.MenuOperationFilter;
import com.emin.platform.ec.interfaces.VolunteerApiFeign;
import com.emin.platform.ec.util.HttpSessionHelper;
import org.apache.commons.lang3.StringUtils;
import org.apache.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.servlet.ModelAndView;

@Controller
@RequestMapping("/volunteer")
public class VolunteerController extends BaseController {
	private static final Logger LOGGER = Logger.getLogger(VolunteerController.class);
	
    @Autowired
    VolunteerApiFeign volunteerApiFeign;//区域管理数据接口实现

    @Value("${spring.application.code}")
    private String appCode;

    @Autowired
    transient MenuOperationFilter menuOperationFilter;

    @RequestMapping("/index")
    @ResponseBody
    public ModelAndView index(String name, String mobile, Integer scope) {
        ModelAndView mv = new ModelAndView("modules/volunteer/manage");
        // 加载数据
        JSONObject res = new JSONObject();
        try {
        	 Integer limit = getPageRequestData().getLimit();
             Integer page = getPageRequestData().getCurrentPage();
             String queryParam = new String();
             JSONObject queryObj = new JSONObject();
             if (name != null && name != "") {
                 mv.addObject("name", name);
             }
             if (mobile != null && mobile != "") {
                 mv.addObject("mobile", mobile);
             }
             if (scope != null) {
                 mv.addObject("scope", scope);
             }
             if (limit == 10) {
                 limit = 12;
             }
             queryObj.putIfAbsent("groupType", -1);
             queryObj.putIfAbsent("mobile", mobile);
             queryObj.putIfAbsent("scope", scope);
             queryObj.putIfAbsent("realName", name);
             queryParam = queryObj.toJSONString();
            res = volunteerApiFeign.getPage(queryParam, page, limit);
    	} catch (Exception e) {
    		LOGGER.error("加载个人志愿者主页时报错！错误信息->" + e.getMessage());
    		e.printStackTrace();
    	}
        
        if (!res.isEmpty()) {
            if (!res.getBooleanValue("success")) {
                throw new EminException(res.getString("code"));
            }
            mv.addObject("pages", res.get("result"));
        }
        
        // 加载模块权限
        String operationCodes = null;
        try {
            HttpSessionHelper sessionHelper = HttpSessionHelper.create(this);
        	Long userId = sessionHelper.sessionUserId();
            JSONObject params = new JSONObject();
            params.putIfAbsent("userId", userId);
            operationCodes = menuOperationFilter.menuOperations("volunteer", params);
    	} catch (Exception e) {
    		LOGGER.error("加载个人志愿者主页时,查询模块权限报错！错误信息->" + e.getMessage());
    		e.printStackTrace();
    	}
        if (operationCodes != null) {
            mv.addObject("operationCodes", operationCodes);
        }
        
        return mv;
    }

    @RequestMapping("/form")
    @ResponseBody
    public ModelAndView goForm(Integer id) {
        ModelAndView mv = new ModelAndView("modules/volunteer/form");
        JSONObject apiResponse = new JSONObject();
        if (id != null) {
        	try {
        		apiResponse = volunteerApiFeign.detail(id);
        	} catch (Exception e) {
        		LOGGER.error("加载个人志愿者详情时报错！错误信息->" + e.getMessage());
        		e.printStackTrace();
        	}
        	
        	if (!apiResponse.isEmpty()) {
                if (!apiResponse.getBooleanValue("success")) {
                    throw new EminException(apiResponse.getString("code"));
                }
                mv.addObject("info", apiResponse.get("result"));
        	}
        }
        mv.addObject("formId", "volunteer-form");

        return mv;
    }

    @RequestMapping("/save")
    @ResponseBody
    public JSONObject save(String data) {
        String key = "mixTeamIds";
        JSONObject resJson = JSON.parseObject(data);
        String minxTeamIds = resJson.containsKey(resJson) ? "" : resJson.getString(key);
        if (StringUtils.isBlank(minxTeamIds)) {
            resJson.remove(key);
        }
        resJson = volunteerApiFeign.save(resJson.toJSONString());
        if (!resJson.getBooleanValue("success")) {
            throw new EminException(resJson.getString("code"));
        }
        return resJson;
    }

    @RequestMapping("/remove")
    @ResponseBody
    public JSONObject remove(Integer id) {
        JSONObject resJson = new JSONObject();
        resJson = volunteerApiFeign.delete(id);
        if (!resJson.getBooleanValue("success")) {
            throw new EminException(resJson.getString("code"));
        }
        return resJson;
    }

    /**
     * 分页查询
     *
     * @param keyword 查询字段，json对象
     * @return
     */
    @RequestMapping("/getPage")
    @ResponseBody
    public JSONObject getItems(String keyword) {
        JSONObject resJson = new JSONObject();
        resJson = volunteerApiFeign.getPage(keyword, getPageRequestData().getCurrentPage(), getPageRequestData().getLimit());
        if (!resJson.getBooleanValue("success")) {
            throw new EminException(resJson.getString("code"));
        }
        resJson.put("keyword", keyword);
        return resJson;
    }

    /**
     * 校验身份证号码
     *
     * @param IDNumber 身份证号码
     * @return
     */
    @RequestMapping("/checkExistIDNumber")
    @ResponseBody
    public JSONObject checkExistIDNumber(String IDNumber) {
        JSONObject resJson = new JSONObject();
        resJson = volunteerApiFeign.checkExistIDNumber(IDNumber);
        if (!resJson.getBooleanValue("success")) {
            throw new EminException(resJson.getString("code"));
        }
        return resJson;
    }

    /**
     * 查询所有平台
     *
     * @return
     */
    @RequestMapping("/getAllEcm")
    @ResponseBody
    public JSONObject getAllEcm() {
        JSONObject resJson = new JSONObject();
        resJson = volunteerApiFeign.findAllEcm();
        if (!resJson.getBooleanValue("success")) {
            throw new EminException(resJson.getString("code"));
        }
        return resJson;
    }

    /**
     * 查询志愿者详情
     *
     * @param id 志愿者id
     * @return
     */
    @RequestMapping("/getDetail")
    @ResponseBody
    public JSONObject getDetail(Integer id) {
        JSONObject resJson = new JSONObject();
        resJson = volunteerApiFeign.detail(id);
        if (!resJson.getBooleanValue("success")) {
            throw new EminException(resJson.getString("code"));
        }
        JSONObject comprehensive = volunteerApiFeign.comprehensive(id);//获取志愿者的技能评估详情
        if (!comprehensive.getBooleanValue("success")) {
            throw new EminException(comprehensive.getString("code"));
        }
        JSONObject result = resJson.getJSONObject("result");
        result.put("comprehensive", comprehensive.getJSONObject("result").getJSONArray("subItems"));
        resJson.put("result", result);
        return resJson;
    }

    /**
     * 志愿者淘汰
     *
     * @param id 志愿者id
     * @return
     */
    @RequestMapping("/dismissal")
    @ResponseBody
    public JSONObject dismissal(Integer id) {
        JSONObject resJson = new JSONObject();
        resJson = volunteerApiFeign.dismissal(id);
        if (!resJson.getBooleanValue("success")) {
            throw new EminException(resJson.getString("code"));
        }
        return resJson;
    }

    /**
     * 录用志愿者
     *
     * @param id 志愿者id
     * @return
     */
    @RequestMapping("/employment")
    @ResponseBody
    public JSONObject employment(Integer id) {
        JSONObject resJson = new JSONObject();
        resJson = volunteerApiFeign.employment(id);
        if (!resJson.getBooleanValue("success")) {
            throw new EminException(resJson.getString("code"));
        }
        return resJson;
    }

    /**
     * 查询志愿者的生命周期
     *
     * @return
     */
    @RequestMapping("/scopes")
    @ResponseBody
    public JSONObject scopes() {
        JSONObject resJson = new JSONObject();
        resJson = volunteerApiFeign.scopes();
        if (!resJson.getBooleanValue("success")) {
            throw new EminException(resJson.getString("code"));
        }
        return resJson;
    }

    /**
     * 注册分布数据加载
     *
     * @param longitude 经度
     * @param latitude  维度
     * @param radius    查询半径 单位m，默认20Km
     * @return
     */
    @RequestMapping("/registerSpread")
    @ResponseBody
    public JSONObject registerSpread(Double longitude, Double latitude, Double radius) {
        JSONObject apiResponse = new JSONObject();

        longitude = longitude == null ? 104.07224 : longitude;
        latitude = latitude == null ? 30.663461 : latitude;
        radius = radius == null ? 20000 : radius;

        apiResponse = volunteerApiFeign.registerSpread(longitude, latitude, radius);
        if (!apiResponse.getBooleanValue("success")) {
            throw new EminException(apiResponse.getString("code"));
        }
        return apiResponse.getJSONObject("result");
    }

    /**
     * 查询平台某月新增志愿者数量
     *
     * @param year  年
     * @param month 月
     * @return
     */
    @RequestMapping("/getIncreaseInfo")
    @ResponseBody
    public JSONObject getIncreaseInfo(Integer year, Integer month) {
        JSONObject apiResponse = new JSONObject();
        apiResponse = volunteerApiFeign.increaseInfo(year, month);
        if (!apiResponse.getBooleanValue("success")) {
            throw new EminException(apiResponse.getString("code"));
        }
        return apiResponse.getJSONObject("result");
    }
}
