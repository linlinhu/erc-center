package com.emin.platform.ec.interfaces;

import com.alibaba.fastjson.JSONObject;

import org.springframework.cloud.netflix.feign.FeignClient;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;

/***
 * 应急事件接口开发
 * @author winnie
 */
@FeignClient(value = "zuul")
public interface EmergencyEventApiFeign {
	
	/**
	 * 分页全查询
	 * @param page 当前页码
	 * @param limit 每页显示的记录数
	 * @param regionId 区域id
	 * @param eventType 事件类型
	 * @param eventNature 事件性质
	 * @return
	 */
	@RequestMapping(value = "/api-erdm-event/event/queryPage",method = RequestMethod.GET)
	JSONObject queryPage(@RequestParam(value="page") Integer page,
			@RequestParam(value="limit") Integer limit,
			@RequestParam(value="regionId") Long regionId,
			@RequestParam(value="eventType") String eventType,
			@RequestParam(value="eventNature") Integer eventNature);
	
	/**
	 * 保存
	 * @param eventStr 事件信息JSON字符串
	 * @return
	 */
	@RequestMapping(value = "/api-erdm-event/event/saveOrUpdate",method = RequestMethod.POST)
	JSONObject saveOrUpdate(@RequestParam(value="eventStr") String eventStr);
	
	/**
	 * 根据id查询详情
	 * @param id 事件id
	 * @return
	 */
	@RequestMapping(value = "/api-erdm-event/event/findById",method = RequestMethod.GET)
	JSONObject findById(@RequestParam(value="id") Long id);
	
	/**
	 * 删除应急事件
	 * @param eventId 被删除的事件的id
	 * @return
	 */
	@RequestMapping(value = "/api-erdm-event/event/deleteById",method = RequestMethod.DELETE)
	JSONObject deleteById(@RequestParam(value="eventId") Long eventId);
	
	/**
	 * 发布应急事件
	 * @param eventId 事件的id
	 * @return
	 */
	@RequestMapping(value = "/api-erdm-event/event/publish",method = RequestMethod.PUT)
	JSONObject publish(@RequestParam(value="eventId") Long eventId);
	/**
	 * 撤销应急事件
	 * @param eventId 事件的id
	 * @return
	 */
	@RequestMapping(value = "/api-erdm-event/event/undo",method = RequestMethod.PUT)
	JSONObject undo(@RequestParam(value="eventId") Long eventId);
	
}