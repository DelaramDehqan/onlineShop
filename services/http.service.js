import axios from 'axios';
import {toast} from 'react-toastify';
import {ACCESS_TOKEN, REFRESH_TOKEN, BASE_URL, IS_LOGGED_IN} from 'configs/variables.config';
import errorMap from 'assets/data/error-map';
import history from './history.service';
import {LOGIN, REFRESH_TOKEN as REFRESH_TOKEN_URL, WHOAMI} from 'configs/url.config';
import {PATHS} from 'configs/routes.config';
import {refreshToken} from 'redux/actions/user.action';
import store from 'redux/store';

let canRefresh = true;

class HttpService {
    constructor() {
        axios.defaults.baseURL = BASE_URL;

        axios.interceptors.request.use((config) => {
            let token = localStorage.getItem(config.url !== REFRESH_TOKEN_URL ? ACCESS_TOKEN : REFRESH_TOKEN);
            if (config.url !== LOGIN && (config.url === WHOAMI || token)) {
                config.headers['token'] = `${token}`
            }

            return config;
        }, (error) => {
            return Promise.reject(error);
        });

        axios.interceptors.response.use((response) => {
                canRefresh = true;
                return response;
            },
            async (error) => {
                if (!error.response) return Promise.reject(error);

                const originalRequest = error.config;
                console.log('error : ', originalRequest);
                if (error.response.status === 401) {
                    if (canRefresh) {
                        canRefresh = false;
                        try {
                            await store.dispatch(refreshToken());
                            return new Promise((resolve, reject) => {
                                axios.request(originalRequest)
                                    .then((res) => {
                                        console.log('res originalRequest : ', res);
                                        resolve(res);
                                    })
                                    .catch(e => {
                                        reject(e);
                                    })
                            });

                        } catch (e) {
                            console.log('error refresh token: ', error.response);
                            localStorage.setItem(IS_LOGGED_IN, false.toString());
                            history.push(PATHS.PANEL_LOGIN);
                            return Promise.reject(error);
                        }
                    }
                } else {
                    toast.error(errorMap[error.response.status])
                    return Promise.reject(error);
                }

            })
    }


    get(url, config) {
        return axios.get(url, config);
    }

    getId = (url,id)=>{
        return axios.get(`${url}/${id}`)
    }

    post(url, data) {
        return axios.post(url, data);
    }

    put(url, data, config) {
        return axios.put(url, data, config);
    }

    patch(url, data , id) {
        return axios.patch(`${url}/${id}`, data);
    }

    delete(url, id) {
        return axios.delete(`${url}/${id}`);
    }
}

export default new HttpService();