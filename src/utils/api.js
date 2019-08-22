import axios from 'axios';
import qs from 'qs';
import NProgress from 'nprogress';
import Vue from 'vue';




// let apiUrl = window.env.api.url || '';
// 配置API接口地址
let storageTokenKey = `token@${window.location.hostname}:${window.location.port}${window.location.pathname}`;
let apiUrl = process.env.API_HOST + '/';

let NODE_ENV = process.env.NODE_ENV;
if (NODE_ENV == "production") {
    apiUrl = location.protocol + "//" + location.host + '/';
}

let mergeUrl = function(url, params) {
    url += (-1 === url.indexOf('?')) ? '?' : '&';
    if (!!params === true) {
        if (typeof params === 'string') {
            url += params;
        }
        if (typeof params === 'object') {
            url += qs.stringify(params);
        }
    }
    return url;
};

let api = {
    getToken() {
        return window.localStorage.getItem(storageTokenKey + '/token');
    },
    /**
     * 设置 token
     * @param token [token_type, expires_in, access_token, refresh_token]
     */
    setToken(token) {
        window.localStorage.setItem(storageTokenKey + '/token', token);
        instance.defaults.headers['token'] = token;
    },

    deleteToken() {
        window.localStorage.removeItem(storageTokenKey + '/token');
        delete instance.defaults.headers['token'];
        store.remove('userInfo');
    },
    post(url, data) {
        return instance({
            method: 'post',
            url: apiUrl + url,
            data: data,
        });
    },
    get(url, params) {
        return instance.get(mergeUrl(apiUrl + url, params));
    },
    put(url, data) {
        return instance({
            method: 'put',
            url: apiUrl + url,
            data: qs.stringify(data),
        });
    },
    delete(url, params) {
        return instance({
            method: 'delete',
            url: apiUrl + url,
            params,
        });
    },
    download(url, params, filename) {
        url = mergeUrl(apiUrl + url, params);
        instance
            .get(url, { responseType: 'blob' })
            .then((response) => {
                // 尝试猜出文件名
                // let disposition = response.headers['content-disposition'];
                // let filename = decodeURI(disposition.match(/filename="(.*)"/)[1]);
                const url = window.URL.createObjectURL(new Blob([response.data]));
                const link = document.createElement('a');
                link.href = url;
                link.setAttribute('download', filename);
                document.body.appendChild(link);
                link.click();
            });
    },
    // apiUrl:NODE_ENV == "production"?apiUrl:'https://t.jiyuanet.com/wg/a/'
    apiUrl: apiUrl
};

let instance = axios.create({
    headers: {
        contentType: 'application/json;charset=UTF-8',
    }
});
instance.interceptors.request.use(config => {
    NProgress.start();
    return config;
});
instance.interceptors.response.use(response => {
    NProgress.done();
    // 超时或未登录自动跳转到登录页面
    if (response.data.code == 401) {
        api.deleteToken();
        window.location.href = '/'
        return false;
    }
    return response;
}, error => {
    NProgress.done();

    return Promise.reject(error)
});

export default api;