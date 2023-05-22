/* eslint-disable prettier/prettier */
import axios from 'axios';

const HTTP = axios.create({
    baseURL: 'http://oscarreimar-001-site2.ftempurl.com', //'http://localhost:5010',//
    timeout: 50000 // timeout,
});
HTTP.defaults.showLoader = true;

HTTP.interceptors.request.use((req) => {
    const token = localStorage.getItem('token');
    // console.log(token);
    req.headers['Authorization'] = token;
    req.headers['Access-Control-Allow-Origin'] = '*';

    if (token) {
        req.headers.Authorization = `Bearer ${token}`;
    }

    return req;
});

HTTP.interceptors.response.use(
    (res) => res,
    (error) => {
        // console.log(error.response.status);
        if (error.response.status == 401) {
            error.message = 'Denied Access';
            // router.push('/auth/access');
        }
        return Promise.reject(error);
    }
);

export default HTTP;
