package com.emin.platform.ec.interfaces;

import com.alibaba.fastjson.JSONObject;

import org.springframework.cloud.netflix.feign.FeignClient;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;

/***
 * 工作人员管理接口桥梁定义
 * @author winnie
 */
@FeignClient(value = "zuul")
public interface StaffApiFeign {
	
	/**
	 * 分页查询
	 * @param page 当前页码
	 * @param limit 每页显示的记录数
	 * @param keyword 查询字段
	 * @param orgId 组织结构的id
	 * @return
	 */
	@RequestMapping(value = "/api-erdm-user/personOrg/listPageOfOrg",method = RequestMethod.GET)
	JSONObject queryPage(@RequestParam(value="keyword") String keyword,
			@RequestParam(value="page") Integer page,
			@RequestParam(value="limit") Integer limit,
			@RequestParam(value="orgId") Long orgId);
	
	/**
	 * 分页查询
	 * @param page 当前页码
	 * @param limit 每页显示的记录数
	 * @param keyword 查询字段
	 * @param orgId 组织结构的id
	 * @return
	 */
	@RequestMapping(value = "/api-erdm-user/personOrg/enableListPageOfOrg",method = RequestMethod.GET)
	JSONObject queryValidPage(@RequestParam(value="keyword") String keyword,
			@RequestParam(value="page") Integer page,
			@RequestParam(value="limit") Integer limit,
			@RequestParam(value="orgId") Long orgId);
	
	/**
	 * 保存工作人员
	 * @param orgIds 所属组织的id数组
	 * @param orgNames 所属组织的名称数组
	 * @param id 工作人员id
	 * @param mobile 手机号码
	 * @param realName 真实姓名
	 * @param gender 性别
	 * @return
	 */
	@RequestMapping(value = "/api-erdm-user/personOrg/saveOrUpdate",method = RequestMethod.POST)
	JSONObject saveOrUpdate(@RequestParam(value="orgIds") Long[] orgIds,
			@RequestParam(value="orgNames") String[] orgNames,
			@RequestParam(value="id") Long id,
			@RequestParam(value="mobile") String mobile,
			@RequestParam(value="realName") String realName,
			@RequestParam(value="gender") Integer gender);
	
	/**
	 * 添加用户所属组织关系
	 * @param personId 用户id
	 * @param orgId 所属组织的id
	 * @return
	 */
	@RequestMapping(value = "/api-erdm-user/personOrg/addPersonOrg",method = RequestMethod.POST)
	JSONObject addPersonOrg(@RequestParam(value="personId") Long personId,
			@RequestParam(value="orgId") Long orgId);
	
	/**
	 * 删除用户所属组织关系
	 * @param personId 用户id
	 * @param orgId 所属组织的id
	 * @return
	 */
	@RequestMapping(value = "/api-erdm-user/personOrg/deletePersonOrg",method = RequestMethod.DELETE)
	JSONObject deletePersonOrg(@RequestParam(value="personId") Long personId,
			@RequestParam(value="orgId") Long orgId);
	
	/**
	 * 变更用户所属组织关系
	 * @param personId 用户id
	 * @param orgId 所属组织的id
	 * @return
	 */
	@RequestMapping(value = "/api-erdm-user/personOrg/modifyPersonOrg",method = RequestMethod.DELETE)
	JSONObject modifyPersonOrg(@RequestParam(value="personId") Long personId,
			@RequestParam(value="orgId") Long orgId);
	/**
	 * 根据id查询详情
	 * @param personId 工作人员id
	 * @return
	 */
	@RequestMapping(value = "/api-erdm-user/personOrg/queryDetail",method = RequestMethod.POST)
	JSONObject queryDetail(@RequestParam(value="personId") Long personId);
	/**
	 * 
	 * @param id 工作人员id
	 * @return
	 */
	@RequestMapping(value = "/api-erdm-user/erdm/user/delete",method = RequestMethod.POST)
	JSONObject delete(@RequestParam(value="id") Long id);
	
	/**
	 * 工作人员的启用与禁用
	 * @param id 工作人员id
	 * @param status 状态 true or false
	 * @return
	 */
	@RequestMapping(value = "/api-erdm-user/erdm/user/status",method = RequestMethod.POST)
	JSONObject changeStatus(@RequestParam(value="id") Long id,
			@RequestParam(value="status") Boolean status);
	
	/**
	 * 删除工作人员的所属组织
	 * @param personId 工作人员personId
	 * @param orgIds 组织的id数组
	 * @return
	 */
	@RequestMapping(value = "/api-erdm-user/personOrg/deletePersonOrgByPersonId",method = RequestMethod.DELETE)
	JSONObject deletePersonOrgByPersonId(@RequestParam(value="personId") Long personId,
			@RequestParam(value="orgIds") Long[] orgIds);
	
}