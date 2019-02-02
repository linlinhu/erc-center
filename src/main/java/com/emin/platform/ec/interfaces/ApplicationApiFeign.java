/**
 * 
 */
package com.emin.platform.ec.interfaces;

import org.springframework.cloud.netflix.feign.FeignClient;
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
public interface ApplicationApiFeign {

	@GetMapping("/api-perm/application/list")
	JSONObject loadApplications();
	
	@GetMapping("/api-perm/application/{id}/detail")
	JSONObject applicationDetail(@PathVariable("id") Long id);
	
	@PostMapping(value="/api-perm/application/createOrUpdate",consumes=org.springframework.http.MediaType.APPLICATION_JSON_UTF8_VALUE)
	JSONObject createOrUpdate(@RequestBody String application);
	
	@PostMapping("/api-perm/application/delete")
	JSONObject delete(@RequestParam("id")Long id);
	
	@GetMapping("/api-perm/application/{ecmId}/appList")
	JSONObject ecmApps(@PathVariable("ecmId") Long ecmId);
	
	@PostMapping("/api-perm/application/saveEcmApps")
	JSONObject saveEcmApps(@RequestParam("ecmId") Long ecmId,@RequestParam("appIds") Long[] appIds);
	
	@PostMapping("/api-perm/application/removeEcmApps")
	JSONObject removeEcmApps(@RequestParam("ecmId") Long ecmId,@RequestParam("appIds") Long[] appIds);
	
	@PostMapping("/api-perm/application/clearEcmApps")
	JSONObject clearEcmApps(@RequestParam("ecmId") Long ecmId);
}
