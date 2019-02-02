package com.emin.platform.ec.interfaces;

import com.alibaba.fastjson.JSONObject;
import org.springframework.cloud.netflix.feign.FeignClient;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;


@FeignClient(value = "zuul")
public interface OrgChartApiFeign {
	
	@RequestMapping(value = "api-erdm-dm/dis/findAll",method = RequestMethod.GET)
	JSONObject getAll();
	
	@RequestMapping(value = "api-erdm-dm/dis/saveOrUpdate",method = RequestMethod.POST)
	JSONObject save(@RequestParam(value="disStr") String disStr);
	
	@RequestMapping(value = "api-erdm-dm/dis/delete",method = RequestMethod.GET)
	JSONObject remove(@RequestParam(value="id") Long id);
	
	@RequestMapping(value = "api-erdm-user/personOrg/addPersonOrg",method = RequestMethod.POST)
	JSONObject relateStaffs(@RequestParam(value="personIds") String personIds,
			@RequestParam(value="orgId") Long orgId,
			@RequestParam(value="orgName") String orgName);
	

	@RequestMapping(value = "api-erdm-user/personOrg/deletePersonOrg",method = RequestMethod.DELETE)
	JSONObject removeStaffs(@RequestParam(value="personIds") String personIds,
			@RequestParam(value="orgId") Long orgId);
	

	@RequestMapping(value = "api-erdm-user/personOrg/modifyPersonOrg",method = RequestMethod.POST)
	JSONObject exchangeStaffs(@RequestParam(value="personIds") String personIds,
			@RequestParam(value="oldOrgId") Long oldOrgId,
			@RequestParam(value="orgId") Long orgId,
			@RequestParam(value="orgName") String orgName);
	

	@RequestMapping(value = "api-erdm-dm/dis/queryDetail",method = RequestMethod.GET)
	JSONObject detail(@RequestParam(value="id") Long id);

	
	
}
