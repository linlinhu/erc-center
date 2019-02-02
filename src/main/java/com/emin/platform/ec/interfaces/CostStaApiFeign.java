package com.emin.platform.ec.interfaces;

import com.alibaba.fastjson.JSONObject;
import org.springframework.cloud.netflix.feign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;

/**
 * 费用统计Feign接口
 *
 * @author Jack
 * @version V1.0
 * @Title:
 * @Description: 费用统计Feign接口
 * @date 2018/3/28 15:41
 */
@FeignClient(value = "zuul")
public interface CostStaApiFeign {
	
	/**
	 * 分页查询
	 * @param page 当前页码
	 * @param limit 每页显示的记录数
	 * @param regionType 培训区域类型 区域1、网格2:
	 * @param regionId 区域或网格的id
	 * @param yyyymm 年月
	 * @return
	 */
    @GetMapping("api-erdm-train/train/costsQueryPage")
    JSONObject costsQueryPage(@RequestParam("page") Integer page,
            @RequestParam("limit") Integer limit,
            @RequestParam("regionType") Integer regionType,
            @RequestParam("regionId") Long regionId,
            @RequestParam("yyyymm") String yyyymm);
    
    /**
	 * 查询月培训次数与培训费用
	 * @param regionType 培训区域类型 区域1、网格2:
	 * @param regionId 区域或网格的id
	 * @param yyyymm 年月
	 * @return
	 */
    @GetMapping("api-erdm-train/train/costsQueryTotalByMonth")
    JSONObject costsQueryTotalByMonth(@RequestParam("regionType") Integer regionType,
            @RequestParam("regionId") Long regionId, 
            @RequestParam("yyyymm") String yyyymm);
    
    /**
	 * 根据id查询详情
	 * @param id 授权id
	 * @return
	 */
	@RequestMapping(value = "/api-erdm-event/warrant/findById",method = RequestMethod.GET)
	JSONObject findById(@RequestParam(value="id") Long id);
	
	/**
	 * 查询该区域半年的费用统计（不含当前月）
	 * @param regionType 培训区域类型 区域1、网格2:
	 * @param regionId 区域或网格的id
	 * @param yyyymm 年月
	 * @return
	 */
	
    @GetMapping("api-erdm-train/train/costsQueryTotalByMonthOfHalfYear")
    JSONObject costsQueryTotalByMonthOfHalfYear(@RequestParam("regionType") Integer regionType,
    		@RequestParam("regionId") Long regionId, 
            @RequestParam("yyyymm") String yyyymm);


    /**
	 * 查询任务或者培训的费用详情
	 * @param thingType 类型：任务1、培训 2
	 * @param thingId 记录id
	 * @return
	 */
    @RequestMapping(value = "api-erdm-finance/costs/queryByThingId",method = RequestMethod.GET)
	JSONObject getAll(@RequestParam(value="thingId") Long thingId,
			@RequestParam(value="thingType") Integer thingType);
	/**
	 * 
	 * @param costsStr
	 * private Long ecmId;
	 * 任务或者培训ID
	    private Long thingId;
	 *  类型：任务1、培训 2
	    private Integer thingType;
	 *  冗余事件title
	    private String thingTitle;
	 * 	会计科目
	    private String accountTitle;
	 *  结算
	    private BigDecimal  finalTotal;
	 * 	预估
	    private BigDecimal  estimatedTotal;
	 * @return
	 */
	@RequestMapping(value = "api-erdm-finance/costs/saveOrUpdate",method = RequestMethod.POST)
	JSONObject save(@RequestParam(value="costsStr") String costsStr);
	
	@RequestMapping(value = "api-erdm-finance/costs/deleteById",method = RequestMethod.DELETE)
	JSONObject remove(@RequestParam(value="costsId") Long costsId);
}
