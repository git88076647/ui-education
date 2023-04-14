/**
 * 获取参照列表
 *
 * @param {Object} params
 * @param {Promise} fetchData
 * @param {Object} config
 * @returns {Promise}
 */
export const fetchRefList = (params, fetchData, config) => {
  return new Promise((resolve, reject) => {
    if (fetchData) {
      fetchData(params).then(resposnse => {
        const data = {
          list: resposnse.rows || [],
          total: resposnse.total || 0,
        };
        resolve(data);
      });
    } else {
      reject(new Error('找不到参照源'));
    }
  });
};

/**
 * 转换表格显示类型
 *
 * @param {Boolean} multiple
 * @returns {String}
 */
export const getTableType = multiple => {
  return multiple ? 'multiple' : 'single';
};

/**
 * 获取字符串像素宽度
 *
 * @param {string} content
 * @param {number} fontSize
 * @returns {number}
 */
export const getTextWidth = (content, fontSize = 14) => {
  let ele = document.createElement('span');
  //字符串中带有换行符时，会被自动转换成<br/>标签，若需要考虑这种情况，可以替换成空格，以获取正确的宽度
  //str = str.replace(/\\n/g,' ').replace(/\\r/g,' ');
  ele.innerText = content;
  //不同的大小和不同的字体都会导致渲染出来的字符串宽度变化，可以传入尽可能完备的样式信息
  ele.style.fontSize = fontSize;
  //由于父节点的样式会影响子节点，这里可按需添加到指定节点上
  document.documentElement.append(ele);
  const result = ele.offsetWidth;
  console.log(result);
  document.documentElement.removeChild(ele);
  return result;
};
