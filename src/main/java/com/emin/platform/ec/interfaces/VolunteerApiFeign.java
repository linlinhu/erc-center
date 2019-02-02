package com.emin.platform.ec.interfaces;

import com.alibaba.fastjson.JSONObject;

import org.springframework.cloud.netflix.feign.FeignClient;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;


@FeignClient(value = "zuul")
public interface VolunteerApiFeign {
	
	/**
	 * 分页查询
	 * @param page 当前页码
	 * @param limit 每页显示的记录数
	 * @param queryParam 查询字段，json对象
	 * @return
	 */
	@RequestMapping(value = "api-volunteer/query/volunteer/page",method = RequestMethod.GET)
	JSONObject getPage(@RequestParam(value="queryParam") String queryParam, 
			@RequestParam(value="page") Integer page, 
			@RequestParam(value="limit") Integer limit);
	
	/**
	 * 查询志愿者详情
	 * @param id 志愿者id
	 * @return
	 */
	@RequestMapping(value = "api-volunteer/volunteer/get/{id}",method = RequestMethod.GET)
	JSONObject detail(@PathVariable("id") Integer id);
	
	/**
	 * 查询平台的志愿者总数
	 * @param ecmId 平台的id
	 * @return
	 */
	@RequestMapping(value = "api-volunteer/volunteer/stats/{ecmId}/stats",method = RequestMethod.GET)
	JSONObject getCount(@PathVariable("ecmId") Integer ecmId,
			@RequestParam(value="orgCode") String orgCode,
			@RequestParam(value="isDeepStats") Boolean isDeepStats);
	
	/**
	 * 保存志愿者
	 * @param data 志愿者信息
	 * @return
	 */
	@RequestMapping(value = "api-volunteer/volunteer/createOrUpdate",method = RequestMethod.POST, consumes=MediaType.APPLICATION_JSON_UTF8_VALUE)
	JSONObject save(@RequestBody String data);
	
	/**
	 * 删除志愿者志愿者
	 * @param vid 志愿者id
	 * @return
	 */
	@RequestMapping(value = "api-volunteer/volunteer/delete",method = RequestMethod.POST)
	JSONObject delete(@RequestParam(value="vid") Integer vid);
	
	/**
	 * 校验身份证号码
	 * @param IDNumber 身份证号码
	 * @return
	 */
	@RequestMapping(value = "api-volunteer/volunteer/checkExistIDNumber",method = RequestMethod.POST)
	JSONObject checkExistIDNumber(@RequestParam(value="IDNumber") String IDNumber );
	
	/**
	 * 查询所有平台
	 * @return
	 */
	@RequestMapping(value = "/api-erdm-ecm/ecm/findAllEcm",method = RequestMethod.GET, consumes= {"application/json;charset=UTF-8"})
	JSONObject findAllEcm();
	
	/**
	 * 志愿者淘汰
	 * @param id 志愿者id
	 * @return
	 */
	@RequestMapping(value = "api-volunteer/volunteer/{id}/dismissal",method = RequestMethod.POST)
	JSONObject dismissal(@PathVariable(value="id") Integer id);
	
	/**
	 * 志愿者录用
	 * @param id 志愿者id
	 * @return
	 */
	@RequestMapping(value = "api-volunteer/volunteer/{id}/employment",method = RequestMethod.POST)
	JSONObject employment(@PathVariable(value="id") Integer id);
	
	/**
	 * 志愿者技能评估结果
	 * @param id 志愿者id
	 * @return
	 */
	@RequestMapping(value = "api-volunteer/query/volunteer/evaluate/{id}/comprehensive",method = RequestMethod.GET)
	JSONObject comprehensive(@PathVariable(value="id") Integer id);
	
	/**
	 * 查询志愿者的生命周期
	 * @return
	 */
	@RequestMapping(value = "api-volunteer/volunteer/scopes",method = RequestMethod.GET)
	JSONObject scopes();
	
	/**
	 * 查询某位置的注册志愿者
	 * @param longitude 经度
	 * @param latitude 维度
	 * @param radius 查询半径 单位m，默认20Km
	 * @return
	 */
	@RequestMapping(value = "api-volunteer/query/volunteer/stats/gis/register",method = RequestMethod.GET)
	JSONObject registerSpread(@RequestParam(value="longitude") Double longitude,
			@RequestParam(value="latitude") Double latitude,
			@RequestParam(value="radius") Double radius);
	
	/**
	 * 查询平台某月新增志愿者数量
	 * @param year 年
	 * @param month 月
	 * @return
	 */
	@RequestMapping(value = "api-volunteer/query/volunteer/stats/own/increaseStats",method = RequestMethod.GET)
	JSONObject increaseInfo(@RequestParam(value="year") Integer year,
			@RequestParam(value="month") Integer month);
}
