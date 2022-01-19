import mask from './index.vue';
import Vue from'vue';

const maskConstructor = Vue.extend(mask);
const maskTool = [];

let removeDom = e => {
	let node = e.target;
  	if (node.parentNode) {
    	node.parentNode.removeChild(node);
  	}
};

let show = ({
	callback=()=>{},
	opacity=.4
}={})=>{
	if(maskTool.length){
		//return
	}
	const maskInstance = new maskConstructor({
		el:document.createElement('div')
	})
	maskInstance.opacity = opacity;
	maskTool.push(maskInstance);
	maskInstance.show = true;
	document.body.appendChild(maskInstance.$el)
	maskInstance.$on('hide',callback)
}

// 隐藏一个mask
let hide = ()=>{
	let maskInstance = maskTool.splice(0,1)[0];
	maskInstance && maskInstance.$el.addEventListener('transitionend',removeDom)
	maskInstance && (maskInstance.show = false);
}

// 清除maskTool,隐藏所有mask
let allHide = ()=>{
	maskTool.forEach((item)=>{
		item.$el.addEventListener('transitionend',removeDom)
		item.show = false;
	})
	maskTool.splice(0,maskTool.length)
}
const maskEntity = {
	show:show,
	hide:hide,
	allHide:allHide
}
export default maskEntity;