package com.emin.platform.ec.interfaces;

import com.alibaba.fastjson.JSONObject;
import org.springframework.cloud.netflix.feign.FeignClient;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;


@FeignClient(value = "zuul")
public interface RegionGridApiFeign {
	
	@RequestMapping(value = "api-erdm-dm/regionGrid/findAllByRegionId",method = RequestMethod.GET)
	JSONObject findAllByRegionId(@RequestParam(value="pRegionId") Long pRegionId);
	

	@RequestMapping(value = "api-erdm-dm/regionGrid/saveOrUpdate",method = RequestMethod.POST, consumes=MediaType.APPLICATION_JSON_UTF8_VALUE)
	JSONObject save(@RequestParam(value="regionGridStr") String regionGridStr);
	

	@RequestMapping(value = "api-erdm-dm/regionGrid/findById",method = RequestMethod.GET)
	JSONObject detail(@RequestParam(value="id") Long id);
	
	
}
