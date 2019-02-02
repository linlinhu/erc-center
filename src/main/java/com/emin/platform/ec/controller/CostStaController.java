package com.emin.platform.ec.controller;

import com.alibaba.fastjson.JSONArray;
import com.alibaba.fastjson.JSONObject;
import com.emin.base.controller.BaseController;
import com.emin.base.exception.EminException;
import com.emin.platform.ec.filter.MenuOperationFilter;
import com.emin.platform.ec.interfaces.CostStaApiFeign;
import com.emin.platform.ec.util.HttpSessionHelper;

import org.apache.commons.lang3.StringUtils;
import org.apache.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.servlet.ModelAndView;

import java.util.Calendar;

@RestController
@RequestMapping("/cost-sta")
public class CostStaController extends BaseController {
	private static final Logger LOGGER = Logger.getLogger(CostStaController.class);
	
	@Value("${spring.application.code}")
	private String appCode;
	
	@Autowired
	transient MenuOperationFilter menuOperationFilter;

    @Autowired
    private CostStaApiFeign feign;

    private static final String RESULT_DATA_KEY = "result";

    /**
     * 首页显示
     *
     * @param
     * @return
     * @throws @Description: 首页显示
     * @author Jack
     * @date 2018/3/28
     * @update 2018/4/9 by Danica
     */
    @GetMapping("/index")
    public ModelAndView index(@RequestParam(required = false) Long regionId, String regionName, Integer regionType,
                              @RequestParam(required = false) String month) {
        ModelAndView mv = new ModelAndView("modules/cost/cost-sta/manage");
        String currentMonth = this.createMonth();
        HttpSessionHelper sessionHelper = HttpSessionHelper.create(this);
        if (StringUtils.isBlank(month)) {
            month = currentMonth;
        }
        Integer page = getPageRequestData().getCurrentPage();
        Integer limit = getPageRequestData().getLimit();
        JSONObject pageRes = new JSONObject();
        try {
            pageRes = feign.costsQueryPage(page, limit, regionType, regionId, month);
        } catch(Exception e) {
        	LOGGER.error("费用管理首页加载费用分页报错！错误信息->" + e.getMessage());
        	e.printStackTrace();
        }
        this.dealException(pageRes);
        
        JSONObject totalRes = new JSONObject();
        try {
            totalRes = feign.costsQueryTotalByMonth(regionType, regionId, month);
        } catch(Exception e) {
        	LOGGER.error("费用管理首页加载【查询月培训次数与培训费用】报错！错误信息->" + e.getMessage());
        	e.printStackTrace();
        }
        this.dealException(totalRes);
        
        JSONObject halfYearRes = new JSONObject();
        try {
        	halfYearRes = feign.costsQueryTotalByMonthOfHalfYear(regionType, regionId, currentMonth);
        } catch(Exception e) {
        	LOGGER.error("费用管理首页加载【查询该区域半年的费用统计（不含当前月】报错！错误信息->" + e.getMessage());
        	e.printStackTrace();
        }
        this.dealException(halfYearRes);
        
        if (!pageRes.isEmpty()) {
            // 分页信息
            mv.addObject("page", pageRes.getJSONObject(RESULT_DATA_KEY));
        }
        
        if (!totalRes.isEmpty()) {
            JSONObject totalJson = totalRes.getJSONObject(RESULT_DATA_KEY);
            // 总次数
            mv.addObject("totalCount", totalJson.getIntValue("totalCount"));
            // 总费用
            mv.addObject("totalFee", totalJson.getBigDecimal("totalCosts"));
        }
        
        if (!halfYearRes.isEmpty()) {
        	// 最近六个月统计数据
            mv.addObject("latestSixMonthData", halfYearRes.getJSONArray(RESULT_DATA_KEY).toJSONString());
            
        }
        String operationCodes = null;
        try {
	        Long userId = sessionHelper.sessionUserId();
			JSONObject params = new JSONObject();
			params.putIfAbsent("userId", userId);
			operationCodes = menuOperationFilter.menuOperations("cost-sta", params);
	    } catch (Exception e) {
			LOGGER.error("加载个人志愿者主页时,查询模块权限报错！错误信息->" + e.getMessage());
			e.printStackTrace();
		}
        if (operationCodes != null) {
    		mv.addObject("operationCodes", operationCodes);
        }
        
		mv.addObject("month", month);
        mv.addObject("regionId", regionId);
        mv.addObject("regionName", regionName);
        mv.addObject("regionType", regionType);
        return mv;
    }

    /**
     * 获取当前月份
     * @param
     * @return
     * @throws @Description: 查看明细
     * @author Jack
     * @date 2018/3/28
     */
    private String createMonth() {
        Calendar cal = Calendar.getInstance();
        int year = cal.get(Calendar.YEAR);
        int month = cal.get(Calendar.MONTH) + 1;
        if (month < 10) {
            return year + "0" + month;
        }
        return year + "" + month;
    }

    /**
     * 查看明细
     * @param
     * @return
     * @throws @Description: 查看明细
     * @author Jack
     * @date 2018/3/28
     */
    @GetMapping("/detail")
    public JSONArray detail(@RequestParam Integer thingType, @RequestParam Long thingId) {
        JSONObject detailRes = feign.getAll(thingId, thingType);
        this.dealException(detailRes);
        return detailRes.getJSONArray(RESULT_DATA_KEY);
    }
    

	/**
	 * 保存费用
	 * @param data 费用信息实体字符串
	 * @return
	 */
	@RequestMapping("/save")
	@ResponseBody
	public JSONObject save(String data) {
		JSONObject apiResponse = new JSONObject();
		
		// 接口调用
		apiResponse = feign.save(data);

        this.dealException(apiResponse);
		
		return apiResponse;
	}
	
	/**
	 * 删除
	 * @param id 费用编号
	 * @return
	 */
	@RequestMapping("/remove")
	@ResponseBody
	public JSONObject remove(Long id) {
		JSONObject apiResponse = new JSONObject();
		
		// 接口调用
		apiResponse = feign.remove(id);

        this.dealException(apiResponse);
		
		return apiResponse;
	}
	/**
	 * 查询所有费用
	 * @param thingType 项目类型
	 * @param thingId 项目id
	 * @return
	 */
	@RequestMapping("/getAll")
	@ResponseBody
	public JSONArray getAll(Integer thingType, Long thingId) {
		JSONObject apiResponse = new JSONObject();
		
		// 接口调用
		apiResponse = feign.getAll(thingId, thingType);

        this.dealException(apiResponse);
		
		return apiResponse.getJSONArray("result");
	}

    /**
     * 异常处理
     * @param
     * @return
     * @throws @Description: 异常处理
     * @author Jack
     * @date 2018/3/28
     */
    private void dealException(JSONObject... res) {
        if (null != res && res.length > 0) {
            for (JSONObject json : res) {
                if (!json.isEmpty() && !json.getBooleanValue("success")) {
                    throw new EminException(json.getString("code"));
                }
            }
        }
    }
}
