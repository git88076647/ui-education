
/**
 * 获取 localStorage 缓存
 * @param {string} name
 * @param {any} defaultValue
 */
export const getCache = (name, defaultValue = undefined) => {
  const cacheValue = localStorage.getItem(name)
  try {
    return cacheValue ? JSON.parse(cacheValue) : defaultValue
  } catch (error) {
    return defaultValue
  }
}

/**
 * 设置 localStorage 缓存
 * @param {string} name
 * @param {any} value
 */
export const setCache = (name, value) => {
  const cacheString = JSON.stringify(value)
  localStorage.setItem(name, cacheString)
}

/**
 * 删除 localStorage 缓存
 * @param {string} name
 */
export const removeCache = (name) => {
  localStorage.removeItem(name)
}

/**
 * 获取有效的序列号
 * @param {number} index
 * @param {number} defaultIndex
 */
export const pickIndex = (index, defaultIndex) => {
  return typeof index === 'undefined' ? defaultIndex : index
}
