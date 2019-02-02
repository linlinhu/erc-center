package com.emin.platform.ec.interfaces;

import com.alibaba.fastjson.JSONObject;
import org.springframework.cloud.netflix.feign.FeignClient;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;


@FeignClient(value = "zuul")
public interface RegionApiFeign {
	
	@RequestMapping(value = "api-erdm-dm/region/findAll",method = RequestMethod.GET)
	JSONObject getTree(@RequestHeader(value="ecmId") Long ecmId);

	@RequestMapping(value = "api-erdm-dm/region/findById",method = RequestMethod.GET)
	JSONObject findById(@RequestParam(value="id") Long id);
	
	@RequestMapping(value = "api-erdm-dm/region/findByName",method = RequestMethod.GET)
	JSONObject findByName(@RequestParam(value="name") String name);
	
	
	@RequestMapping(value = "api-erdm-dm/region/findByPid",method = RequestMethod.GET)
	JSONObject findByPid(@RequestParam(value="pid") Long pid);
	

	@RequestMapping(value = "api-erdm-dm/region/saveOrUpdate",method = RequestMethod.POST)
	JSONObject save(@RequestHeader(value="ecmId") Long ecmId,
			@RequestParam(value="regionStr") String jsonStr);

	@RequestMapping(value = "api-erdm-dm/region/deleteById",method = RequestMethod.GET)
	JSONObject delete(@RequestHeader(value="ecmId") Long ecmId,
			@RequestParam(value="regionId") Long id);
	
	
}
