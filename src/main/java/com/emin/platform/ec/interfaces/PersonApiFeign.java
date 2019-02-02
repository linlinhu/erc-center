package com.emin.platform.ec.interfaces;

import com.alibaba.fastjson.JSONObject;
import org.springframework.cloud.netflix.feign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;


@FeignClient(value = "zuul")
public interface PersonApiFeign {
	
	/**
	 * 用户登录
	 * @param username 账号
	 * @param password 密码
	 * @param code 验证码
	 */
	@RequestMapping(value = "/api-erdm-user/login",method = RequestMethod.POST)
	JSONObject login(@RequestParam(value="username") String username,
			@RequestParam(value="password") String password,
			@RequestParam(value="code") String code);
	
	/**
	 * 获取验证图片
	 */
	@RequestMapping(value = "/api-erdm-user/common/get_img",method = RequestMethod.GET)
	byte[] getImg();
	
	/**
	 *验证用户是否登录
	 * @param token 用过户登录时获取到的token值
	 */
	@RequestMapping(value = "/api-erdm-user/validate",method = RequestMethod.POST)
	JSONObject userValidate(
			@RequestParam(value="token") String token);
	
	/**
	 *用户退出登录
	 * @param token 用过户登录时获取到的token值
	 */
	@RequestMapping(value = "/api-erdm-user/outLogin",method = RequestMethod.POST)
	JSONObject outLogin(
			@RequestParam(value="token") String token);
	
	/**
	 * 用户列表
	 * @param ecmId 主体Id
	 * @param keyword 查询关键字
	 * @param token token值
	 */
	@RequestMapping(value = "/api-erdm-user/erdm/user/list",method = RequestMethod.GET)
	JSONObject userList(
			@RequestParam(value="ecmId") String ecmId,
			@RequestParam(value="keyword") String keyword,
			@RequestParam(value="token") String token,
			@RequestParam(value="page") Integer page,
			@RequestParam(value="limit") Integer limit);
	
	/**
	 * 用户详情
	 * @param id 被查询的用户id
	 */
	@RequestMapping(value = "/api-erdm-user/erdm/user/queryDetail",method = RequestMethod.GET)
	JSONObject detail(
			@RequestParam(value="id") Long id);
	
	/**
	 *验证账号是否已存在
	 * @param username 用户名
	 * @param personId
	 */
	@RequestMapping(value = "/api-erdm-user/erdm/user/validateUsername",method = RequestMethod.GET)
	Boolean validateUsername(@RequestParam(value="username") String username,
			@RequestParam(value="personId") Long personId);
	
	/**
	 *验证手机号码是否已存在
	 * @param mobile 手机号码
	 * @param personId
	 */
	@RequestMapping(value = "/api-erdm-user/erdm/user/validateMobile",method = RequestMethod.GET)
	Boolean validateMobile(
			@RequestParam(value="mobile") String mobile,
			@RequestParam(value="personId") Long personId);
	
	/**
	 *验证电子邮箱是否已存在
	 * @param email 电子邮箱
	 * @param personId
	 */
	@RequestMapping(value = "/api-erdm-user/erdm/user/validateEmail",method = RequestMethod.GET)
	Boolean validateEmail(
			@RequestParam(value="email") String email,
			@RequestParam(value="personId") Long personId);
	
	/**
	 *新增保存
	 * @param ecmId 主体Id
	 * @param username 用户账号
	 * @param mobile 手机号码
	 * @param email 电子邮箱
	 */
	@RequestMapping(value = "/api-erdm-user/erdm/user/add",method = RequestMethod.POST)
	JSONObject saveUser(
			@RequestParam(value="ecmId") Long ecmId,
			@RequestParam(value="username") String username,
			@RequestParam(value="mobile") String mobile,
			@RequestParam(value="email") String email);
	
	/**
	 *编辑
	 * @param id 被编辑的用户id
	 * @param ecmId 主体Id
	 * @param username 用户账号
	 * @param mobile 手机号码
	 * @param email 电子邮箱
	 */
	@RequestMapping(value = "/api-erdm-user/erdm/user/update",method = RequestMethod.POST)
	JSONObject updateUser(
			@RequestParam(value="id") Long id,
			@RequestParam(value="username") String username,
			@RequestParam(value="mobile") String mobile,
			@RequestParam(value="email") String email);
	
	/**
	 *禁用或者启用
	 * @param id 被编辑的用户id
	 * @param status 状态 false:禁用， true：启用
	 */
	@RequestMapping(value = "/api-erdm-user/erdm/user/status",method = RequestMethod.POST)
	JSONObject userStatus(
			@RequestParam(value="id") String ids,
			@RequestParam(value="status") Boolean status);
	
	/**
	 *删除用户
	 * @param id 用户id
	 */
	@RequestMapping(value = "/api-erdm-user/erdm/user/delete",method = RequestMethod.POST)
	JSONObject deleteUser(
			@RequestParam(value="id") String ids);
	
	/**
	 *获取主体的注册用户数
	 * @param ecmid
	 */
	@RequestMapping(value = "/api-erdm-user/erdm/user/getMemberNumber",method = RequestMethod.POST)
	JSONObject getMemberNumber(
			@RequestParam(value="ecmId") String ecmId);
	
	/**
	 *发送手机验证码
	 * @param mobile 手机号码
	 */
	@RequestMapping(value = "/api-erdm-user/common/sendSMS",method = RequestMethod.POST)
	JSONObject sendSMS(
			@RequestParam(value="mobile") String mobile);
	
	/**
	 *绑定手机号码
	 * @param id 用户id
	 * @param mobile 手机号码
	 * @param code 短信验证码
	 */
	@RequestMapping(value = "/api-erdm-user/erdm/user/bindMobile",method = RequestMethod.POST)
	JSONObject bindMobile(
			@RequestParam(value="id") Long id,
			@RequestParam(value="mobile") String mobile,
			@RequestParam(value="code") String code);
	
	@GetMapping(value =  "/api-erdm-user//erdm/user/queryFlocksByPersonId")
    JSONObject getUserFlocks(@RequestParam("personId") Long userId);
	
}
