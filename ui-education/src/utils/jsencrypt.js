import JSEncrypt from 'jsencrypt/bin/jsencrypt'
import jsmd5 from 'js-md5'

// 密钥对生成 http://web.chacuo.net/netrsakeypair

const publicKey = 'MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQCGtnT8QI52oxj0dlX8II5wvSp4ywU38uZd5ahQm8iKJN4LzzbSr7+2jLZWTA/XdaxBYB8E0Mzk/99aFAUCuYNo4otG1GCpKRygKOfNAKCLPFThxKLMCAdraCZ/lZr1b6KEPnI5MgfaZOcAa20Wa/ITh70KVouqiU0V3Hqu8dpytwIDAQAB'

const privateKey = ''

const prefix = 'CPF_Cxx~丨'
    // 加密
export function encrypt(txt) {
    const encryptor = new JSEncrypt()
    encryptor.setPublicKey(publicKey) // 设置公钥
    return prefix + encryptor.encrypt(txt) // 对需要加密的数据进行加密 .replace(/\+/g, '%2B')
}

// 解密
export function decrypt(txt) {
    const encryptor = new JSEncrypt()
    encryptor.setPrivateKey(privateKey)
    return encryptor.decrypt(txt)
}

//md5
export function md5(txt) {
    return jsmd5(prefix + txt);
}