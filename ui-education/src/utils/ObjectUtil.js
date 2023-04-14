/**
 * 前后端 交互BO 工具函数 <br/>
 * <br/>
 * <br/>
 *
 * @author air Email:209308343@qq.com
 * @date 2020/4/13 0013 16:10
 * @project
 * @Version
 */

import fi from "element-ui/src/locale/lang/fi";

/**
 * 从一个对象集合  里找到第一个符合 字段值=value的对象，如果没有返回 {}空对象 <br/>
 *
 *
 * @param vos          VO集合
 * @param fieldName        字段名
 * @param value  字段名 的值
 * @return Object
 */
export function findObj(vos, fieldName, value) {
  if (!Array.isArray(vos) || isEmpty(vos)) {
    return new Object();
  }

  for (let vo of vos) {
    if (value === vo[fieldName]) {
      return vo;
    }
  }

  return new Object();
}

/**
 * 从一个对象集合  里找到第一个符合 字段值=value的对象 然后获得他的某个指定列的值 ，如果没有返回 defaultValue <br/>
 *
 *
 * @param vos          VO集合
 * @param fieldName        字段名
 * @param value  字段名 的值
 * @param defaultValue 如果没有 返回啥
 * @return Object
 */
export function findObjValue(vos, fieldName, value, getFieldName, defaultValue) {
  let vo = findObj(vos, fieldName, value);

  return isEmpty(vo[getFieldName]) ? defaultValue : vo[getFieldName];
}

/**
 * 把一个对象集合 组装成 前端可识别的 树形集合对象  <br/>
 * https://element.eleme.cn/#/zh-CN/component/cascader  <br/>
 *
 * @param vos          VO集合
 * @param idName       id列名 的字段名
 * @param fatherIdName 父级id列名 的字段名
 * @param labelName    前端 显示列名 的字段名
 * @param valueName    前端 值列名 的字段名
 * @return Array
 */
export function toTreeBO(vos, idName, fatherIdName, labelName, valueName) {
  if (!Array.isArray(vos) || isEmpty(vos)) {
    return new Array(0);
  }

  //第一，我先 构建 id 映射表
  let groupByIdMap = new Map();
  let idValue;
  let fatherIdValue;
  let labelValue;
  let valueValue;
  for (let vo of vos) {
    idValue = vo[idName];
    groupByIdMap.set(idValue, vo);
  }

  //开始构建
  let node;
  let bo = new Array();
  for (let vo of vos) {
    fatherIdValue = vo[fatherIdName];
    if (groupByIdMap.has(fatherIdValue)) {
      //不是第一层
      continue;
    }

    node = {
      "label": vo[labelName],
      "value": vo[valueName],
      "children": getChildren(vos
        , idName, fatherIdName
        , labelName
        , valueName
        , vo[idName]),
    };

    bo.push(node);
  }

  return bo;
}

/**
 * 判断 对象是否未定义 或 null
 * @param obj
 */
export function isNull(obj) {
  return null == obj || undefined == obj;
}

/**
 * 判断 对象 不是未定义 和 null
 * @param obj
 */
export function notNull(obj) {
  return !isNull(obj);
}

/**
 * 判断 array map string  未定义 or null or 无元素 or 空字符串
 * @param obj
 */
export function isEmpty(obj) {
  if (isNull(obj)) {
    return true;
  }

  if (typeof obj === 'function') {
    return false;
  }

  if (typeof obj === 'string') {
    return obj.length < 1;
  }

  if (Array.isArray(obj)) {
    return obj.length < 1;
  }

  if (obj instanceof Map) {
    return obj.size < 1;
  }

  return false;
}

/**
 * 判断 array map string 不是 未定义 or null or 无元素 or 空字符串
 * @param obj
 */
export function notEmpty(obj) {
  return !isEmpty(obj);
}

/**
 * 构建树形bo： 获取指定father的孩子们
 * @param vos
 * @param idName
 * @param fatherIdName
 * @param labelName
 * @param valueName
 * @param fatherValue
 */
function getChildren(vos, idName
  , fatherIdName, labelName
  , valueName, fatherValue) {
  let bo = new Array();
  let node;
  let fid;
  let is;
  for (let vo of vos) {
    fid = vo[fatherIdName];
    is = fatherValue === fid;

    if (!is) {
      is = isNull(fatherValue) && isNull(fid);
    }

    if (!is) {
      //不是他孩子
      continue;
    }

    node = {
      "label": vo[labelName],
      "value": vo[valueName],
      "children": getChildren(vos
        , idName, fatherIdName
        , labelName
        , valueName
        , vo[idName]),
    };

    bo.push(node);
  }

  return bo ;
}
