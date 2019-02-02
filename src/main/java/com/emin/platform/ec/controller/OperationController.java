/**
 * 
 */
package com.emin.platform.ec.controller;

import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;

import com.alibaba.fastjson.JSONObject;
import com.emin.base.controller.BaseController;
import com.emin.platform.ec.interfaces.OperationApiFeign;
import com.emin.platform.ec.interfaces.ResultCheckUtil;

/**
 * @author jim.lee
 *
 */
@Controller
@RequestMapping("/operation")
public class OperationController extends BaseController{

	@Autowired
	private OperationApiFeign operationApiFeign;
	
	@GetMapping("/form")
	public String form(Map<String,Object> data,Long menuId,Long id) {
		if(id!=null) {
			JSONObject operationResult = operationApiFeign.get(id);
			ResultCheckUtil.check(operationResult);
			data.put("operation", operationResult.getJSONObject("result"));
		}
		data.put("menuId", menuId);
		JSONObject typeResult = operationApiFeign.operationType();
		ResultCheckUtil.check(typeResult);
		data.put("typeList", typeResult.getJSONArray("result"));
		
		return "modules/menu/operationForm";
	}
	@PostMapping("/saveOperation")
	@ResponseBody
	public JSONObject saveOperation(String operation) {
		return operationApiFeign.createOrUpdate(operation);
	}
	
	@PostMapping("/deleteOperation")
	@ResponseBody
	public JSONObject deleteOperation(String ids) {
		return operationApiFeign.delete(Long.valueOf(ids));
	}
	
}
