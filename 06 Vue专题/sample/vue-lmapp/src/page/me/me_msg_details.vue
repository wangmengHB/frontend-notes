<template>
	<div>
		<head-top :goBack="true" :headTitle="headTitle">
			
	    </head-top>
        <div class="jelly-content"  style="background: whitesmoke;">
			<div class="jelly-card" v-if="isNotice" style="overflow: auto;">
				<div class="jelly-card-header">
					{{title}}
				</div>
				<div class="jelly-card-content">
                    <div class="jelly-card-content-inner" v-html="body">

					</div>
				</div>
			</div>
			
			<div class="jelly-card" v-else="isNotice" style="overflow: auto;">
				<div class="jelly-collapse-content">
					<h5>{{title}}</h5>
					<span v-show="false" class="sender">{{sender}}</span>
		    		<p v-html="body"></p>
		    		<h6>{{messageTime}}</h6>
		    	</div>
			</div>
		</div>
	</div>
</template>

<script>
	import {mapMutations} from 'vuex'
	import headTop from 'src/components/header/head'
	
	export default {
	data(){
        return {
	            headTitle:"",
	            isNotice:"true",
	            title:'',
	            body:'',
	            messageTime:'',
	            sender:'',
           }
            
    },
    mounted(){
       this.init();
    },
    components: {
    	headTop,
    },
    computed: {

    },
    methods: {
		init(){
			let str = sessionStorage.getItem("detailData");
			let info=JSON.parse(str);
			if(typeof(info.noticeId)!='undefined'){
				this.headTitle='公告详情';
				this.isNotice=true;
				this.title=info.title;
			    this.body=info.body;
			}else{
				this.headTitle='消息详情';
				this.isNotice=false;
				this.title=info.title;
			    this.body=info.content;
			    this.messageTime=info.messageTime;
			    this.sender=info.sender;
			}
		}
    },
    watch:{
    }
}
</script>

<style lang="scss" scoped>
    @import 'src/style/mixin';
    .jelly-content{
    	padding-top: 0.88rem;
    	.jelly-card-header{
    		font-size: 0.3rem;
            padding: 0.2rem;
            border-bottom:1px solid #c8c7cc;
    	}
    	.jelly-card-content-inner{
            padding: 0.2rem;
            font-size: 0.28rem !important;
			margin-bottom:0.2rem !important;
			color: rgb(0,0,0) !important;
        }
        .jelly-collapse-content{
        	text-align: center;
        	padding: 0.2rem;
        	font-size: 0;
			word-break:break-all;
        	h5{
        		font-size: 0.3rem;
				text-align:left;
        	}
        	span{
        		font-size: 0.2rem;
        		line-height: 0.5rem;
        	}
        	p{
				margin-top:.1rem;
        		font-size:0.28rem;
        		line-height: 0.38rem;
				text-align:left;
        	}
        	h6{
        		font-size: 0.28rem;
                font-weight: normal;
                text-align: right;
                line-height: 0.5rem;
        	}
        }
    }
</style>