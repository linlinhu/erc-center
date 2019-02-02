package com.emin.platform.ec.interfaces;

import com.alibaba.fastjson.JSONObject;

import org.springframework.cloud.netflix.feign.FeignClient;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;

/**
 * 临时应急队伍接口定义
 * @author Danica
 *
 */
@FeignClient(value = "zuul")
public interface TempProcessionApiFeign {

	@RequestMapping(value = "api-volunteer/temp-mix-team/get/{id}",method = RequestMethod.GET)
	JSONObject detail(@PathVariable(value="id") Integer id);
	
	@RequestMapping(value = "api-volunteer/temp-mix-team/createOrUpdate",method = RequestMethod.POST, consumes=MediaType.APPLICATION_JSON_UTF8_VALUE)
	JSONObject save(@RequestBody String data);
	
	@RequestMapping(value = "api-volunteer/temp-mix-team/pageTempMixSubTeamVol",method = RequestMethod.GET)
	JSONObject getTeamPage(@RequestParam(value="queryParam") String queryParam, 
			@RequestParam(value="page") Integer page,
			@RequestParam(value="limit") Integer limit);
	
	@RequestMapping(value = "api-volunteer/temp-mix-team/pageTempMixTeamHashVol",method = RequestMethod.GET)
	JSONObject getVolunteersPage(@RequestParam(value="queryParam") String queryParam, 
			@RequestParam(value="page") Integer page,
			@RequestParam(value="limit") Integer limit);
	
	/**
	 * 批量关联志愿者团队或者志愿者
	 * {
	  "ecmId": 0,
	  "ecmName": "string",
	  "groupVolunteerIds": [
	    0
	  ],
	  "hasVolunteerIds": [
	    0
	  ],
	  "id": 0
	}
	 * @param data
	 * @return
	 */
	@RequestMapping(value = "api-volunteer/temp-mix-team/batchAssign",method = RequestMethod.POST, consumes=MediaType.APPLICATION_JSON_UTF8_VALUE)
	JSONObject batchAssign(@RequestBody String data);
	

	/**
	 * 批量删除关联志愿者
	 * @param tempMixTeamId 临时队伍编号
	 * @param tempHashVids 关联志愿者编号
	 * @return
	 */
	@RequestMapping(value = "api-volunteer/temp-mix-team/batchDelTempHashVol",method = RequestMethod.POST, consumes=MediaType.APPLICATION_JSON_UTF8_VALUE)
	JSONObject batchDelTempHashVol(@RequestParam(value="tempMixTeamId") Integer tempMixTeamId,
			@RequestParam(value="tempHashVids") Long[] tempHashVids);
	
	/**
	 * 批量删除关联志愿者团队
	 * @param tempMixTeamId 临时队伍编号
	 * @param tempSubTeamIds 关联志愿者团队编号
	 * @return
	 */
	@RequestMapping(value = "api-volunteer/temp-mix-team/batchDelTempSubTeam",method = RequestMethod.POST, consumes=MediaType.APPLICATION_JSON_UTF8_VALUE)
	JSONObject batchDelTempSubTeam(@RequestParam(value="tempMixTeamId") Integer tempMixTeamId,
			@RequestParam(value="tempSubTeamIds") Long[] tempSubTeamIds);
	
	
	
}
