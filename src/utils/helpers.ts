 
export const isEmptyString = (value: string) : boolean => {
    if(!value || typeof value !== "string" || value === "" || !value.length) return true;
    return false
} 

/**
 * Set localstorage data
 * @param {*} key
 * @param {*} value
 */
export const setLocalStorageItem = (key: string, value: {}) => {
    const enc = JSON.stringify(value);
    sessionStorage.setItem(key, window.btoa(unescape(encodeURIComponent(enc))));
};
/**
 * Set localstorage data
 * @param {*} key
 * @param {*} value
 */
export const deleteLocalStorageItem = (key: string) => {
    sessionStorage.removeItem(key);
};

/**
 * Get the localstorage data
 * @param {*} key
 */
export const getLocalStorageItem = (key: string) => {
    const value = sessionStorage.getItem(key);
    if (value) {
        const dec = decodeURIComponent(escape(window.atob(value)));
        return JSON.parse(dec);
    }
    return null;
};
