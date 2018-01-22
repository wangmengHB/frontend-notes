<template>
    <div>
	<head-top :goBack="true" :headTitle="headTitle">
	</head-top>
	<div class="jf-content">
		<img src="../../images/help1.jpg" />
		<img src="../../images/help2.jpg" />
		<img src="../../images/help3.jpg" />
		<img src="../../images/help4.jpg" />
		<img src="../../images/help5.jpg" />
		<img src="../../images/help6.jpg" />
		<img src="../../images/help7.jpg" />
		<img src="../../images/help8.jpg" />
		<img src="../../images/help9.jpg" />
	</div>
	</div>
</template>

<script>
		import {mapMutations} from 'vuex'
		import headTop from 'src/components/header/head'
		import {imgBaseUrl,loginUrl} from 'src/config/env'
		import {showBack, animate,getStore,getAppInfo,isApp} from 'src/config/mUtils'
		
		import {getImgPath} from 'src/components/common/mixin'
		
		export default{
			data(){
				return {
					headTitle:"新手教程",
				}
			},
			components: {
		    	headTop
		    },
			methods:{
			}
		}
</script>

<style lang="scss" scoped>
    @import 'src/style/mixin';
     .jf-content{
     	padding-top: 0.88rem;
     	font-size: 0;
     	img{
     		width: 100%;
     	}
     }
</style>