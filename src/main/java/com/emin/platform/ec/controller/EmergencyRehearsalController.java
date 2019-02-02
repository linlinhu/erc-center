package com.emin.platform.ec.controller;

import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.Date;

import org.apache.commons.lang3.time.DateFormatUtils;
import org.apache.commons.lang3.time.DateUtils;
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
import com.emin.platform.ec.filter.TimeFilterFunction;
import com.emin.platform.ec.interfaces.EmergencyRehearsalApiFeign;
import com.emin.platform.ec.util.HttpSessionHelper;

/**
 * 应急演练控制层
 * @author winnie
 *
 */
@Controller
@RequestMapping("/emergency-rehearsal")
public class EmergencyRehearsalController extends BaseController {
	private static final Logger LOGGER = Logger.getLogger(DataDicController.class);
	@Value("${spring.application.code}")
	private String appCode;
	
	@Autowired
	transient MenuOperationFilter menuOperationFilter;
	
	@Autowired
	EmergencyRehearsalApiFeign emergencyRehearsalApiFeign; // 应急演练api
	
	/**
	 * 主页跳转，并加载列表
	 * @return
	 */
	@RequestMapping("/index")
	@ResponseBody
	public ModelAndView index(String keyword, String startTime, String endTime, Boolean over) {
		ModelAndView mv = new ModelAndView("modules/emergency-rehearsal/manage");
		// 加载首页列表
		JSONObject res = new JSONObject();
		Long startTimes = null;
        Long endTimes = null;
        if(startTime!=null) {
			startTimes = this.date2Timestamp(startTime,"yyyy-MM-dd hh:mm:ss");
		}
		if(endTime!=null) {
			endTimes = this.date2Timestamp(endTime,"yyyy-MM-dd hh:mm:ss");
		}
		if(startTimes!=null && endTimes!=null && startTimes >= endTimes){
			throw new EminException("ERC_CENTER_0.0.101");
		}
		try {
			Integer limit = getPageRequestData().getLimit();
            Integer page = getPageRequestData().getCurrentPage();
          
			if(over == null){
				over = false;
			};
			
			mv.addObject("keyword", keyword);
			mv.addObject("startTime", startTimes);
			mv.addObject("endTime", endTimes);
			mv.addObject("over", over.toString());
			res = emergencyRehearsalApiFeign.queryPage(page, limit, startTimes, endTimes, over, keyword);
		} catch(Exception e) {
			LOGGER.error("应急演练首页加载列表报错！错误信息->" + e.getMessage());
        	e.printStackTrace();
		}
		if (!res.isEmpty()) {
			if (!res.getBooleanValue("success")) {
				throw new EminException(res.getString("code"));
			}
			mv.addObject("pages", res.getJSONObject("result"));
		}
		// 加载模块权限
		String operationCodes = null;
		try {
			HttpSessionHelper sessionHelper = HttpSessionHelper.create(this);
			Long userId = sessionHelper.sessionUserId();
			JSONObject params = new JSONObject();
			params.putIfAbsent("userId", userId);
			operationCodes = menuOperationFilter.menuOperations("emergency-rehearsal", params);
		} catch(Exception e) {
			LOGGER.error("应急演练首页加载模块权限报错！错误信息->" + e.getMessage());
        	e.printStackTrace();
		}
		if (operationCodes != null) {
			mv.addObject("operationCodes", operationCodes);
		}
		
		return mv;
	}
	
	/**
	 * 表单跳转
	 * @param id 编辑时传递应急演练的id
	 * @return
	 */
	@RequestMapping("/form")
	@ResponseBody
	public ModelAndView goForm(Long id) {
		ModelAndView mv = new ModelAndView("modules/emergency-rehearsal/form");
		if (id != null) {
			JSONObject info = new JSONObject();
			try {
				info = emergencyRehearsalApiFeign.findById(id);
			} catch(Exception e) {
				LOGGER.error("应急演练表单页面加载实体详情报错！错误信息->" + e.getMessage());
	        	e.printStackTrace();
			}
			if (!info.isEmpty()) {
				if (!info.getBooleanValue("success")) {
					throw new EminException(info.getString("code"));
				}
				mv.addObject("info", info.getJSONObject("result"));
			}
		}
		
		return mv;
	}
	
	/**
	 * 获取分页数据
	 * @return
	 */
	@RequestMapping("/getPage")
	@ResponseBody
	public JSONObject getPage(String keyword, Long startTime, Long endTime, Boolean over){
		JSONObject resJson = new JSONObject();
		JSONObject res = new JSONObject();
		
		Integer limit = getPageRequestData().getLimit();
        Integer page = getPageRequestData().getCurrentPage();
		if(over == null){
			over = false;
		};
		resJson.put("keyword", keyword);
		resJson.put("startTime", startTime);
		resJson.put("endTime", endTime);
		resJson.put("over", over.toString());
		res = emergencyRehearsalApiFeign.queryPage(page, limit, startTime, endTime, over, keyword);
	
		if (!res.getBooleanValue("success")) {
			throw new EminException(res.getString("code"));
		}
		resJson.put("pages", res.getJSONObject("result"));
		
		// 加载模块权限
		String operationCodes = null;
		HttpSessionHelper sessionHelper = HttpSessionHelper.create(this);
		Long userId = sessionHelper.sessionUserId();
		JSONObject params = new JSONObject();
		params.putIfAbsent("userId", userId);
		operationCodes = menuOperationFilter.menuOperations("data-dic", params);
		
		if (operationCodes != null) {
			resJson.put("operationCodes", operationCodes);
		}
		return resJson;
    }
	/**
	 * 保存
	 * @param data 应急演练实体字符串
	 * @return
	 */
	@RequestMapping("/save")
	@ResponseBody
	public JSONObject save(String data){
		JSONObject resJson = new JSONObject();
		final JSONObject jsonObject = JSONObject.parseObject(data);
		final long curTime = System.currentTimeMillis();
		this.compareAndConverter(jsonObject,"startTime",(time)->{
			if(curTime>=time){
				throw new EminException("ERC_CENTER_0.0.102");
			}
		});
		this.compareAndConverter(jsonObject,"endTime",(time)->{
			Long startTime = jsonObject.getLong("startTime");
			if(startTime>=time){
				throw new EminException("ERC_CENTER_0.0.101");
			}
		});
		resJson = emergencyRehearsalApiFeign.saveOrUpdate(jsonObject.toJSONString());
		if(!resJson.getBoolean("success")){
			throw new EminException(resJson.getString("code"));
		}
		return resJson;
    }
	
	private void compareAndConverter(JSONObject jsonObject ,String key,TimeFilterFunction filter) {
		Long time = this.date2Timestamp(jsonObject.getString(key),"yyyy-MM-dd hh:mm:ss");
		filter.dohandler(time);
		jsonObject.put(key, time);
	}

	
	private Long date2Timestamp(String dateString,String format) {
		SimpleDateFormat fSimpleDateFormat = new SimpleDateFormat(format);
		try {
			Date date = fSimpleDateFormat.parse(dateString);
			return date.getTime();
		} catch (ParseException e) {
			return null;
		}
	}
	
	/**
	 * 删除
	 * @param id 应急演练id
	 * @return
	 */
	@RequestMapping("/remove")
	@ResponseBody
	public JSONObject remove(Long id){
		JSONObject resJson = new JSONObject();
		resJson = emergencyRehearsalApiFeign.deleteById(id);
		if(!resJson.getBoolean("success")){
			throw new EminException(resJson.getString("code"));
		}
		return resJson;
    }
	
	/**
	 * 保存点评
	 * @param drillEventId 应急演练id
	 * @return
	 */
	@RequestMapping("/saveComment")
	@ResponseBody
	public JSONObject saveComment(Long drillEventId, Long chargePersonId, String defect, String review){
		JSONObject resJson = new JSONObject();
		resJson = emergencyRehearsalApiFeign.saveComment(drillEventId, chargePersonId, defect, review);
		if(!resJson.getBoolean("success")){
			throw new EminException(resJson.getString("code"));
		}
		return resJson;
    }
	
	/**
	 * 获取点评列表
	 * @param drillEventId 应急演练id
	 * @return
	 */
	@RequestMapping("/getComments")
	@ResponseBody
	public JSONObject getComments(Long drillEventId){
		JSONObject resJson = new JSONObject();
		resJson = emergencyRehearsalApiFeign.getComments(drillEventId);
		if(!resJson.getBoolean("success")){
			throw new EminException(resJson.getString("code"));
		}
		return resJson;
    }
	
	/**
	 * 获取演练队伍中的团队
	 * @param drillEventId 应急演练id
	 * @param getSub true:查询队伍中的团体， false：不查询队伍中的团体
	 * @return
	 */
	@RequestMapping("/getTeams")
	@ResponseBody
	public JSONArray getTeams(Long drillEventId, String getSub){
		JSONObject resJson = new JSONObject();
		resJson = emergencyRehearsalApiFeign.findTeams(drillEventId);
		if(!resJson.getBoolean("success")){
			throw new EminException(resJson.getString("code"));
		};
		JSONArray result = resJson.getJSONArray("result");
		if("true".equals(getSub)) {
			for(int i = 0; i < result.size(); i++){
				JSONObject item = result.getJSONObject(i);
				Integer mixTeamId = item.getInteger("teamId");
				JSONObject subTeams = emergencyRehearsalApiFeign.findSubTeams(mixTeamId);
				if(!subTeams.getBoolean("success")){
					throw new EminException(subTeams.getString("code"));
				};
				item.put("subTeams", subTeams.getJSONArray("result"));
				//result.add(i, item);
			}
		}
		return result;
    }
	
	/**
	 * 获取演练队伍中的志愿者
	 * @param drillEventId 应急演练id
	 * @return
	 */
	@RequestMapping("/findTeamVol")
	@ResponseBody
	public JSONObject findTeamVol(String mixTeamId){
		JSONObject resJson = new JSONObject();
		Integer limit = getPageRequestData().getLimit();
        Integer page = getPageRequestData().getCurrentPage();
        JSONObject queryParam = new JSONObject();
        queryParam.putIfAbsent("mixTeamId", mixTeamId);
		resJson = emergencyRehearsalApiFeign.findTeamVol(queryParam.toString(), page, limit);
		if(!resJson.getBoolean("success")){
			throw new EminException(resJson.getString("code"));
		};
		return resJson;
    }
	
	/**
	 * 保存评分
	 * @param data 演练事件评分信息Json字符串
	 * @return
	 */
	@RequestMapping("/saveEvaluate")
	@ResponseBody
	public JSONObject saveEvaluate(String data){
		JSONObject resJson = new JSONObject();
		resJson = emergencyRehearsalApiFeign.saveEvaluate(data);
		if(!resJson.getBoolean("success")){
			throw new EminException(resJson.getString("code"));
		};
		return resJson;
    }
	
	/**
	 * 查看队伍评分
	 * @param drillEventId 演练事件id drillEventId
	 * @param teamType 演练队伍类型：临时0 固定1
	 * @param teamId 演练事件队伍ID
	 * @param chargePersonId 点评人的id
	 * @return
	 */
	@RequestMapping("/findTeamEvaluate")
	@ResponseBody
	public JSONObject findTeamEvaluate(Long drillEventId, Integer teamType, Long teamId, Long chargePersonId){
		JSONObject resJson = new JSONObject();
		resJson = emergencyRehearsalApiFeign.findTeamEvaluate(drillEventId, teamType, teamId, chargePersonId);
		if(!resJson.getBoolean("success")){
			throw new EminException(resJson.getString("code"));
		};
		return resJson;
    }
	
	/**
	 * 查看志愿者评分
	 * @param drillEventId 演练事件id drillEventId
	 * @param teamType 演练队伍类型：临时0 固定1
	 * @param teamId 演练事件队伍ID
	 * @param chargePersonId 点评人的id
	 * @param groupId 团队ID
	 * @param volunteerId 志愿者ID
	 * @return
	 */
	@RequestMapping("/findVolunteerEvaluate")
	@ResponseBody
	public JSONObject findVolunteerEvaluate(Long drillEventId, Integer teamType, Long teamId, Long chargePersonId, Long groupId, Long volunteerId){
		JSONObject resJson = new JSONObject();
		resJson = emergencyRehearsalApiFeign.findVolunteerEvaluate(drillEventId, teamType, teamId, chargePersonId, groupId, volunteerId);
		if(!resJson.getBoolean("success")){
			throw new EminException(resJson.getString("code"));
		};
		return resJson;
    }
	
	/**
	 * 编辑演练队伍
	 * @param addTeamIds 增加参与演练队伍ID集合
	 * @param addTeamNames 增加参与演练队伍名称集合
	 * @param addTeamTypes 增加参与演练队伍类型集合：临时0 固定1
	 * @param delTeamIds 删除参与演练队伍ID集合
	 * @param delTeamTypes 删除参与演练队伍类型集合：临时0 固定1
	 * @param drillEventId 演练ID
	 * @return
	 */
	@RequestMapping("/teamModify")
	@ResponseBody
	public JSONObject teamModify(Long[] addTeamIds, String[] addTeamNames, Integer[] addTeamTypes, Long[] delTeamIds, Integer[] delTeamTypes, Long drillEventId){
		JSONObject resJson = new JSONObject();
		resJson = emergencyRehearsalApiFeign.teamModify(addTeamIds, addTeamNames, addTeamTypes, delTeamIds, delTeamTypes, drillEventId);
		if(!resJson.getBoolean("success")){
			throw new EminException(resJson.getString("code"));
		};
		return resJson;
    }
}
