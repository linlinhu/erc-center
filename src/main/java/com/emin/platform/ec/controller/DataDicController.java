package com.emin.platform.ec.controller;

import org.apache.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.servlet.ModelAndView;

import com.alibaba.fastjson.JSONArray;
import com.alibaba.fastjson.JSONObject;
import com.emin.base.controller.BaseController;
import com.emin.base.exception.EminException;
import com.emin.platform.ec.filter.MenuOperationFilter;
import com.emin.platform.ec.interfaces.DataDicApiFeign;
import com.emin.platform.ec.util.HttpSessionHelper;

/**
 * 数据字典控制层
 * @author 李丹
 *
 */
@Controller
@RequestMapping("/data-dic")
public class DataDicController extends BaseController {
	private static final Logger LOGGER = Logger.getLogger(DataDicController.class);
	@Value("${spring.application.code}")
	private String appCode;
	
	@Autowired
	transient MenuOperationFilter menuOperationFilter;
	
	@Autowired
	DataDicApiFeign dataDicApiFeign; // 数据字典api
	
	/**
	 * 主页跳转，并加载列表
	 * @param name 名称模糊查询
	 * @param code 数据字典码
	 * @return
	 */
	@RequestMapping("/index")
	@ResponseBody
	public ModelAndView index(String name, String code) {
		ModelAndView mv = new ModelAndView("modules/data-dic/manage");
		// 加载首页列表
		JSONObject res = new JSONObject();
		try {
			res = dataDicApiFeign.listGroup(name, code);
		} catch(Exception e) {
			LOGGER.error("数据字典首页加载列表报错！错误信息->" + e.getMessage());
        	e.printStackTrace();
		}
		if (!res.isEmpty()) {
			if (!res.getBooleanValue("success")) {
				throw new EminException(res.getString("code"));
			}
			mv.addObject("datas", res.getJSONArray("result"));
		}
		// 加载模块权限
		String operationCodes = null;
		try {
			HttpSessionHelper sessionHelper = HttpSessionHelper.create(this);
			Long userId = sessionHelper.sessionUserId();
			JSONObject params = new JSONObject();
			params.putIfAbsent("userId", userId);
			operationCodes = menuOperationFilter.menuOperations("data-dic", params);
		} catch(Exception e) {
			LOGGER.error("数据字典首页加载模块权限报错！错误信息->" + e.getMessage());
        	e.printStackTrace();
		}
		if (operationCodes != null) {
			mv.addObject("operationCodes", operationCodes);
		}
		
		return mv;
	}
	
	/**
	 * 表单跳转
	 * @param id 编辑时传递数据字典编号
	 * @return
	 */
	@RequestMapping("/form")
	@ResponseBody
	public ModelAndView goForm(Integer id) {
		ModelAndView mv = new ModelAndView("modules/data-dic/form");
		if (id != null) {
			JSONObject info = new JSONObject();
			try {
				info = dataDicApiFeign.detailGroup(id);
			} catch(Exception e) {
				LOGGER.error("数据字典表单页面加载实体详情报错！错误信息->" + e.getMessage());
	        	e.printStackTrace();
			}
			if (!info.isEmpty()) {
				if (!info.getBooleanValue("success")) {
					throw new EminException(info.getString("code"));
				}
				mv.addObject("info", info.getJSONObject("result"));
			}
		}
		// 加载模块权限
		String operationCodes = null;
		try {
			HttpSessionHelper sessionHelper = HttpSessionHelper.create(this);
			Long userId = sessionHelper.sessionUserId();
			JSONObject params = new JSONObject();
			params.putIfAbsent("userId", userId);
			operationCodes = menuOperationFilter.menuOperations("data-dic", params);
		} catch(Exception e) {
			LOGGER.error("数据字典详情页加载模块权限报错！错误信息->" + e.getMessage());
        	e.printStackTrace();
		}
		if (operationCodes != null) {
			mv.addObject("operationCodes", operationCodes);
		}
		return mv;
	}
	
	/**
	 * 保存
	 * @param data 数据字典实体字符串
	 * @return
	 */
	@RequestMapping("/save")
	@ResponseBody
	public JSONObject save(String data){
		JSONObject resJson = new JSONObject();
		resJson = dataDicApiFeign.saveGroup(data);
		if(!resJson.getBoolean("success")){
			throw new EminException(resJson.getString("code"));
		}
		return resJson;
    }
	/**
	 * 删除
	 * @param id 数据字典编号
	 * @return
	 */
	@RequestMapping("/remove")
	@ResponseBody
	public JSONObject remove(Integer id){
		JSONObject resJson = new JSONObject();
		resJson = dataDicApiFeign.delGroup(id);
		if(!resJson.getBoolean("success")){
			throw new EminException(resJson.getString("code"));
		}
		return resJson;
    }
	/**
	 * 根据编号获得数据字典关联项
	 * @param gid 数据字典编号
	 * @return
	 */
	@RequestMapping("/getItems")
	@ResponseBody
	public JSONObject getItems(Integer gid){
		JSONObject resJson = new JSONObject();
		resJson = dataDicApiFeign.stepQuery(gid, null);
		if(!resJson.getBoolean("success")){
			throw new EminException(resJson.getString("code"));
		}
		return resJson;
    }
	
	/**
	 * 根据数据字典码获取关联项
	 * @param code 数据字典码
	 * @return
	 */
	@RequestMapping("/getItemsByCode")
	@ResponseBody
	public JSONObject getItems(String code){
		JSONObject resJson = new JSONObject();
		resJson = dataDicApiFeign.stepQueryByCode(code, null);
		if(!resJson.getBoolean("success")){
			throw new EminException(resJson.getString("code"));
		}
		return resJson;
    }
	
	/**
	 * 数据字典树加载
	 * @param gid 数据字典编号
	 * @param pid 树节点父id，null表示为第一级
	 * @return
	 */
	@RequestMapping("/treeItems")
	@ResponseBody
	public JSONArray treeItems(Integer gid, Integer pid){
		JSONObject resJson = new JSONObject();
		resJson = dataDicApiFeign.queryTreeByGid(gid, pid, false);
		if(!resJson.getBoolean("success")){
			throw new EminException(resJson.getString("code"));
		}
		JSONArray treeNodes = resJson.getJSONArray("result");
		for (int i = 0; i < treeNodes.size(); i++) {
			if (!treeNodes.getJSONObject(i).getBoolean("leaf")) {
				treeNodes.getJSONObject(i).put("isParent", true);
			}
		}
		return treeNodes;
    }
	
	/**
	 * 根据id查询数据字典项详情
	 * @param id 数据字典项编号
	 * @return
	 */
	@RequestMapping("/getItem")
	@ResponseBody
	public JSONObject getItem(Integer id){
		JSONObject resJson = new JSONObject();
		resJson = dataDicApiFeign.detailItem(id);
		if(!resJson.getBoolean("success")){
			throw new EminException(resJson.getString("code"));
		}
		return resJson;
    }
	
	/**
	 * 保存数据字典项目
	 * @param data 数据字典项实体信息字符串
	 * @return
	 */
	@RequestMapping("/saveItem")
	@ResponseBody
	public JSONObject saveItem(String data){
		JSONObject resJson = new JSONObject();
		resJson = dataDicApiFeign.saveItem(data);
		if(!resJson.getBoolean("success")){
			throw new EminException(resJson.getString("code"));
		}
		return resJson;
    }
	
	/**
	 * 删除数据字典项
	 * @param id 数据字典项编号
	 * @return
	 */
	@RequestMapping("/removeItem")
	@ResponseBody
	public JSONObject removeItem(Integer id){
		JSONObject resJson = new JSONObject();
		resJson = dataDicApiFeign.delItem(id);
		if(!resJson.getBoolean("success")){
			throw new EminException(resJson.getString("code"));
		}
		return resJson;
    }


}
