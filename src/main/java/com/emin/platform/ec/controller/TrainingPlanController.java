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
import com.emin.platform.ec.interfaces.TrainingPlanApiFeign;
import com.emin.platform.ec.util.HttpSessionHelper;

/**
 * 培训计划控制层
 * @author 李丹
 *
 */
@Controller
@RequestMapping("/training-plan")
public class TrainingPlanController extends BaseController {
	private static final Logger LOGGER = Logger.getLogger(TrainingPlanController.class);
	@Value("${spring.application.code}")
	private String appCode;
	@Autowired
	transient MenuOperationFilter menuOperationFilter;
	@Autowired
	TrainingPlanApiFeign trainingPlanApiFeign; // 培训计划api
	
	/**
	 * 主页跳转
	 * @param vpId 应急队伍编号
	 * @param vpName 应急队伍名称（冗余）
	 * @param startTime 开始时间
	 * @param endTime 结束时间
	 * @param keywords 关键字
	 * @return
	 */
	@RequestMapping("/index")
	@ResponseBody
	public ModelAndView index(Long vpId, String vpName, Long startTime, Long endTime, String keywords) {
		// 界面及必要参数
		ModelAndView mv = new ModelAndView("modules/training-plan/manage");
		Integer page = getPageRequestData().getCurrentPage();
		Integer limit = getPageRequestData().getLimit();
		JSONObject apiResponse = new JSONObject();
		
		// 参数
		JSONObject params = new JSONObject();
		params.put("vpId", vpId);
		params.put("vpName", vpName);
		params.put("startTime", startTime);
		params.put("endTime", endTime);
		params.put("keywords", keywords);
		// 参数返回界面
		mv.addObject("params", params);
		
		try {
			// 接口调用
			apiResponse = trainingPlanApiFeign.getPage(page, limit, keywords, startTime, endTime, vpId);
		} catch(Exception e) {
			LOGGER.error("培训管理主页加载【查询培训计划分页列表】报错！错误信息->" + e.getMessage());
        	e.printStackTrace();
		}
		if (!apiResponse.isEmpty()) {
			if (!apiResponse.getBooleanValue("success")) {
				throw new EminException(apiResponse.getString("code"));
			}
			// 接口数据返回界面
			mv.addObject("pages", apiResponse.getJSONObject("result"));
		}
		
		
		
		String operationCodes = null;
		try {
			HttpSessionHelper sessionHelper = HttpSessionHelper.create(this);
			Long userId = sessionHelper.sessionUserId();
			JSONObject param = new JSONObject();
			param.putIfAbsent("userId", userId);
			operationCodes = menuOperationFilter.menuOperations("training-plan", param);
		} catch(Exception e) {
			LOGGER.error("培训管理主页加载【查询模块权限】报错！错误信息->" + e.getMessage());
        	e.printStackTrace();
		}
		
		if (operationCodes != null) {
			mv.addObject("operationCodes", operationCodes);
		}
		
		return mv;
	}
	
	/**
	 * 保存
	 * @param data 培训计划实体字符串
	 * @return
	 */
	@RequestMapping("/save")
	@ResponseBody
	public JSONObject save(String data) {
		JSONObject apiResponse = new JSONObject();
		
		// 接口调用
		apiResponse = trainingPlanApiFeign.save(data);
		if (!apiResponse.getBooleanValue("success")) {
			throw new EminException(apiResponse.getString("code"));
		}
		
		return apiResponse;
	}
	
	/**
	 * 详情
	 * @param id 培训计划编号
	 * @return
	 */
	@RequestMapping("/detail")
	@ResponseBody
	public JSONObject detail(Long id) {
		JSONObject apiResponse = new JSONObject();
		
		// 接口调用
		apiResponse = trainingPlanApiFeign.detail(id);
		if (!apiResponse.getBooleanValue("success")) {
			throw new EminException(apiResponse.getString("code"));
		}
		
		return apiResponse.getJSONObject("result");
	}
	
	/**
	 * 删除
	 * @param id 培训计划编号
	 * @return
	 */
	@RequestMapping("/remove")
	@ResponseBody
	public JSONObject remove(Long id) {
		JSONObject apiResponse = new JSONObject();
		
		// 接口调用
		apiResponse = trainingPlanApiFeign.remove(id);
		if (!apiResponse.getBooleanValue("success")) {
			throw new EminException(apiResponse.getString("code"));
		}
		
		return apiResponse;
	}
	
	/**
	 * 查询培训反馈详情
	 * @param id 培训计划编号
	 * @return
	 */
	@RequestMapping("/getFeedbackDetail")
	@ResponseBody
	public JSONObject publish(Long id) {
		JSONObject apiResponse = new JSONObject();
		
		// 接口调用
		apiResponse = trainingPlanApiFeign.getFeedbackDetail(id);
		if (!apiResponse.getBooleanValue("success")) {
			throw new EminException(apiResponse.getString("code"));
		}
		
		return apiResponse.getJSONObject("result");
	}
	
	/**
	 * 保存培训反馈详情
	 * @param data
	 * @return
	 */
	@RequestMapping("/feedback")
	@ResponseBody
	public JSONObject feedback(String data) {
		JSONObject apiResponse = new JSONObject();
		
		// 接口调用
		apiResponse = trainingPlanApiFeign.feedback(data);
		if (!apiResponse.getBooleanValue("success")) {
			throw new EminException(apiResponse.getString("code"));
		}
		
		return apiResponse;
	}
	
	/**
	 * 获得培训计划关联志愿者信息
	 * @param id 培训计划编号
	 * @param teamId 培训计划关联团队编号
	 * @param keyword 关键字模糊查询
	 * @return
	 */
	@RequestMapping("/getVolunteersPage")
	@ResponseBody
	public JSONArray getVolunteersPage(Long id, Long teamId, String keyword) {
		JSONObject apiResponse = new JSONObject();
		
		// 接口调用
		apiResponse = trainingPlanApiFeign.getVolunteersPage(keyword, teamId, id);
		if (!apiResponse.getBooleanValue("success")) {
			throw new EminException(apiResponse.getString("code"));
		}
		
		return apiResponse.getJSONArray("result");
	}
	
	/**
	 * 培训评估
	 * @param trainId 培训计划编号
	 * @param personId 关联人员编号
	 * @param score 分数
	 * @return
	 */
	@RequestMapping("/score")
	@ResponseBody
	public JSONObject score(Long trainId, Long personId, Double score) {
		JSONObject apiResponse = new JSONObject();
		
		// 接口调用
		apiResponse = trainingPlanApiFeign.score(personId, trainId, score);
		if (!apiResponse.getBooleanValue("success")) {
			throw new EminException(apiResponse.getString("code"));
		}
		
		return apiResponse;
	}
	
}
