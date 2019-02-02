package com.emin.platform.ec.interfaces;

import com.alibaba.fastjson.JSONObject;

import java.util.List;

import org.springframework.cloud.netflix.feign.FeignClient;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;

/***
 * 志愿者队伍接口桥梁定义
 * @author Danica
 */
@FeignClient(value = "zuul")
public interface VolunteerProcessionApiFeign {
	
	
	@RequestMapping(value = "api-volunteer/mix-team/page",method = RequestMethod.GET)
	JSONObject getPage(@RequestParam(value="queryParam") String queryParam, 
			@RequestParam(value="page") Integer page,
			@RequestParam(value="limit") Integer limit);
	
	@RequestMapping(value = "api-volunteer/mix-team/aggregation/grid",method = RequestMethod.GET)
	JSONObject getGridAggregation(@RequestParam(value="queryParam") String queryParam);
	
	@RequestMapping(value = "api-volunteer/mix-team/createOrUpdate",method = RequestMethod.POST, consumes=MediaType.APPLICATION_JSON_UTF8_VALUE)
	JSONObject save(@RequestBody String data);
	
	@RequestMapping(value = "api-volunteer/mix-team/dismiss",method = RequestMethod.POST, consumes=MediaType.APPLICATION_JSON_UTF8_VALUE)
	JSONObject dismiss(@RequestParam(value="id") Integer id);
	
	@RequestMapping(value = "api-volunteer/mix-team/{id}/baseInfo",method = RequestMethod.GET)
	JSONObject detail(@PathVariable(value="id") Integer id);
	

	@RequestMapping(value = "api-volunteer/mix-team/pageMixSubTeamVol",method = RequestMethod.GET)
	JSONObject getTeamPage(@RequestParam(value="queryParam") String queryParam, 
			@RequestParam(value="page") Integer page,
			@RequestParam(value="limit") Integer limit);
	
	@RequestMapping(value = "api-volunteer/mix-team/pageMixTeamHashVol",method = RequestMethod.GET)
	JSONObject getVolunteersPage(@RequestParam(value="queryParam") String queryParam, 
			@RequestParam(value="page") Integer page,
			@RequestParam(value="limit") Integer limit);
	

	@RequestMapping(value = "api-volunteer/mix-team/{mixTeamId}/batchHandlerGroup",method = RequestMethod.POST, consumes = MediaType.APPLICATION_JSON_UTF8_VALUE)
	JSONObject batchHandlerGroup(@PathVariable(value="mixTeamId") Integer mixTeamId , 
			@RequestParam(value="gids") String gids,
			@RequestParam(value="delSubTeamIds") String delSubTeamIds);
	
	@RequestMapping(value = "api-volunteer/mix-team/{mixTeamId}/batchHandlerHashVolunteer",method = RequestMethod.POST, consumes=MediaType.APPLICATION_JSON_UTF8_VALUE)
	JSONObject batchHandlerHashVolunteer(@PathVariable(value="mixTeamId") Integer mixTeamId , 
			@RequestParam(value="vids") String vids,
			@RequestParam(value="delHashVolIds") String delHashVolIds);
	

	@RequestMapping(value = "api-volunteer/mix-team/leaderDelete",method = RequestMethod.POST, consumes=MediaType.APPLICATION_JSON_UTF8_VALUE)
	JSONObject removeLeader(@RequestParam(value="leaderId") Integer leaderId);
	

	@RequestMapping(value = "api-volunteer/mix-team/addOrUpdateLeader",method = RequestMethod.POST, consumes=MediaType.APPLICATION_JSON_UTF8_VALUE)
	JSONObject relateLeader(@RequestBody String data);

	@RequestMapping(value = "api-volunteer/mix-team/batchAddLeader",method = RequestMethod.POST, consumes=MediaType.APPLICATION_JSON_UTF8_VALUE)
	JSONObject relateLeaders(@RequestBody String data);
	
	@RequestMapping(value = "api-volunteer/mix-team/batchSubTeamMixTeamChanged",method = RequestMethod.POST, consumes=MediaType.APPLICATION_JSON_UTF8_VALUE)
	JSONObject exchangeTeams(@RequestParam(value="mixTeamId") Integer mixTeamId ,
			@RequestParam(value="newMixTeamId") Integer newMixTeamId ,
			@RequestParam(value="gids") String gids);
	
	@RequestMapping(value = "api-volunteer/mix-team/batchHashVolunteerMixTeamChanged",method = RequestMethod.POST, consumes=MediaType.APPLICATION_JSON_UTF8_VALUE)
	JSONObject exchageVolunteers(@RequestParam(value="mixTeamId") Integer mixTeamId ,
			@RequestParam(value="newMixTeamId") Integer newMixTeamId ,
			@RequestParam(value="vids") String vids);
	
	
}
