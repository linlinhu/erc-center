package com.emin.platform.ec.interfaces;

import com.alibaba.fastjson.JSONObject;

import org.springframework.cloud.netflix.feign.FeignClient;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;

/***
 * 授权中心接口桥梁定义
 * @author winnie
 */
@FeignClient(value = "zuul")
public interface AuthorizationApiFeign {
	
	/**
	 * 分页全查询
	 * @param page 当前页码
	 * @param limit 每页显示的记录数
	 * @param module 模块
	 * @param personName 被授权人名字
	 * @param operation 操作
	 * @return
	 */
	@RequestMapping(value = "/api-erdm-event/warrant/queryPage",method = RequestMethod.POST)
	JSONObject queryPage(@RequestParam(value="page") Integer page,
			@RequestParam(value="limit") Integer limit,
			@RequestParam(value="module") String module,
			@RequestParam(value="personName") String personName,
			@RequestParam(value="operation") String operation);
	/**
	 * 授权的启用或者禁用
	 * @param warrantIds 授权id集合
	 * @param activeStatus 状态参数 启用1/禁用0
	 * @return
	 */
	@RequestMapping(value = "/api-erdm-event/warrant/enabled",method = RequestMethod.PUT)
	JSONObject enabled(@RequestParam(value="warrantIds") Integer warrantIds,
			@RequestParam(value="activeStatus") Integer[] activeStatus);
	
	/**
	 * 保存授权信息
	 * @param warrantStr 授权信息JSON字符串
	 * @return
	 */
	@RequestMapping(value = "/api-erdm-event/warrant/saveOrUpdate",method = RequestMethod.POST)
	JSONObject saveOrUpdate(@RequestParam(value="warrantStr") String warrantStr);
	
	/**
	 * 根据id查询详情
	 * @param id 授权id
	 * @return
	 */
	@RequestMapping(value = "/api-erdm-event/warrant/findById",method = RequestMethod.GET)
	JSONObject findById(@RequestParam(value="id") Long id);
	
	/**
	 * 删除授权
	 * @param warrantId 被删除的授权的id
	 * @return
	 */
	@RequestMapping(value = "/api-erdm-event/warrant/deleteById",method = RequestMethod.DELETE)
	JSONObject deleteById(@RequestParam(value="warrantId") Long warrantId);
	
}