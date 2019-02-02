package com.emin.platform.ec.interfaces;

import com.alibaba.fastjson.JSONObject;

import org.springframework.cloud.netflix.feign.FeignClient;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;

/***
 * 职能分类管理接口桥梁定义
 * @author winnie
 */
@FeignClient(value = "zuul")
public interface ProfessionalAbilityApiFeign {
	
	/**
	 * 分页全查询
	 * @param page 当前页码
	 * @param limit 每页显示的记录数
	 * @param queryParam 查询字段
	 * @param groupCode 当前组代号
	 * @return
	 */
	@RequestMapping(value = "api-common/dd/{groupCode}/page",method = RequestMethod.GET)
	JSONObject queryPage(@RequestParam(value="page") Integer page,
			@RequestParam(value="limit") Integer limit,
			@RequestParam(value="queryParam") String queryParam,
			@PathVariable(value="groupCode") String groupCode);
	
	
	/**
	 * 职能分类
	 * @param page 当前页码
	 * @param limit 每页显示的记录数
	 * @param queryParam 查询字段
	 * @return
	 */
	@RequestMapping(value = "/api-volunteer/query/volunteer/proAbilityClassPage",method = RequestMethod.GET)
	JSONObject queryProAbilityClassPage(@RequestParam(value="page") Integer page,
			@RequestParam(value="limit") Integer limit,
			@RequestParam(value="queryParam") String queryParam);
		
}