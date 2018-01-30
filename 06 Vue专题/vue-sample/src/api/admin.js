import axios from 'axios'
import {base} from './config.js'


const handleResponse = (res) => new Promise((resolve, reject) => {
    if (res) {
        resolve(res.data)
    }
})


export const getProductList = (page = 0) => {
    return axios.get(`${base}/v1/admin/${page}/products`)
        .then((res) => handleResponse(res))
}


export const getUserList = (page = 0) => {
    return axios.get(`${base}/v1/admin/${page}/users`)
        .then((res) => handleResponse(res))
}


export const getTplByType = (type) => {
    return axios.get(`${base}/v1/admin/${type}/commonTemplate`)
        .then((res) => handleResponse(res))
}

export const uploadTemplate = (type, params) => {
    return axios({
		method: 'post',
		url: `${base}/v1/admin/${type}/commonTemplate`,
		data: params.file,
		headers:{
			'Content-Type':'multipart/form-data'
		}
	}).then(res => errorHandle(res));
}

export const switchProduct = (enable, productID) => {
    // 0: enable; 1: disable
    return axios({
		method: 'post',
		url: `${base}/v1/admin/${enable}/${productID}/ability`,
		data: params.file,
		headers:{
			'Content-Type':'application/json'
		}
	}).then(res => errorHandle(res));
}
