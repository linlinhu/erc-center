package com.emin.platform.ec.interfaces;

import com.alibaba.fastjson.JSONObject;

import java.lang.reflect.Array;

import org.springframework.cloud.netflix.feign.FeignClient;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;

/***
 * 团体志愿者接口桥梁定义
 * @author winnie
 */
@FeignClient(value = "zuul")
public interface VolunteerTeamApiFeign {
	
	/**
	 * 分页全查询
	 * @param queryParam 查询的参数，json格式
	 * @param page 当前页码
	 * @param limit 每页显示的记录数
	 * @return
	 */
	@RequestMapping(value = "api-volunteer/group/page",method = RequestMethod.GET)
	JSONObject getPage(@RequestParam(value="queryParam") String queryParam, 
			@RequestParam(value="page") Integer page,
			@RequestParam(value="limit") Integer limit);
	/**
	 * 查询组的详情
	 * @param id 组id
	 * @return
	 */
	@RequestMapping(value = "api-volunteer/group/get/{id}",method = RequestMethod.GET)
	JSONObject groupDetail(@PathVariable(value="id") Integer id);

	/**
	 * 志愿者分配
	 * @param groupId 组的id
	 * @param vids 志愿者id数组
	 * @return
	 */
	@RequestMapping(value = "api-volunteer/group/{groupId}/assignment",method = RequestMethod.POST)
	JSONObject assignment(@PathVariable(value="groupId") Integer groupId, 
			@RequestParam(value="vids") Array vids);
	
	/**
	 * 根据id查询组内的成员数量
	 * @param id 组的id
	 * @return
	 */
	@RequestMapping(value = "api-volunteer/group/count/{id}",method = RequestMethod.GET)
	JSONObject memberCount(@PathVariable("id") Integer id);
	
	/**
	 * 保存组信息
	 * @param data 新建或者更新的组信息
	 * @return
	 */
	@RequestMapping(value = "api-volunteer/group/createOrUpdate",method = RequestMethod.POST, consumes=MediaType.APPLICATION_JSON_UTF8_VALUE)
	JSONObject groupCreateOrUpdate(@RequestBody String data);
	
	/**
	 * 删除组（当存在成员时，不能删除）
	 * @param id 被删除的组的id
	 * @return
	 */
	@RequestMapping(value = "api-volunteer/group/delete",method = RequestMethod.POST)
	JSONObject groupDelete(@RequestParam(value="id") Integer id);
	
	/**
	 * 变更志愿者的所属组
	 * @param id 志愿者id
	 * @param newGroupId 新的团队id
	 * @return
	 */
	@RequestMapping(value = "api-volunteer/volunteer/{id}/group/changed",method = RequestMethod.POST)
	JSONObject changeTeam(@PathVariable(value="id") Integer id,
			@RequestParam(value="newGroupId") Integer newGroupId);
	/**
	 * 团体志愿者淘汰
	 * @param id 团体志愿者id
	 * @return
	 */
	@RequestMapping(value = "api-volunteer/group/{id}/dismissal",method = RequestMethod.POST)
	JSONObject dismissal(@PathVariable(value="id") Integer id);
	
	/**
	 * 团体志愿者录用
	 * @param id 团体志愿者id
	 * @return
	 */
	@RequestMapping(value = "api-volunteer/group/{id}/employment",method = RequestMethod.POST)
	JSONObject employment(@PathVariable(value="id") Integer id);
	
}
