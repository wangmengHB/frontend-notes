import fetch from '../config/fetch'
import {getStore} from '../config/mUtils'

/**
 * 获取商品分类
 */

export const getCategories = () => fetch('/proxy', {
	url: '/adv/getCategories?pageNum=1&pageSize=100'
});
//获取商品库列表
export const listLibraries = () => fetch('/proxy', {
	url: '/library/listLibraries'
});

//新建商品库
export const addProduct = (name) => fetch('/proxy', {
	url: '/library/add?name='+name
});