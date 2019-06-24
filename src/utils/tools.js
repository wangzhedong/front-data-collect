
/**
 * 深度克隆数据,包括对象，数组，map
 * @param {*} obj 对象，数组，map
 */
function deepCopy(obj) {
    if (!isObject(obj) && !isMap(obj)) {
        console.error('obj不是一个对象也不是map！');
        return obj;
    }

    let cloneObj;
    if (isMap(obj)) {
        cloneObj = new Map();
        for (let key of obj.keys()) {
            let value = obj.get(key);
            if (isMap(value) || isObject(value)) {
                cloneObj.set(key, deepCopy(value));
            }
        }
    }else if(typeof obj === "function"){
        cloneObj = obj
    }else {
        cloneObj = Array.isArray(obj) ? [] : {};
        if(obj instanceof HTMLElement){
            cloneObj=obj.cloneNode(true)
        }else {
            for (let key in obj) {
                if (obj.hasOwnProperty(key)) {
                    cloneObj[key] =
                        isMap(obj[key]) || isObject(obj[key])
                            ? deepCopy(obj[key])
                            : obj[key];
                }
            }

        }
    }
    return cloneObj;
}

/**
 * 判断参数是否是Object类型
 * @param {*} o 
 */
function isObject(o) {
    return (
        !isMap(o) &&
        (typeof o === 'object' || typeof o === 'function') &&
        o !== null
    );
}

/**
 * 判断参数是否是Map类型
 * @param {*} obj 
 */
export function isMap(obj) {
    if (obj instanceof Map) {
        return true;
    } else {
        return false;
    }
}

export {deepCopy}