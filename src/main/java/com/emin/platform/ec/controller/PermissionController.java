/**
 *
 */
package com.emin.platform.ec.controller;

import com.alibaba.fastjson.JSONArray;
import com.alibaba.fastjson.JSONObject;
import com.emin.base.controller.BaseController;
import com.emin.platform.ec.interfaces.*;
import com.emin.platform.ec.filter.MenuOperationFilter;
import com.emin.platform.ec.util.HttpSessionHelper;
/*import com.emin.platform.ec.util.JWTThreadLocalUtil;*/
import org.apache.commons.lang3.ArrayUtils;
import org.apache.commons.lang3.ObjectUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

/**
 * @author jim.lee
 */
@Controller
@RequestMapping("/perm")
public class PermissionController extends BaseController {

    @Autowired
    private ApplicationApiFeign applicationApiFeign;

    @Autowired
    private OperationApiFeign operationApiFeign;

    @Autowired
    private MenuApiFeign menuApiFeign;

    @Autowired
    private PersonApiFeign personApiFeign;
    @Autowired
    private MenuOperationFilter menuOperationFilter;

    @GetMapping("/index")
    public String index(Map<String, Object> data, Long roleId) {

        if (roleId != null) {
            data.put("roleId", roleId);
        }
        Long userId = (Long) this.getRequest().getSession().getAttribute("userId");
        JSONObject params = new JSONObject();
        params.putIfAbsent("userId", userId);
        String operationCodes = menuOperationFilter.menuOperations("perm",params);
        data.put("operationCodes", operationCodes);
        return "modules/perm/index";
    }

    @GetMapping("/permissionTree")
    @ResponseBody
    public JSONArray resourceTree(Long roleId) {
        JSONArray array = new JSONArray();
        HttpSessionHelper sessionHelper = HttpSessionHelper.create(this);
        JSONObject userResult = personApiFeign.detail(sessionHelper.sessionUserId());
        JSONObject userDetail = userResult.getJSONObject("result");
        int userType = userDetail.getInteger("userType");
        //获取应用列表
        JSONObject ecmAppResult = applicationApiFeign.ecmApps(ObjectUtils.defaultIfNull(sessionHelper.sessionEcmId(),0L));
        ResultCheckUtil.check(ecmAppResult);
        JSONArray appList = ecmAppResult.getJSONArray("result");
        Long[] groupIds = null;
        for (int i = 0; i < appList.size(); i++) {
            JSONObject app = appList.getJSONObject(i);
            Long appId = app.getLongValue("id");
            String appCode = app.getString("code");
            app.put("nodeId", "APP-" + app.getLongValue("id"));
            array.add(app);
            JSONObject menuResult;
            if (userType == 1) {
                menuResult = menuApiFeign.menuList(appId, null, true);
            } else {
                JSONObject flockResult = personApiFeign.getUserFlocks(sessionHelper.sessionUserId());
                JSONArray flocks = flockResult.getJSONArray("result");
                if (flocks.size() > 0) {
                    groupIds = new Long[flocks.size()];
                    for (int j = 0; j < flocks.size(); j++) {
                        groupIds[j] = flocks.getJSONObject(j).getLong("id");
                    }
                    menuResult = menuApiFeign.userMenu(app.getString("code"), groupIds);
                } else {
                    menuResult = new JSONObject();
                    menuResult.put("result", new JSONArray());
                }
            }

            this.handleMenuArr(array, menuResult.getJSONArray("result"), appId, roleId, groupIds, appCode);
        }
        return array;
    }

    @PostMapping("/bind")
    @ResponseBody
    public JSONObject bind(@RequestParam(required = true) Long roleId, Long[] operationIds) {
        //清空操作
        JSONObject clearResult = operationApiFeign.roleBindClear(roleId);
        ResultCheckUtil.check(clearResult);
        if (operationIds != null && operationIds.length > 0) {
            //重新绑定
            JSONObject result = operationApiFeign.roleBindOperation(roleId, operationIds);

            ResultCheckUtil.check(result);

            return result;
        }
        return clearResult;
    }

    private String[] currentOperation(String appCode, String menuCode, Long[] groupIds) {
        JSONObject result = operationApiFeign.menuOperation(appCode, menuCode, groupIds);
        if (result != null && result.getBoolean("success")) {
            JSONArray operations = result.getJSONObject("result").getJSONArray("operation");
            if (operations != null) {
                String[] operationCodes = new String[operations.size()];
                for (int i = 0; i < operations.size(); i++) {
                    operationCodes[i] = operations.getJSONObject(i).getString("code");
                }
                return operationCodes;
            }
        }
        return null;
    }

    private void handleMenuArr(JSONArray arr, JSONArray menuArr, Long appId, Long roleId, Long[] groupIds, String appCode) {
        boolean needCheckOperation = false;
        if (groupIds != null && groupIds.length > 0) {
            needCheckOperation = true;
        }
        for (int i = 0; i < menuArr.size(); i++) {
            JSONObject menu = menuArr.getJSONObject(i);
            Long menuId = menu.getLong("id");
            menu.put("nodeId", "MENU-" + menuId);
            if (menu.getLong("pid") != null) {
                menu.put("parentNodeId", "MENU-" + menu.getLong("pid"));
            } else {
                menu.put("parentNodeId", "APP-" + appId);
            }
            arr.add(menu);
            if (menu.containsKey("children") && menu.getJSONArray("children").size() > 0) {
                handleMenuArr(arr, menu.getJSONArray("children"), appId, roleId, groupIds, appCode);
            } else {
                JSONObject operationListResult;
                JSONArray operationList;
                if (roleId != null) {
                    operationListResult = operationApiFeign.roleOperationList(roleId, menuId);
                    ResultCheckUtil.check(operationListResult);
                    operationList = operationListResult.getJSONObject("result").getJSONArray("operation");
                } else {
                    operationListResult = operationApiFeign.operationList(menuId);
                    operationList = operationListResult.getJSONArray("result");
                }
                String[] currOperations = null;
                if (needCheckOperation) {
                    currOperations = currentOperation(appCode, menu.getString("code"), groupIds);
                }
                for (int j = 0; j < operationList.size(); j++) {
                    JSONObject operation = operationList.getJSONObject(j);
                    if (currOperations != null) {
                        if (!ArrayUtils.contains(currOperations, operation.getString("code"))) {
                            continue;
                        }
                    }
                    if (!operation.containsKey("isSelect")) {
                        operation.put("isSelect", false);
                    }
                    operation.put("parentNodeId", "MENU-" + menuId);
                    operation.put("nodeId", "OP-" + operation.getLong("id"));
                    arr.add(operation);
                }
            }
        }
    }


}
