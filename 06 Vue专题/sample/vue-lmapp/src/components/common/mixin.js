import { getStyle,get_scrollTop_of_body } from '../../config/mUtils'
import { imgBaseUrl, localapi, proapi } from '../../config/env'
import { getProxy, jsonpProxyApiX } from 'src/service/proxy'

let _binding = null;
let _el = null;
let _mixinBindEvent = () => {
	console.log("scroll11");
	//var log=get_scrollTop_of_body() + document.documentElement.clientHeight +"::"+ document.documentElement.scrollHeight+"::"+document.documentElement.clientHeight;
	//document.querySelector(".title_text").innerHTML=log;
	var u = navigator.userAgent;
	var isiOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/);
	var userAgent = navigator.userAgent; //取得浏览器的userAgent字符串
	var  isSafari=(userAgent.indexOf("Safari") > -1);
    var isChrome = window.navigator.userAgent.indexOf("Chrome") !== -1;
	if(isSafari && isiOS ){    //ios sarafi 浏览器隐藏地址栏高度不一致，取屏幕高度  经测试地址栏隐藏相差69
	  if (get_scrollTop_of_body() + document.documentElement.clientHeight >= document.documentElement.scrollHeight-69) {
		   _binding.value();
	  }
	}else if(isChrome && !isiOS){  //安卓 sarafi 浏览器隐藏地址栏高度不一致，取屏幕高度  经测试地址栏隐藏相差56
	  if (get_scrollTop_of_body() + document.documentElement.clientHeight >= document.documentElement.scrollHeight-56) {
		   _binding.value();
	  }  
	}else{
	  if (get_scrollTop_of_body() + document.documentElement.clientHeight >= document.documentElement.scrollHeight) {
		   _binding.value();
	  }
	}
}

let _listen = () => {
	document.addEventListener('touchmove', _mixinBindEvent, false);
	document.addEventListener("scroll", _mixinBindEvent, false);
}

let _clear = () => {
	document.removeEventListener('touchmove', _mixinBindEvent, false);
	document.removeEventListener("scroll", _mixinBindEvent, false);
}

let openAgreement = () => {
	let content = "<div><input type='checkbox' id='chk_agree' style='vertical-align:middle;' checked='checked'/> 我已阅读并同意 <a style='color:red' href=''>《京东联盟在线协议》</a> <a style='color:red' href=''>《xxx》</a></div>";
	$j.open({
		content: content,
		btn: '继续开通',
		title: ' ',
		shadeClose: false,
		yes: function () {
			if(document.getElementById("chk_agree").checked){
				jsonpProxyApiX("cpsAgree").then(data => {
					$j.closeAll();
				}).catch(err => {
					console.log(err);
				})
			}
		}
	});
}

//同意协议
export const agreement = {
	mounted() {
		jsonpProxyApiX("cpsAgree").then(data => {
			if (data.code !== 0) {
				openAgreement();
			}
		}).catch(err => {
			console.log(err);
		});
	}
}

export const loadMore = {
	beforeDestroy() {
		console.log("beforeDestroy");
		_clear();
	},
	mounted() {
		console.log("mounted");
		_listen();
	},
	activated() {
		//keep alive先解除 再监听
		console.log("activated");
		_clear();
		_listen();
	},
	directives: {
		'load-more': {
			bind: (el, binding) => {
				console.log("bind");
				_binding = binding;
				_el = el;
			}
		}
	}
};

export const getImgPath = {
	methods: {
		//传递过来的图片地址需要处理后才能正常使用
		getImgPath(path) {
			let suffix;
			if (!path) {
				return 'http://test.fe.ptdev.cn/elm/elmlogo.jpeg'
			}
			if (path.indexOf('jpeg') !== -1) {
				suffix = '.jpeg'
			} else {
				suffix = '.png'
			}
			let url = '/' + path.substr(0, 1) + '/' + path.substr(1, 2) + '/' + path.substr(3) + suffix;
			return 'https://fuss10.elemecdn.com' + url
		},
	}

}

export const smartScroll = {
	methods: {
		//阻止弹窗滑动穿透问题
		smartScroll(selectorScrollable) {
			let self = this;

			// 如果没有滚动容器选择器，或者已经绑定了滚动时间，忽略
			if (!selectorScrollable) {
				return;
			}

			// 是否是搓浏览器
			// 自己在这里添加判断和筛选

			self.scrollElement = {
				posY: 0,
				maxscroll: 0
			};

			document.querySelector(selectorScrollable).addEventListener('touchstart', event => {

				let events = event.touches && event.touches[0] || event;

				// 先求得是不是滚动元素或者滚动元素的子元素
				let elTarget = event.target;

				if (!elTarget) {
					return;
				}

				// 垂直位置标记
				self.scrollElement.posY = events.pageY;
				self.scrollElement.scrollY = document.querySelector(selectorScrollable).scrollTop;
				// 是否可以滚动
				self.scrollElement.maxscroll = document.querySelector(selectorScrollable).scrollHeight - document.querySelector(selectorScrollable).clientHeight;
			})

			document.querySelector(selectorScrollable).addEventListener('touchmove', event => {
				// 如果不足于滚动，则禁止触发整个窗体元素的滚动
				if (self.scrollElement.maxscroll <= 0) {
					// 禁止滚动
					event.preventDefault();
				}
				// 当前的滚动高度
				let scrollTop = document.querySelector(selectorScrollable).scrollTop;

				// 现在移动的垂直位置，用来判断是往上移动还是往下
				let events = event.touches && event.touches[0] || event;
				// 移动距离
				let distanceY = events.pageY - self.scrollElement.posY;

				// 上下边缘检测
				if (distanceY > 0 && scrollTop == 0) {
					// 往上滑，并且到头
					// 禁止滚动的默认行为
					event.preventDefault();
					return;
				}

				// 下边缘检测
				if (distanceY < 0 && (scrollTop + 1 >= self.scrollElement.maxscroll)) {
					// 往下滑，并且到头
					// 禁止滚动的默认行为
					event.preventDefault();
					return;
				}
			})


			document.querySelector(selectorScrollable).addEventListener('touchend', event => {
				self.scrollElement.maxscroll = 0;
			});
		}
	}
}