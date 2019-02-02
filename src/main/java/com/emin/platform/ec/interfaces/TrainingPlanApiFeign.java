package com.emin.platform.ec.interfaces;

import com.alibaba.fastjson.JSONObject;

import java.util.List;

import org.springframework.cloud.netflix.feign.FeignClient;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;

/***
 * 志愿者队伍接口桥梁定义
 * @author Danica
 */
@FeignClient(value = "zuul")
public interface TrainingPlanApiFeign {
	
	
	@RequestMapping(value = "api-erdm-train/train/queryPage",method = RequestMethod.GET)
	JSONObject getPage(@RequestParam(value="page") Integer page,
			@RequestParam(value="limit") Integer limit,
			@RequestParam(value="keywords") String keywords,
			@RequestParam(value="startTime") Long startTime,
			@RequestParam(value="endTime") Long endTime,
			@RequestParam(value="teamId") Long teamId);

	@RequestMapping(value = "api-erdm-train/train/saveOrUpdate",method = RequestMethod.POST)
	JSONObject save(@RequestParam(value="trainStr") String trainStr);
	

	@RequestMapping(value = "api-erdm-train/train/findById",method = RequestMethod.GET)
	JSONObject detail(@RequestParam(value="trainId") Long trainId);
	

	@RequestMapping(value = "api-erdm-train/train/deleteById",method = RequestMethod.DELETE)
	JSONObject remove(@RequestParam(value="trainId") Long trainId);

	@RequestMapping(value = "api-erdm-train/feedback/findByTrainId",method = RequestMethod.GET)
	JSONObject getFeedbackDetail(@RequestParam(value="trainId") Long trainId);

	@RequestMapping(value = "api-erdm-train/feedback/saveOrUpdate",method = RequestMethod.POST)
	JSONObject feedback(@RequestParam(value="feedbackStr") String feedbackStr);
	

	@RequestMapping(value = "api-erdm-train/participantsPerson/findAllByTrainId",method = RequestMethod.GET)
	JSONObject getVolunteersPage(@RequestParam(value="keyWords") String keyWords,
			@RequestParam(value="teamId") Long teamId,
			@RequestParam(value="trainId") Long trainId);
	

	@RequestMapping(value = "api-erdm-train/participantsPerson/evaluate",method = RequestMethod.POST)
	JSONObject score(@RequestParam(value="personId") Long personId,
			@RequestParam(value="trainId") Long trainId,
			@RequestParam(value="score") Double score);
	
	
	
}
