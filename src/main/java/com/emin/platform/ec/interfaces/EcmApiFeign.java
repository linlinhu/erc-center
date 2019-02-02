package com.emin.platform.ec.interfaces;

import com.alibaba.fastjson.JSONObject;
import org.springframework.cloud.netflix.feign.FeignClient;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;


@FeignClient(value = "zuul")
public interface EcmApiFeign {
	
	
	@RequestMapping(value = "/api-erdm-ecm/ecm/findEcmByIds", method = RequestMethod.GET)
	JSONObject findEcmByIds(@RequestParam(value="ids") String ids);
	
	
}
