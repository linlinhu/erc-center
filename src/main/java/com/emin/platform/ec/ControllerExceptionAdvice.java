package com.emin.platform.ec;

import com.alibaba.fastjson.JSONObject;
import com.emin.base.exception.EminException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.servlet.ModelAndView;

@ControllerAdvice
public class ControllerExceptionAdvice {

    private static final Logger LOGGER = LoggerFactory.getLogger(ControllerExceptionAdvice.class);

    @ExceptionHandler({EminException.class})
    @ResponseBody
    public JSONObject eminExceptionHandler(EminException e) {
        LOGGER.error("业务异常", e);
        JSONObject json = new JSONObject();
        json.put("success", false);
        json.put("message", e.getLocalizedMessage());
        return json;
    }

    @ExceptionHandler({Exception.class})
    @ResponseBody
    public ModelAndView exceptionHandler(Exception e) {
        LOGGER.error("系统异常", e);
        ModelAndView mv = new ModelAndView("500");
        return mv;
    }
}
