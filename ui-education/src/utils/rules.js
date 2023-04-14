export const validCode = (rule, value, callback) => {
  if (/^[0-9a-zA-Z]*$/.test(value)) {
    callback()
  }
  callback(new Error('编码只能为英文字母和数字'))
}
