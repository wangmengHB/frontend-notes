<template>
    <div class="login-main">
        <header>
            <span class="title">绑定手机</span>
        </header>
		<section class="login-content">
			<div style="padding: 10px 10px;">
				<div class="tips">
					为了账号安全，请绑定您常用的手机号
				</div>
			</div>
			<div  class="input-group active">
				<div class="input-row">
					<label>手机号:</label>
					<input type="text" class="tel-num" value="" placeholder="" disabled="disabled"   maxlength="11" data-input-clear="2">
					<div class="bule-btn" id="bindTel">绑定其他手机号</div>
				</div>
				<div class="input-row">
					<label>验证码:</label>
					<input type="text" class="input-clear" placeholder="点击输入验证码" id="icode" maxlength="6">
					<div class="form-btn" id="userCode">获取验证码</div>
				</div>
				
				<ul class="redbtn" id="submit">
					<li class="cell">
						<span>立即绑定</span>
					</li>
				</ul>
			</div>

			<div id="item2" class="input-group control-content">
				<div class="input-row">
					<label>新手机号:</label>
					<input type="text" class="input-clear" placeholder="点击输入手机号" id="tel" maxlength="11">
				</div>
				<div class="input-row">
					<label>验证码:</label>
					<input type="text" class="input-clear" placeholder="点击输入验证码" id="code" maxlength="6">
					<div class="form-btn" id="tgCode">获取验证码</div>
				</div>
				
				<ul class="redbtn">
					<li style="text-align: center;color: #f23030;">
						<span>立即绑定</span>
					</li>
				</ul>
			</div>
		</section>
	</div>
</template>

<script>
import {getProxy, postProxy} from 'src/service/proxy'
import {setStore, isOk, isApp, isMobile, log, timeOut} from 'src/config/mUtils'

export default {
    data() {
        return {
            userInfo: '',
            isTrueName: false,
            telNum: '',
            userTypes: ['个人', '企业'],
            userType: 0,
            code: '',
            isCheck: true,
            isClick: false
        }
    },
    components: {

    },
    mounted(){

    },
    methods: {

    },
    computed: {

    },
    watch: {

    }
}
</script>

<style lang="scss" scoped>
    @import 'src/style/mixin';
    .login-main{
    	height: 100%;
        background-color: #f9f5f0;
    }
    header{
		position: fixed;
		z-index: 10;
		top: 0;
		right: 0;
		left: 0;
		height: 44px;
		padding-right: 10px;
		padding-left: 10px;
		border-bottom: 0;
		backface-visibility: hidden;
		background-color: #f9f5f0;
		box-shadow: 0 0 0;
        .title{
			font-weight: 500;
			line-height: 44px;
			position: absolute;
			display: block;
			width: 100%;
			margin: 0 -10px;
			padding: 0;
			text-align: center;
			white-space: nowrap;
			color: #000;
			right: 40px;
			left: 40px;
			display: inline-block;
			overflow: hidden;
			width: auto;
			margin: 0;
			text-overflow: ellipsis;
			font-size: 18px;
        }
    }
    .login-content{
        background-color: #f9f5f0!important;
        padding-top: 44px;
        .tips{
			width: 100%;
			text-align: center;
			color: #f23030;
			font-size: 12px;
			padding: 15px;
        }
        .input-group{
			padding: 0;
			border: 0;
			position: relative;
			display: none;
			background-color: #efeff4;
			.input-row{
				background: #fff;
				height: 40px;
				position: relative;
				clear: left;
				overflow: hidden;
				label{
					width: 20%;
					padding: 13px 5px 10px 15px;
					font-size: 14px;
					font-family: 'Helvetica Neue', Helvetica, sans-serif;
					line-height: 1.1;
					float: left;
				}
				input{
					font-size: 14px;
					width: 40%;
					height: 40px;
					float: left;
					padding: 15px 5px;
					background: none;
				}
				.tel-num{
					padding: 10px 5px;
				}
				.bule-btn{
					width:27%;
					text-align: right;
					color: #007aff;
					text-decoration: underline;
					font-family: 'Helvetica Neue',Helvetica,sans-serif;
					line-height: 1.1;
					padding: 5px 0;
					font-size: 10px;
					margin-top: 8px;
					margin-right: 15px;
					position: absolute;
					top: 0;
					right: 0;
				}
				.form-btn{
					width: 23%;
					float: right;
					font-family: 'Helvetica Neue',Helvetica,sans-serif;
					line-height: 1.9;
					padding: 5px 0 5px 5px;
					font-size: 10px;
					color: #f23030;
					text-align: center;
					border: 1px solid #f23030;
					margin-top: 2px;
					margin-right: 15px;
				}
			}
			.redbtn{
				margin-top: 6px;
				position: relative;
				margin-bottom: 0;
				padding-left: 0;
				list-style: none;
				background-color: #fff;
				.cell{
					text-align: center;
					position: relative;
					overflow: hidden;
					padding: 11px 15px;
					color: #f23030;
					span{
						color: #f23030;
						font-size: 15px;
						display: block;
					}
				}
			}
        }
        .active{
			display: block;
        }
    }
	.input-group:before {
	    position: absolute;
	    top: 0;
	    right: 0;
	    left: 0;
	    height: 1px;
	    content: '';
	    transform: scaleY(.5);
	    background-color: #c8c7cc;
	}
	.input-group:after, .input-row:after {
		position: absolute;
		right: 0;
		bottom: 0;
		left: 15px;
		height: 1px;
		content: '';
		transform: scaleY(.5);
		background-color: #c8c7cc;
	}
	.redbtn:before {
		position: absolute;
		top: -1px;
		right: 0;
		left: 0;
		height: 1px;
		content: '';
		-webkit-transform: scaleY(.5);
		transform: scaleY(.5);
		background-color: #c8c7cc;
	}
	.cell:last-child:before, .cell:last-child:after {
		height: 0;
	}
	.cell:after {
		position: absolute;
		right: 0;
		bottom: 0;
		left: 15px;
		height: 1px;
		content: '';
		-webkit-transform: scaleY(.5);
		transform: scaleY(.5);
		background-color: #c8c7cc;
	}
    .router-slid-enter-active, .router-slid-leave-active {
        transition: all .4s;
    }
    .router-slid-enter, .router-slid-leave-active {
        transform: translate3d(2rem, 0, 0);
        opacity: 0;
    }
</style>