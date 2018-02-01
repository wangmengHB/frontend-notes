import axios from 'axios'
import {base} from './config.js'
import indicator from './indicator'


const handleResponse = (res) => new Promise((resolve, reject) => {
    if (res) {
        resolve(res.data)
    }
})

export const authValidation = params => {
	return axios.post(`${base}/v1/auth/validation`, params)
		.then(res => handleResponse(res));
};


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

export const uploadTemplate = (type, file) => {
    return axios({
		method: 'post',
		url: `${base}/v1/admin/${type}/commonTemplate`,
		data: file,
		headers:{
			'Content-Type':'multipart/form-data'
		}
	}).then(res => handleResponse(res));
}

export const deleteTemplate = (fileId) => {
	return axios.delete(`${base}/v1/admin/${fileId}/commonTemplate`)
		.then(res => handleResponse(res))
}


export const switchProduct = (on = true, productID) => {
	// 0: enable; 1: disable
	let enable = on? 0: 1;
    return axios({
		method: 'post',
		url: `${base}/v1/admin/${enable}/${productID}/ability`,
		headers:{
			'Content-Type':'application/json'
		}
	}).then(res => handleResponse(res));
}

