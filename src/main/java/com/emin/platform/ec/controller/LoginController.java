package com.emin.platform.ec.controller;

import javax.servlet.http.HttpServletRequest;

import org.apache.commons.lang3.StringUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.servlet.ModelAndView;

import com.alibaba.fastjson.JSONObject;
import com.emin.base.controller.BaseController;
import com.emin.base.exception.EminException;
import com.emin.platform.ec.annotation.IgnoreIterceptor;
import com.emin.platform.ec.interfaces.EcmApiFeign;
import com.emin.platform.ec.interfaces.PersonApiFeign;
import com.emin.platform.ec.util.HttpSessionHelper;

/**
 * 登录控制层
 * 
 * @author 李丹
 *
 */
@Controller
public class LoginController extends BaseController {

	private Logger logger = LoggerFactory.getLogger(LoginController.class);

	@Autowired
	PersonApiFeign personApiFeign; // 用户中心api
	@Autowired
	EcmApiFeign ecmApiFeign; // 主体中心api

	/**
	 * 登录页面跳转
	 * 
	 * @param keyword
	 * @param ecmId
	 * @return
	 */
	@RequestMapping("/login")
	@ResponseBody
	@IgnoreIterceptor
	public ModelAndView goManage(String keyword, Long ecmId) {
		ModelAndView mv = new ModelAndView("modules/login/manage");
		return mv;

	}

	/**
	 * 获取登录验证码
	 * 
	 * @return
	 */
	@RequestMapping("/getValidImg")
	@ResponseBody
	@IgnoreIterceptor
	public byte[] getImg() {
		try {
			return personApiFeign.getImg();
		} catch (EminException e) {
			logger.error(e.getLocalizedMessage(), e);
		} catch (Exception e) {
			logger.error(e.getMessage(), e);
		}
		return null;
	}

	/**
	 * 登入
	 * 
	 * @param username
	 *            用户名
	 * @param password
	 *            密码
	 * @param code
	 *            验证码
	 * @return
	 */
	@RequestMapping("/loginIn")
	@ResponseBody
	@IgnoreIterceptor
	public JSONObject userLogin(String username, String password, String code) {

		HttpSessionHelper sessionHelper = HttpSessionHelper.create(this);

		JSONObject apiResponse = new JSONObject();
		JSONObject loginData = new JSONObject();
		JSONObject person = new JSONObject();
		JSONObject ecm = new JSONObject();
		String token = null;
		Long ecmId = null;

		apiResponse = personApiFeign.login(username, password, code);
		if (apiResponse != null && apiResponse.getBoolean("success") == true) {
			loginData = apiResponse.getJSONObject("result");
			token = loginData.getString("token");
			Long id = loginData.getLong("id");

			apiResponse = personApiFeign.detail(id);
			if (!apiResponse.getBooleanValue("success")) {
				throw new EminException(apiResponse.getString("code"));
			}
			person = apiResponse.getJSONObject("result");
			Integer userType = person.getInteger("userType");
			sessionHelper.putUserType(userType);
			sessionHelper.putSessionUserId(id);
			sessionHelper.putSessionValue("token", token);
			if (sessionHelper.isSuperman()) {
				return logout(sessionHelper.getRequest());
			}
			ecmId = person.getLong("ecmId");
			apiResponse = ecmApiFeign.findEcmByIds(ecmId + "");
			if (!apiResponse.getBooleanValue("success")) {
				throw new EminException(apiResponse.getString("code"));
			}
			ecm = apiResponse.getJSONArray("result").getJSONObject(0);
			sessionHelper.putSessionEcmId(ecmId);
			sessionHelper.putSessionEcmName(ecm.getString("name"));
			loginData.put("mobile", person.getString("mobile"));
			apiResponse.put("data", loginData);
			apiResponse.put("ecmId", ecm.getLong("id"));
			apiResponse.put("ecmName", ecm.getString("name"));
			apiResponse.put("person", person);
		} else {
			throw new EminException(apiResponse.getString("code"));
		}

		return apiResponse;
	}

	/**
	 * 登出
	 * 
	 * @param request
	 * @return
	 */
	@RequestMapping("/logout")
	@ResponseBody
	public JSONObject logout(HttpServletRequest request) {
		JSONObject res = new JSONObject();
		HttpSessionHelper sessionHelper = HttpSessionHelper.create(this);
		String token = "";
		if (request.getHeader("token") != null) {
			token = request.getHeader("token").toString();
		}
		if (request.getParameter("token") != null) {
			token = request.getParameter("token").toString();
		}
		if (StringUtils.isBlank(token)) {
			token = sessionHelper.getSessionValue("token", String.class);
		}
		res = personApiFeign.outLogin(token);
		if (!res.getBooleanValue("success")) {
			throw new EminException(res.getString("code"));
		}
		this.getRequest().getSession().invalidate();
		return res;
	}

	/**
	 * 验证用户是否登录
	 * 
	 * @param token
	 * @return
	 */
	@RequestMapping("/userValidate")
	@ResponseBody
	public JSONObject userValidate(String token) {
		JSONObject res = new JSONObject();

		res = personApiFeign.userValidate(token);

		return res;
	}
}