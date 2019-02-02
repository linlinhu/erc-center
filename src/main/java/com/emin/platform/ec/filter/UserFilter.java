package com.emin.platform.ec.filter;

import java.lang.reflect.Method;
import java.util.Objects;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.apache.commons.lang3.StringUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.web.method.HandlerMethod;
import org.springframework.web.servlet.HandlerInterceptor;
import org.springframework.web.servlet.ModelAndView;

import com.emin.base.exception.EminException;
import com.emin.platform.ec.annotation.IgnoreIterceptor;
import com.emin.platform.ec.interfaces.PersonApiFeign;
import com.emin.platform.ec.util.ECMThreadLocalUtil;
import com.emin.platform.ec.util.HttpSessionHelper;

public class UserFilter implements HandlerInterceptor {
	private Logger logger = LoggerFactory.getLogger(UserFilter.class);

	public final PersonApiFeign personApiFeign;

	public UserFilter(PersonApiFeign personApiFeign) {
		this.personApiFeign = personApiFeign;
	}

	@Override
	public void afterCompletion(HttpServletRequest arg0, HttpServletResponse arg1, Object arg2, Exception arg3)
			throws Exception {

	}

	@Override
	public void postHandle(HttpServletRequest arg0, HttpServletResponse arg1, Object arg2, ModelAndView arg3)
			throws Exception {

	}

	@Override
	public boolean preHandle(HttpServletRequest request, HttpServletResponse response, Object arg2) throws Exception {
		try {
			// String token = "";
			// if (request.getHeader("token") != null) {
			// token = request.getHeader("token").toString();
			// }
			// if (request.getParameter("token") != null) {
			// token = request.getParameter("token").toString();
			// }
			// if (token!=null && token.length() > 0) {
			// res = personApiFeign.userValidate(token);
			// Boolean isSuccess = res.getBoolean("success");
			// if (!isSuccess) {
			// response.sendRedirect("/login");
			// return false;
			// }
			// }
			HttpSessionHelper sessionHelper = HttpSessionHelper.create(request, response);
			Long userId = sessionHelper.sessionUserId();
			Long ecmId = sessionHelper.sessionEcmId();
			String ecmName = sessionHelper.sessionEcmName();
			boolean isFilterPath = this.filterPath(request, arg2);
			String ecmIdStr = request.getHeader("ecmId");
			if (Objects.isNull(ecmId)) {
				// 当前对象为空的时候
				if (StringUtils.isNotBlank(ecmIdStr)) {
					try {
						ecmId = Long.valueOf(ecmIdStr);
					} catch (NumberFormatException e) {

					}
				}
			}
			if (StringUtils.isBlank(ecmName)) {
				ecmName = request.getHeader("ecmName");
			}
			if (!isFilterPath) {
				return true;
			}
			boolean validation = true;
			if (Objects.isNull(userId)) {
				validation = false;
			} else if (!sessionHelper.isSuperman() && Objects.isNull(ecmId)) {
				validation = true;
			} else {
				ECMThreadLocalUtil.setEcmId(ecmId);
				ECMThreadLocalUtil.setEcmName(ecmName);
			}
			if (!validation) {
				response.sendRedirect("/login");
			}
			return validation;
		} catch (EminException e) {
			logger.error(e.getLocalizedMessage(), e);
		} catch (Exception e) {
			logger.error(e.getMessage(), e);
		}

		return false;
	}

	/**
	 * 当前返回结果集为true：表示需要去处理拦截，返回false表示不需要拦截
	 * 
	 * @param request
	 * @param arg2
	 * @return
	 */
	private boolean filterPath(HttpServletRequest request, Object arg2) {
		if (HandlerMethod.class.isAssignableFrom(arg2.getClass())) {
			HandlerMethod handlerMethod = (HandlerMethod) arg2;
			Method method = handlerMethod.getMethod();
			IgnoreIterceptor ignoreIterceptor = method.getAnnotation(IgnoreIterceptor.class);
			if (ignoreIterceptor != null) {
				// 标志位true的时候，表示当前路径不需要拦截，则返回false
				return !ignoreIterceptor.value();
			} else {
				return true;
			}
		}
		return true;
	}

}
