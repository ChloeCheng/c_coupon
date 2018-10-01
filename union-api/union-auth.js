// import CryptoJS from './crypto/index.js';
// import CONST from '../common/constant.js';
import storage from '../common/storage.js';

function getApiSign(params){
    let paramKeys = Object.keys(params).sort();
    let paramValues = paramKeys.map(key=>typeof params[key]!=='undefined' ? params[key].toString() : '');
    let str = paramValues.join('');
    let salt = CONST.API_SECRET;
    let tokenSecret = getTokenSecret();
    if(tokenSecret){
        salt = salt + '&' + tokenSecret;
    }
    let sha1 = CryptoJS.algo.SHA1.create();
    sha1.reset();
    sha1.update(salt);
    let hashed = sha1.finalize(str).toString();
    return hashed;
}

function getUCode(){
    return storage.get('union_ucode') || '';
}

function getUserToken(){
    return storage.get('union_token') || '';
}

function getTokenSecret(){
    return storage.get('union_token_secret') || '';
}

function getUserId(){
    return storage.get('union_userId') || '';
}

export {getApiSign, getUCode, getUserToken, getTokenSecret, getUserId}