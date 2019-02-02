package com.emin.platform.ec.interfaces;

import com.alibaba.fastjson.JSONObject;
import org.springframework.cloud.netflix.feign.FeignClient;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;

/**
 * 引擎系统配置Feign接口
 *
 * @author Jack
 * @version V1.0
 * @Title:
 * @Description: 引擎系统配置Feign接口
 * @date 2018/3/27 16:27
 */
@FeignClient(value = "zuul")
public interface EngineApiFeign {

    /**
     * 按照组编码以及项编码查询查询某一项信息
     *
     * @param groupCode 当前数据字典的归属的组代码
     * @param itemCode  当前数据字典的代码
     * @return JSONObject
     * @throws
     * @author Jack
     * @date 2018/4/2
     */
    @GetMapping(value = "/api-common/dd/item/{groupCode}/queryByCode/{itemCode}")
    JSONObject queryByCode(@PathVariable("groupCode") String groupCode, @PathVariable("itemCode") String itemCode);

    /**
     * 保存或更新当前数据字典信息
     *
     * @param data 当前数据字典组的数据
     * @return JSONObject
     * @throws
     * @author Jack
     * @date 2018/4/2
     */
    @GetMapping(value = "/api-common/dd/item/createOrUpdate", consumes = MediaType.APPLICATION_JSON_UTF8_VALUE)
    JSONObject createOrUpdateCode(@RequestBody String data);
}
