package com.emin.platform.ec.interfaces;

import org.springframework.cloud.netflix.feign.FeignClient;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import com.alibaba.fastjson.JSONObject;

@FeignClient(value = "zuul")
public interface DataDicApiFeign {
	
	@RequestMapping(value = "/api-common/dd/group/createOrUpdate",method = RequestMethod.POST, consumes=MediaType.APPLICATION_JSON_UTF8_VALUE)
	JSONObject saveGroup(@RequestBody String data);
	
	@RequestMapping(value = "/api-common/dd/group/delete/{id}",method = RequestMethod.POST)
	JSONObject delGroup(@PathVariable("id") Integer id);

	@RequestMapping(value = "/api-common/dd/group/get/{id}",method = RequestMethod.GET)
	JSONObject detailGroup(@PathVariable("id") Integer id);
	

	@RequestMapping(value = "/api-common/dd/group/query",method = RequestMethod.GET)
	JSONObject listGroup(@RequestParam("name") String name,
			@RequestParam("code") String code);
	
	@RequestMapping(value = "/api-common/dd/item/{gid}/queryTreeByGid",method = RequestMethod.GET)
	JSONObject queryTreeByGid(@PathVariable("gid") Integer gid,
			@RequestParam("pid") Integer pid,
			@RequestParam("idDeep") boolean isDeep);
	
	@RequestMapping(value = "/api-common/dd/item/{groupCode}/queryTreeByGroupCode",method = RequestMethod.GET)
	JSONObject queryTreeByCode(@PathVariable("groupCode") String groupCode,
			@RequestParam("pid") Integer pid,
			@RequestParam("idDeep") boolean isDeep);

	@RequestMapping(value = "/api-common/dd/item/{gid}/stepQuery",method = RequestMethod.GET)
	JSONObject stepQuery(@PathVariable("gid") Integer gid,
			@RequestParam("pid") Integer pid);
	
	@RequestMapping(value = "/api-common/dd/item/{groupCode}/stepQueryByGroupCode",method = RequestMethod.GET)
	JSONObject stepQueryByCode(@PathVariable("groupCode") String code,
			@RequestParam("pid") Integer pid);
	
	@RequestMapping(value = "/api-common/dd/item/createOrUpdate",method = RequestMethod.POST, consumes=MediaType.APPLICATION_JSON_UTF8_VALUE)
	JSONObject saveItem(@RequestBody String data);
	
	@RequestMapping(value = "/api-common/dd/item/delete/{id}",method = RequestMethod.POST)
	JSONObject delItem(@PathVariable("id") Integer id);

	@RequestMapping(value = "/api-common/dd/item/get/{id}",method = RequestMethod.GET)
	JSONObject detailItem(@PathVariable("id") Integer id);
}
