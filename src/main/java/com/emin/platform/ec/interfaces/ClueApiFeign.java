package com.emin.platform.ec.interfaces;

import com.alibaba.fastjson.JSONObject;
import org.springframework.cloud.netflix.feign.FeignClient;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;


@FeignClient(value = "zuul")
public interface ClueApiFeign {
	
	@RequestMapping(value = "api-clue/clue/{id}/detail",method = RequestMethod.GET)
	JSONObject detail(@PathVariable("id") Integer id);
	
	@RequestMapping(value = "api-clue/clue/{id}/mark",method = RequestMethod.POST)
	JSONObject mark(@PathVariable("id") Integer id,
			@RequestParam(value="clueStatus") Integer clueStatus);

	@RequestMapping(value = "api-clue/clue/fetch/clue",method = RequestMethod.GET)
	JSONObject getList(@RequestParam(value="strategy") Integer strategy,
			@RequestParam(value="param") String param);
	
	@RequestMapping(value = "api-clue/clue/fetch/points",method = RequestMethod.GET)
	JSONObject getPoints(@RequestParam(value="strategy") Integer strategy,
			@RequestParam(value="param") String param);
}
