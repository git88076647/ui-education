/**
 * 通用js方法封装处理
 * Copyright (c) 2019
 */
import numeral from 'numeral'

const baseURL = process.env.VUE_APP_BASE_API;

// 日期格式化
export function parseTime(time, pattern) {
  if (arguments.length === 0 || !time) {
    return null;
  }
  const format = pattern || '{y}-{m}-{d} {h}:{i}:{s}';
  let date;
  if (typeof time === 'object') {
    date = time;
  } else {
    if (typeof time === 'string' && /^[0-9]+$/.test(time)) {
      time = parseInt(time);
    } else if (typeof time === 'string') {
      time = time.replace(new RegExp(/-/gm), '/');
    }
    if (typeof time === 'number' && time.toString().length === 10) {
      time = time * 1000;
    }
    date = new Date(time);
  }
  const formatObj = {
    y: date.getFullYear(),
    m: date.getMonth() + 1,
    d: date.getDate(),
    h: date.getHours(),
    i: date.getMinutes(),
    s: date.getSeconds(),
    a: date.getDay(),
  };
  const time_str = format.replace(/{(y|m|d|h|i|s|a)+}/g, (result, key) => {
    let value = formatObj[key];
    // Note: getDay() returns 0 on Sunday
    if (key === 'a') {
      return ['日', '一', '二', '三', '四', '五', '六'][value];
    }
    if (result.length > 0 && value < 10) {
      value = '0' + value;
    }
    return value || 0;
  });
  return time_str;
}

// 表单重置
export function resetForm(refName) {
  if (this.$refs[refName]) {
    this.$refs[refName].resetFields();
  }
}

// 添加日期范围
export function addDateRange(params, dateRange) {
  var search = params;
  search.beginTime = '';
  search.endTime = '';
  if (null != dateRange && '' != dateRange) {
    search.beginTime = dateRange[0];
    search.endTime = dateRange[1];
  }
  return search;
}

// 回显数据字典
export function selectDictLabel(datas, value) {
  var actions = [];
  Object.keys(datas).map(key => {
    if (datas[key].dictValue == '' + value) {
      actions.push(datas[key].dictLabel);
      return false;
    }
  });
  return actions.join('');
}

// 通用下载方法
export function download(str) {
  console.log('下载文件：' + str);
  let urlstr = getFileUrl(str);
  const aLink = document.createElement('a');
  aLink.href = urlstr;
  document.body.appendChild(aLink);
  aLink.click();
  document.body.appendChild(aLink);
}

export function getFileUrl(url, defaultUrl) {
  if (!url || url == '') {
    return defaultUrl;
  }
  let url2 = url.toLowerCase();
  if (
    url2.startsWith('//:') ||
    url2.startsWith('http//:') ||
    url2.startsWith('https//:') ||
    url2.startsWith(process.env.VUE_APP_BASE_API + '/file-api') ||
    url2.startsWith(process.env.VUE_APP_BASE_API + '/auth-api')
  ) {
    return url;
  } else {
    return process.env.VUE_APP_BASE_API + '/file-api' + url;
  }
}

// 字符串格式化(%s )
export function sprintf(str) {
  var args = arguments,
    flag = true,
    i = 1;
  str = str.replace(/%s/g, function() {
    var arg = args[i++];
    if (typeof arg === 'undefined') {
      flag = false;
      return '';
    }
    return arg;
  });
  return flag ? str : '';
}

// 转换字符串，undefined,null等转化为""
export function praseStrEmpty(str) {
  if (!str || str == 'undefined' || str == 'null') {
    return '';
  }
  return str;
}

// 根据状态合并Entity数组
export function mergeEntity(newEntity, oldEntity, idKey) {
  debugger;
  if (!oldEntity) {
    return newEntity;
  } else {
    let entity = [];
    /** 0 正常 */
    /** 1 删除 */
    /** 2 更新 */
    /** 3 新增*/
    for (let i = 0, len = newEntity.length; i < len; i++) {
      if (!newEntity[i][idKey]) {
        /** 新增行 */
        newEntity[i].entityStatus = 3;
        entity.push(newEntity[i]);
        continue;
      }
      let entityStatus = -1;
      for (let j = 0, lenj = oldEntity.length; j < lenj; j++) {
        if (JSON.stringify(newEntity[i]) == JSON.stringify(oldEntity[j])) {
          /** 完全相等 */
          entityStatus = 0;
        } else if (newEntity[i][idKey] == oldEntity[j][idKey]) {
          /** 不完全相等，但是主键相等说明更新 */
          entityStatus = 2;
        }
        if (entityStatus > -1) {
          break;
        }
      }
      if (entityStatus == -1) {
        /** 新增行 */
        newEntity[i].entityStatus = 3;
        entity.push(newEntity[i]);
      } else if (entityStatus > 0) {
        /** 更新行 */
        newEntity[i].entityStatus = entityStatus;
        entity.push(newEntity[i]);
      }
    }
    /** 删除行 */

    for (let j = 0, lenj = oldEntity.length; j < lenj; j++) {
      let found = false;
      for (let i = 0, len = newEntity.length; i < len; i++) {
        if (newEntity[i][idKey] == oldEntity[j][idKey]) {
          found = true;
          break;
        }
      }
      if (!found) {
        oldEntity[j].entityStatus = 1;
        entity.push(oldEntity[j]);
      }
    }
    return entity;
  }
}

/**
 * element dialog drag
 */
export const dialogDrag = {
  bind(el, binding, vnode, oldVnode) {
    const dialogHeaderEl = el.querySelector('.el-dialog__header');
    const dragDom = el.querySelector('.el-dialog');

    dialogHeaderEl.style.cssText += ';cursor:move;';
    dragDom.style.cssText += ';top:0px;';

    // 获取原有属性 ie dom元素.currentStyle 火狐谷歌 window.getComputedStyle(dom元素, null);
    const sty = (() => {
      if (window.document.currentStyle) {
        return (dom, attr) => dom.currentStyle[attr];
      } else {
        return (dom, attr) => getComputedStyle(dom, false)[attr];
      }
    })();

    dialogHeaderEl.onmousedown = e => {
      // 鼠标按下，计算当前元素距离可视区的距离
      const disX = e.clientX - dialogHeaderEl.offsetLeft;
      const disY = e.clientY - dialogHeaderEl.offsetTop;

      const screenWidth = document.body.clientWidth; // body当前宽度
      const screenHeight = document.documentElement.clientHeight; // 可见区域高度(应为body高度，可某些环境下无法获取)

      const dragDomWidth = dragDom.offsetWidth; // 对话框宽度
      const dragDomheight = dragDom.offsetHeight; // 对话框高度

      const minDragDomLeft = dragDom.offsetLeft;
      const maxDragDomLeft = screenWidth - dragDom.offsetLeft - dragDomWidth;

      const minDragDomTop = dragDom.offsetTop;
      const maxDragDomTop = screenHeight - dragDom.offsetTop - dragDomheight;

      // 获取到的值带px 正则匹配替换
      let styL = sty(dragDom, 'left');
      let styT = sty(dragDom, 'top');

      // 注意在ie中 第一次获取到的值为组件自带50% 移动之后赋值为px
      if (styL.includes('%')) {
        styL = +document.body.clientWidth * (+styL.replace(/\%/g, '') / 100);
        styT = +document.body.clientHeight * (+styT.replace(/\%/g, '') / 100);
      } else {
        styL = +styL.replace(/\px/g, '');
        styT = +styT.replace(/\px/g, '');
      }

      document.onmousemove = function(e) {
        // 通过事件委托，计算移动的距离
        let left = e.clientX - disX;
        let top = e.clientY - disY;

        // 边界处理
        if (-left > minDragDomLeft) {
          left = -minDragDomLeft;
        } else if (left > maxDragDomLeft) {
          left = maxDragDomLeft;
        }

        if (-top > minDragDomTop) {
          top = -minDragDomTop;
        } else if (top > maxDragDomTop) {
          top = maxDragDomTop;
        }

        // 移动当前元素
        dragDom.style.cssText += `;left:${left + styL}px;top:${top + styT}px;`;
      };

      document.onmouseup = function(e) {
        document.onmousemove = null;
        document.onmouseup = null;
      };
    };
  },
};

/**
 * 格式化数字
 * @param {string, number} value
 * @param {string} format
 * @returns
 */
export const formatNumber = (value, format) => numeral(value).format(format)
