import { find } from "lodash"

const requestLocked = {};
const indexedDatabase = 'KeLun';
const IndexedDB = window.indexedDB || window.webkitIndexedDB || window.mozIndexedDB || window.msIndexedDB;

/**
 * 查询参照内容
 * @param {string} value
 * @param {() => Promise} queryData
 * @param {string} valueName
 * @param {number} version
 */
export const showRefName = (value, queryData, valueName = 'id', dataField = "rows", version = undefined) => {
  if (typeof value === 'undefined' || value === null) {
    return
  }
  return new Promise((resolve, reject) => {
    const tableName = queryData.name
    const request = IndexedDB.open(indexedDatabase, version)
    // 更新数据库
    request.onupgradeneeded = (e) => {
      const database = e.target.result
      // 检查数据表是否存在
      if (!database.objectStoreNames.contains(tableName)) {
        const objectStore = database.createObjectStore(tableName, { keyPath: valueName })
        objectStore.createIndex('value', valueName, { unique: true })
      }
    }
    // 读取数据库
    request.onsuccess = (e) => {
      const database = e.target.result
      // 如果表格不存在，则更新数据库
      if (!database.objectStoreNames.contains(tableName)) {
        const currentVersion = database.version
        // 关闭当前数据库
        database.close();
        showRefName(value, queryData, valueName, dataField, currentVersion + 1).then(resData => {
          resolve(resData)
        })
        return
      }
      // 查询数据
      const store = database.transaction([tableName]).objectStore(tableName)
      const item = store.index('value').get(value);
      item.onsuccess = (e) => {
        const resultValue = e.target.result
        if (resultValue) {
          resolve(resultValue);
          database.close();
        } else {
          // 数据库查询无结果，转为服务器查询
          // 模拟请求锁，多个查询共享一次请求结果
          let requestIndex = 1
          const requestName = tableName + value
          const params = {}
          params[valueName] = value
          if (!Object.prototype.hasOwnProperty.call(requestLocked, requestName)) {
            requestLocked[requestName] = {
              last: requestIndex,
              promise: queryData(params)
            }
          } else {
            requestIndex = requestLocked[requestName].last + 1
            requestLocked[requestName].last = requestIndex
          }
          // 等待查询结果
          const requestPromise = requestLocked[requestName].promise
          requestPromise.then(response => {
            const refList = response[dataField]
            // 查找数据
            const flag = {}
            flag[valueName] = value
            const queryItem = find(refList, flag)
            resolve(queryItem)
            // 请求结束后，删除请求锁
            if (requestIndex === requestLocked[requestName].last) {
              delete requestLocked[requestName]
              // 更新数据库
              const putTransaction = database.transaction([tableName], 'readwrite')
              const writeStore = putTransaction.objectStore(tableName)
              refList.forEach(item => {
                writeStore.put(item)
              });
            }
            database.close();
          })
        }
      }
      item.onerror = (e) => {
        // TODO 查询错误处理
        console.warn(e);
        database.close();
      }
    }
    // 打开数据库失败
    request.onerror = (e) => {
      console.warn(e);
      reject(e)
      const database = e.target.result;
      database.close();
    }
  })
}

/**
 * 更新数据库
 * @param {object} value
 * @param {Function} queryData
 * @param {string} valueName
 * @param {string} dataField
 * @param {number} version
 */
export const putRefData = (list, queryData, valueName = 'id', dataField = "rows", version = undefined,) => {
  return new Promise((resolve) => {
    const tableName = queryData.name
    const request = IndexedDB.open(indexedDatabase, version)
    // 更新数据库
    request.onupgradeneeded = (e) => {
      const database = e.target.result
      // 检查数据表是否存在
      if (!database.objectStoreNames.contains(tableName)) {
        const objectStore = database.createObjectStore(tableName, { keyPath: valueName })
        objectStore.createIndex('value', valueName, { unique: true })
      }
    }
    // 更新数据库
    request.onsuccess = (e) => {
      const database = e.target.result
      // 如果表格不存在，则更新数据库
      if (!database.objectStoreNames.contains(tableName)) {
        const currentVersion = database.version
        // 关闭当前数据库
        database.close();
        putRefData(list, queryData, valueName, dataField, currentVersion + 1).then(resData => {
          resolve(resData)
        })
        return
      }
      // 更新数据库
      const putTransaction = database.transaction([tableName], 'readwrite')
      const writeStore = putTransaction.objectStore(tableName)
      list.forEach(item => {
        writeStore.put(item)
      });
      resolve(true)
      database.close();
    }
    // 打开数据库失败
    request.onerror = (e) => {
      reject(e)
      const database = e.target.result;
      database.close();
    }
  })
}

/**
 * 删除指定表的数据
 * @param {() => Promise} queryData
 */
export const clearRefNameCache = (queryData) => {
  return new Promise((resolve) => {
    const request = window.indexedDB.open(indexedDatabase)
    const tableName = queryData.name

    request.onsuccess = (e) => {
      const database = e.target.result
      const objectStore = database.transaction([tableName], 'readwrite').objectStore(tableName)
      // 遍历删除
      objectStore.openCursor().onsuccess = (e) => {
        const cursor = e.target.result
        if (cursor) {
          cursor.delete()
          cursor.continue()
        } else {
          resolve(true)
          database.close();
        }
      }
    }
  })
}

/**
 * 清空缓存
 */
export const deleteIndexedDB = () => {
  IndexedDB.deleteDatabase(indexedDatabase)
}
