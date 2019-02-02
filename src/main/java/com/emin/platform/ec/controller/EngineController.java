package com.emin.platform.ec.controller;

import com.alibaba.fastjson.JSONObject;
import com.emin.base.controller.BaseController;
import com.emin.base.exception.EminException;
import com.emin.platform.ec.filter.MenuOperationFilter;
import com.emin.platform.ec.interfaces.EngineApiFeign;
import com.emin.platform.ec.util.HttpSessionHelper;

import org.apache.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.ModelAndView;


@RestController
@RequestMapping("/engine")
public class EngineController extends BaseController {
	private static final Logger LOGGER = Logger.getLogger(EngineController.class);
	@Value("${spring.application.code}")
	private String appCode;
	
	@Autowired
	transient MenuOperationFilter menuOperationFilter;
	
    @Autowired
    private EngineApiFeign feign;

    private static final String GROUP_CODE = "ai-evaluation-engine-config";
    private static final String MORALITY_ITEMS_CODE = "evaluation-morality";
    private static final String FUNCTION_ITEMS_CODE = "evaluation-function";
    private static final String ACTIVITY_ITEMS_CODE = "evaluation-activity";
    private static final String TRAIN_ITEMS_CODE = "evaluation-train";


    /**
     * 主页跳转
     *
     * @return ModelAndView 主页视图
     */
    @GetMapping("/index")
    public ModelAndView index() {
        ModelAndView mv = new ModelAndView("modules/engine/manage");
        JSONObject moralityRes = new JSONObject();
        try {
        	moralityRes = feign.queryByCode(GROUP_CODE, MORALITY_ITEMS_CODE);
        } catch (Exception e) {
        	LOGGER.error("技能评估引擎主页加载【查询道德评估数据】报错！错误信息->" + e.getMessage());
        	e.printStackTrace();	
        }
        if (!moralityRes.isEmpty()) {
	        this.dealException(moralityRes);
	        mv.addObject("morality", moralityRes.getJSONObject("result"));
        }
        JSONObject functionRes = new JSONObject();
        try {
        	functionRes = feign.queryByCode(GROUP_CODE, FUNCTION_ITEMS_CODE);
        } catch (Exception e) {
        	LOGGER.error("技能评估引擎主页加载【查询职能评估数据】报错！错误信息->" + e.getMessage());
        	e.printStackTrace();	
        }
        if (!functionRes.isEmpty()) {
            this.dealException(functionRes);
            mv.addObject("function", functionRes.getJSONObject("result"));
        }
        
        
        JSONObject activityRes = new JSONObject();
        try {
        	activityRes = feign.queryByCode(GROUP_CODE, ACTIVITY_ITEMS_CODE);
        } catch (Exception e) {
        	LOGGER.error("技能评估引擎主页加载【查询活跃度评估数据】报错！错误信息->" + e.getMessage());
        	e.printStackTrace();	
        }
        if (!activityRes.isEmpty()) {
            this.dealException(activityRes);
            mv.addObject("activity", activityRes.getJSONObject("result"));
        }
        
        JSONObject trainRes = new JSONObject();
        try {
        	trainRes = feign.queryByCode(GROUP_CODE, TRAIN_ITEMS_CODE);
        } catch (Exception e) {
        	LOGGER.error("技能评估引擎主页加载【查询培训评估数据】报错！错误信息->" + e.getMessage());
        	e.printStackTrace();	
        }
        if (!trainRes.isEmpty()) {
            this.dealException(trainRes);
            mv.addObject("train", trainRes.getJSONObject("result"));
        }
        
        
        String operationCodes = null;
        try {
	        HttpSessionHelper sessionHelper = HttpSessionHelper.create(this);
	        Long userId = sessionHelper.sessionUserId();
			JSONObject params = new JSONObject();
			params.putIfAbsent("userId", userId);
			operationCodes = menuOperationFilter.menuOperations("engine", params);
        } catch (Exception e) {
        	LOGGER.error("技能评估引擎主页加载【查询模块权限】报错！错误信息->" + e.getMessage());
        	e.printStackTrace();	
        }
        if (operationCodes != null) {
        	mv.addObject("operationCodes", operationCodes);
        }
        return mv;
    }


    /**
     * 道德评价引擎设置
     *
     * @param initScore  最低分
     * @param levelScore 等级平均分
     * @return
     */
    @PostMapping("/evaluationMorality")
    public JSONObject evaluationMorality(@RequestParam Integer initScore, @RequestParam Integer levelScore) {
    	JSONObject apiResponse  = new JSONObject();
        JSONObject res = feign.queryByCode(GROUP_CODE, MORALITY_ITEMS_CODE);
        apiResponse = this.updateEvaluation(res, initScore, levelScore, null, 1);
        return apiResponse;
    }

    /**
     * 更新评价引擎设置共通方法
     *
     * @param res        Feign调用返回结果
     * @param initScore  最低分
     * @param levelScore 等级平均分
     * @param totalScore 分数评分制总分
     * @param flag       标志:1->代表等级评分制；2->代表分数评分制
     * @return
     */
    private JSONObject updateEvaluation(JSONObject res, Integer initScore, Integer levelScore, Integer totalScore, int flag) {
    	JSONObject apiResponse = new JSONObject();
        this.dealException(res);
        JSONObject json = res.getJSONObject("result");
        String value = json.getString("value");
        JSONObject valueJson = JSONObject.parseObject(value);
        if (1 == flag) {
            valueJson.put("initScore", initScore);
            valueJson.put("levelScore", levelScore);
        } else {
            valueJson.put("totalScore", totalScore);
        }
        json.put("value", valueJson.toJSONString());
        apiResponse = feign.createOrUpdateCode(json.toJSONString());
        this.dealException(apiResponse);
        return apiResponse;
    }

    /**
     * 职能评估引擎设置
     *
     * @param initScore  最低分
     * @param levelScore 等级平均分
     * @return
     */
    @PostMapping("/evaluationFunction")
    public JSONObject evaluationFunction(@RequestParam Integer initScore, @RequestParam Integer levelScore) {
    	JSONObject apiResponse  = new JSONObject();
        JSONObject res = feign.queryByCode(GROUP_CODE, FUNCTION_ITEMS_CODE);
        apiResponse = this.updateEvaluation(res, initScore, levelScore, null, 1);
        return apiResponse;
    }

    /**
     * 活动评估引擎设置
     *
     * @param initScore  最低分
     * @param levelScore 等级平均分
     * @return
     */
    @PostMapping("/evaluationActivity")
    public JSONObject evaluationActivity(@RequestParam Integer initScore, @RequestParam Integer levelScore) {
    	JSONObject apiResponse  = new JSONObject();
        JSONObject res = feign.queryByCode(GROUP_CODE, ACTIVITY_ITEMS_CODE);
        apiResponse = this.updateEvaluation(res, initScore, levelScore, null, 1);
        return apiResponse;
    }

    /**
     * 培训评估引擎设置
     *
     * @param totalScore 总分
     * @return
     */
    @PostMapping("/evaluationTrain")
    public JSONObject evaluationTrain(@RequestParam Integer totalScore) {
    	JSONObject apiResponse  = new JSONObject();
        JSONObject res = feign.queryByCode(GROUP_CODE, TRAIN_ITEMS_CODE);
        apiResponse = this.updateEvaluation(res, null, null, totalScore, 2);
        return apiResponse;
    }

    /**
     * 异常处理共通方法
     *
     * @param res Feign调用返回结果
     * @return
     */
    private void dealException(JSONObject res) {
        if (!res.getBooleanValue("success")) {
            throw new EminException(res.getString("code"));
        }
    }

}
