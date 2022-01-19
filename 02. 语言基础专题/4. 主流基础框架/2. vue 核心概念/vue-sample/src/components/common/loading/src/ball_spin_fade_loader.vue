<template>
	 <div class="loader" :style="containerStyle">
        <div class="ball-spin-fade-loader" :style="{marginLeft:size+'px'}">
          	<div :style="pos1"></div>
          	<div :style="pos2"></div>
          	<div :style="pos3"></div>
          	<div :style="pos4"></div>
          	<div :style="pos5"></div>
          	<div :style="pos6"></div>
          	<div :style="pos7"></div>
          	<div :style="pos8"></div>
        </div>
      </div>
</template>
<script>
	export default{
		name:'ball-spin-fade-loader',
		props:{
			size:{type:Number,default:15},
			color:{type:String,default:'#2196f3'}
		},
		data(){
			return {

			}
		},
		computed:{
			commonsSize(){
				return {
					backgroundColor:this.color,
					width:.6*this.size+'px',
					height:.6*this.size+'px'
				}
			},
			containerStyle(){
				return {
					marginBottom:this.size+'px',
					marginRight:this.size*2+'px',
				}
			},
			pos1(){
				return {
					top:this.size+'px',
					left:'0px',
					...this.commonsSize
				}
			},
			pos2(){
				return {
					top:.681818 * this.size+'px',
					left:.681818 * this.size+'px',
					...this.commonsSize
				}
			},
			pos3(){
				return {
					top:'0px',
					left:this.size+'px',
					...this.commonsSize
				}
			},
			pos4(){
				return {
					top:-.681818*this.size+'px',
					left:.681818*this.size+'px',
					...this.commonsSize
				}
			},
			pos5(){
				return {
					top:-this.size+'px',
					left:'0px',
					...this.commonsSize
				}
			},
			pos6(){
				return {
					top:-.681818*this.size+'px',
					left:-.681818*this.size+'px',
					...this.commonsSize
				}
			},
			pos7(){
				return {
					top:'0px',
					left:-this.size+'px',
					...this.commonsSize
				}
			},
			pos8(){
				return {
					top:.681818*this.size+'px',
					left:-.681818*this.size+'px',
					...this.commonsSize
				}
			}
		}
	}
</script>
<style scoped lang='scss'>
	@-webkit-keyframes ball-spin-fade-loader {
	  50% {
	    opacity: 0.3;
	    -webkit-transform: scale(0.4);
	            transform: scale(0.4); }

	  100% {
	    opacity: 1;
	    -webkit-transform: scale(1);
	            transform: scale(1); } 
	}

	@keyframes ball-spin-fade-loader {
	  50% {
	    opacity: 0.3;
	    -webkit-transform: scale(0.4);
	            transform: scale(0.4); 
	    }

	  100% {
	    opacity: 1;
	    -webkit-transform: scale(1);
	     transform: scale(1);
	    } 
	 }
	.loader{display: inline-block;}
	.ball-spin-fade-loader {position: relative; }
  	.ball-spin-fade-loader > div:nth-child(1) {
	    -webkit-animation: ball-spin-fade-loader 1s 0s infinite linear;
	    animation: ball-spin-fade-loader 1s 0s infinite linear; 
   	}
  	.ball-spin-fade-loader > div:nth-child(2) {
	    -webkit-animation: ball-spin-fade-loader 1s 0.12s infinite linear;
	    animation: ball-spin-fade-loader 1s 0.12s infinite linear; 
	}
  	.ball-spin-fade-loader > div:nth-child(3) {
	    -webkit-animation: ball-spin-fade-loader 1s 0.24s infinite linear;
	    animation: ball-spin-fade-loader 1s 0.24s infinite linear; 
	}
  	.ball-spin-fade-loader > div:nth-child(4) {
	    -webkit-animation: ball-spin-fade-loader 1s 0.36s infinite linear;
	            animation: ball-spin-fade-loader 1s 0.36s infinite linear; 
    }
  	.ball-spin-fade-loader > div:nth-child(5) {
	    -webkit-animation: ball-spin-fade-loader 1s 0.48s infinite linear;
	            animation: ball-spin-fade-loader 1s 0.48s infinite linear; 
   }
  	.ball-spin-fade-loader > div:nth-child(6) {
	    -webkit-animation: ball-spin-fade-loader 1s 0.6s infinite linear;
	            animation: ball-spin-fade-loader 1s 0.6s infinite linear; 
    }
  	.ball-spin-fade-loader > div:nth-child(7) {
	    -webkit-animation: ball-spin-fade-loader 1s 0.72s infinite linear;
	            animation: ball-spin-fade-loader 1s 0.72s infinite linear; 
	}
  	.ball-spin-fade-loader > div:nth-child(8) {
	    -webkit-animation: ball-spin-fade-loader 1s 0.84s infinite linear;
	            animation: ball-spin-fade-loader 1s 0.84s infinite linear; 
    }
  	.ball-spin-fade-loader > div {
	    /*background-color: #000;*/
	   /* width: 15px;
	    height: 15px;*/
	    border-radius: 100%;
	    margin: 2px;
	    -webkit-animation-fill-mode: both;
	            animation-fill-mode: both;
	    position: absolute; 
	}
</style>