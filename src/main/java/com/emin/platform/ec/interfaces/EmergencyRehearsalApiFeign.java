package com.emin.platform.ec.interfaces;

import com.alibaba.fastjson.JSONObject;

import org.springframework.cloud.netflix.feign.FeignClient;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;

/***
 * 应急演练接口开发
 * @author winnie
 */
@FeignClient(value = "zuul")
public interface EmergencyRehearsalApiFeign {
	
	/**
	 * 分页全查询
	 * @param page 当前页码
	 * @param limit 每页显示的记录数
	 * @param startTime 开始时间
	 * @param endTime 结束时间
	 * @param over 是否完成演练 true or false
	 * @param keywords 查询字段
	 * @return
	 */
	@RequestMapping(value = "/api-erdm-event/drillEvent/queryPage",method = RequestMethod.GET)
	JSONObject queryPage(@RequestParam(value="page") Integer page,
			@RequestParam(value="limit") Integer limit,
			@RequestParam(value="startTime") Long startTime,
			@RequestParam(value="endTime") Long endTime,
			@RequestParam(value="over") Boolean over,
			@RequestParam(value="keywords") String keywords);
	
	/**
	 * 保存
	 * @param drillEventStr 应急演练信息JSON字符串
	 * @return
	 */
	@RequestMapping(value = "/api-erdm-event/drillEvent/saveOrUpdate",method = RequestMethod.POST)
	JSONObject saveOrUpdate(@RequestParam(value="drillEventStr") String drillEventStr);
	
	/**
	 * 根据id查询详情
	 * @param id 应急演练的id
	 * @return
	 */
	@RequestMapping(value = "/api-erdm-event/drillEvent/findById",method = RequestMethod.GET)
	JSONObject findById(@RequestParam(value="id") Long id);
	
	/**
	 * 删除应急演练
	 * @param drillEventId 被删除的应急演练的id
	 * @return
	 */
	@RequestMapping(value = "/api-erdm-event/drillEvent/deleteById",method = RequestMethod.DELETE)
	JSONObject deleteById(@RequestParam(value="drillEventId") Long drillEventId);
	
	/**
	 * 保存应急演练点评
	 * @param drillEventId 演练事件id
	 * @param chargePersonId 点评人id
	 * @param defect 发现的问题
	 * @param review 演练总结 
	 * @return
	 */
	@RequestMapping(value = "/api-erdm-event/drillEventCommander/review",method = RequestMethod.POST)
	JSONObject saveComment(@RequestParam(value="drillEventId") Long drillEventId,
			@RequestParam(value="chargePersonId") Long chargePersonId,
			@RequestParam(value="defect") String defect,
			@RequestParam(value="review") String review);
	
	/**
	 * 查询应急演练点评
	 * @param drillEventId 演练事件id
	 * @return
	 */
	@RequestMapping(value = "/api-erdm-event/drillEventCommander/findByDrillEventId",method = RequestMethod.GET)
	JSONObject getComments(@RequestParam(value="drillEventId") Long drillEventId);
	
	/**
	 * 获取应急演练队伍
	 * @param drillEventId 演练事件id
	 * @return
	 */
	@RequestMapping(value = "/api-erdm-event/drillEventTeam/findTeamByDrillEventId",method = RequestMethod.POST)
	JSONObject findTeams(@RequestParam(value="drillEventId") Long drillEventId);
	
	/**
	 * 获取应急演练队伍队伍中的成员队伍
	 * @param mixTeamId 应急队伍的id
	 * @return
	 */
	@RequestMapping(value = "/api-volunteer/mix-team/query/{mixTeamId}/subTeamBasicInfo",method = RequestMethod.GET)
	JSONObject findSubTeams(@PathVariable(value="mixTeamId") Integer mixTeamId);
	
	/**
	 * 获取应急演练队伍队伍中的成员队伍
	 * @param queryParam 查询字段 queryParam
	 * @param page 当前页码
	 * @param limit 每页显示的记录数
	 * @return
	 */
	@RequestMapping(value = "api-volunteer/mix-team/pageMixTeamHashVol",method = RequestMethod.GET)
	JSONObject findTeamVol(@RequestParam(value="queryParam") String queryParam,
			@RequestParam(value="page") Integer page,
			@RequestParam(value="limit") Integer limit);
	
	/**
	 * 对应急演练中的队伍或志愿者进行评分
	 * @param drillEventEvaluateStr 演练事件评分信息Json字符串 drillEventEvaluateStr
	 * @return
	 */
	@RequestMapping(value = "api-erdm-event/drillEventEvaluate/saveOrUpdate",method = RequestMethod.POST)
	JSONObject saveEvaluate(@RequestParam(value="drillEventEvaluateStr") String drillEventEvaluateStr);
	
	/**
	 * 查看队伍评分
	 * @param drillEventId 演练事件id drillEventId
	 * @param teamType 演练队伍类型：临时0 固定1
	 * @param teamId 演练事件队伍ID
	 * @param chargePersonId 点评人的id
	 * @return
	 */
	@RequestMapping(value = "api-erdm-event/drillEventEvaluate/findTeamEvaluate",method = RequestMethod.GET)
	JSONObject findTeamEvaluate(@RequestParam(value="drillEventId") Long drillEventId,
			@RequestParam(value="teamType") Integer teamType,
			@RequestParam(value="teamId") Long teamId,
			@RequestParam(value="chargePersonId") Long chargePersonId);	
	
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
	@RequestMapping(value = "api-erdm-event/drillEventEvaluate/findVolunteerIdEvaluate",method = RequestMethod.GET)
	JSONObject findVolunteerEvaluate(@RequestParam(value="drillEventId") Long drillEventId,
			@RequestParam(value="teamType") Integer teamType,
			@RequestParam(value="teamId") Long teamId,
			@RequestParam(value="chargePersonId") Long chargePersonId,
			@RequestParam(value="groupId") Long groupId,
			@RequestParam(value="volunteerId") Long volunteerId);
	
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
	@RequestMapping(value = "api-erdm-event/drillEventTeam/modify",method = RequestMethod.POST)
	JSONObject teamModify(@RequestParam(value="addTeamIds") Long[] addTeamIds,
			@RequestParam(value="addTeamNames") String[] addTeamNames,
			@RequestParam(value="addTeamTypes") Integer[] addTeamTypes,
			@RequestParam(value="delTeamIds") Long[] delTeamIds,
			@RequestParam(value="delTeamTypes") Integer[] delTeamTypes,
			@RequestParam(value="drillEventId") Long drillEventId);
}