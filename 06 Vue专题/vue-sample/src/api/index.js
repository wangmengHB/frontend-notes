import indicator from './indicator'
import {
    getProductList,
    switchProduct,
    getUserList,
    getTplByType,
    uploadTemplate,
    deleteTemplate 
} from './admin'

window._indicator_ = indicator;

export {
    getProductList,
    switchProduct,
    getUserList,
    getTplByType,
    uploadTemplate,
    deleteTemplate,
    indicator
}




