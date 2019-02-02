/**
 * 
 */
package com.emin.platform.ec.interfaces;

import org.springframework.cloud.netflix.feign.FeignClient;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestParam;

import com.alibaba.fastjson.JSONObject;

/**
 * @author jim.lee
 *
 */
@FeignClient(value = "zuul")
public interface MenuApiFeign {
	@GetMapping("/api-perm/menu/{appId}/queryMenuTreeByAppId")
	JSONObject menuList(@PathVariable("appId")Long appId,@RequestParam("pId")Long pid,@RequestParam("isDeep")boolean isDeep);
	
	@GetMapping("/api-perm/menu/get/{id}")
	JSONObject menuDetail(@PathVariable("id")Long id);
	
	@PostMapping(value="/api-perm/menu/createOrUpdate",consumes=MediaType.APPLICATION_JSON_UTF8_VALUE)
	JSONObject createOrUpdate(@RequestBody String data);
	
	@PostMapping("/api-perm/menu/delete/{id}")
	JSONObject delete(@PathVariable("id") Long id);
	
	@GetMapping("/api-perm/menu/menuType")
	JSONObject menuType();

	@GetMapping("/api-perm/permission/{appCode}/permissions")
	JSONObject userMenu(@PathVariable("appCode") String appCode,@RequestParam("groupIds") Long[] groupIds);

	@GetMapping("/api-perm/menu/queryBySuper/{appCode}")
	JSONObject superMenu(@PathVariable("appCode")String appCode);
}
