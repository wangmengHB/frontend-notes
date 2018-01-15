<template>
	<div style="width:100%; height: 100%; background-color: #f9f5f0; position: absolute; left: 0; right: 0; top: 0; bottom:0;">
		<head-top :goBack="true">
		</head-top>
		<div class="jf-content">
		<iframe :src="url" class="iframe">
		</iframe>
		</div>
	</div>
</template>

<script>
	import headTop from 'src/components/header/head'
	import {getSession} from 'src/config/mUtils'
	
	export default{
		data(){
			return {
				url: ''
			}
		},
		components: {
	    	headTop
	    },
		created(){
			document.querySelector('#app').style.height=document.body.clientHeight+'px';
			this.url = getSession('bannerJump')
		},
		mounted(){
			
		}
	}
</script>

<style lang="scss" scoped>
    @import 'src/style/mixin';

     .jf-content{
     	padding-top: 0.88rem;
 		@include wh(100%, 100%);
     }
     .iframe{
     	@include wh(100%, 100%);
     	border: none;
     }
</style>