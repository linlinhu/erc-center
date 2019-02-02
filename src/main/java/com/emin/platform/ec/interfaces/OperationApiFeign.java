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
public interface OperationApiFeign {

	@GetMapping("/api-perm/operation/{menuId}/query")
	JSONObject operationList(@PathVariable("menuId")Long menuId);
	
	@PostMapping(value="/api-perm/operation/createOrUpdate",consumes=MediaType.APPLICATION_JSON_UTF8_VALUE)
	JSONObject createOrUpdate(@RequestBody String data);
	
	@PostMapping("/api-perm/operation/delete/{id}")
	JSONObject delete(@PathVariable("id")Long id);
	
	@GetMapping("/api-perm/operation/get/{id}")
	JSONObject get(@PathVariable("id")Long id);
	
	@GetMapping("/api-perm/operation/operationType")
	JSONObject operationType();
	
	@GetMapping("/api-perm/group-permission/{groupId}/queryByMenu/{menuId}")
	JSONObject roleOperationList(@PathVariable("groupId")Long roleId,@PathVariable("menuId")Long menuId);
	
	@PostMapping(value="/api-perm/group-permission/{groupId}/bind")
	JSONObject roleBindOperation(@PathVariable("groupId")Long roleId,@RequestParam("operationIds") Long[] operationIds);

	@PostMapping("/api-perm/group-permission/{groupId}/clear")
	JSONObject roleBindClear(@PathVariable("groupId") Long roleId);
	
	@PostMapping("/api-perm/defaultAdminMenu/{appId}/clear")
	JSONObject clearDefaultPerm(@PathVariable("appId") Long appId);
	
	@PostMapping("/api-perm/defaultAdminMenu/bind")
	JSONObject bindDefaultPerm(@RequestParam("menuIds") Long[] menuIds);
	
	@GetMapping("/api-perm/defaultAdminMenu/{appId}/queryDetail")
	JSONObject appDefaultPerm(@PathVariable("appId") Long appId);

	@GetMapping("/api-perm/permission/{appCode}/queryByMenuCode/{menuCode}")
	JSONObject menuOperation(@PathVariable("appCode")String appCode,@PathVariable("menuCode")String menuCode,@RequestParam("groupIds") Long[] groupIds);



}
