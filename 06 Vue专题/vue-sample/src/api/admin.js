import axios from 'axios'
import {root} from './config.js'
import indicator from './indicator'
import md5 from 'md5'


const handleResponse = (res) => new Promise((resolve, reject) => {
    if (res) {
        resolve(res.data)
    }
})

export const changePass = ({loginName, oldPass, loginPass}) => {
	let params = {
		loginName,
		loginPass: md5(oldPass),
		newLoginPass: md5(loginPass),
		loginTime: new Date().getTime()
	}
	return axios.post(`${root}/api/v1/admin/adminPassword`, params)
		.then(res => handleResponse(res))
}


export const userLogin = ({loginName, loginPass}) => {
	let params = {
		loginName,
		loginPass: md5(loginPass),
		loginTime: new Date().getTime()
	}
	return axios.post(`${root}/api/v1/auth/admin/login`, params)
		.then(res => handleResponse(res));
};

export const userLogout = () => {
	return axios.get(`${root}/api/v1/auth/admin/logout`)
		.then(res => handleResponse(res));
}



export const getProductList = (page = 0) => {
    return axios.get(`${root}/api/v1/admin/${page}/products`)
        .then((res) => handleResponse(res))
}


export const getUserList = (page = 0) => {
    return axios.get(`${root}/api/v1/admin/${page}/users`)
        .then((res) => handleResponse(res))
}


export const getTplByType = (type) => {
    return axios.get(`${root}/api/v1/admin/${type}/commonTemplate`)
        .then((res) => handleResponse(res))
}

export const uploadTemplate = (type, file) => {
    return axios({
		method: 'post',
		url: `${root}/api/v1/admin/${type}/commonTemplate`,
		data: file,
		headers:{
			'Content-Type':'multipart/form-data'
		}
	}).then(res => handleResponse(res));
}

export const deleteTemplate = (fileId) => {
	return axios.delete(`${root}/api/v1/admin/${fileId}/commonTemplate`)
		.then(res => handleResponse(res))
}


export const switchProduct = (on = true, productID) => {
	// 0: enable; 1: disable
	let enable = on? 0: 1;
    return axios({
		method: 'post',
		url: `${root}/api/v1/admin/${enable}/${productID}/ability`,
		headers:{
			'Content-Type':'application/json'
		}
	}).then(res => handleResponse(res));
}

