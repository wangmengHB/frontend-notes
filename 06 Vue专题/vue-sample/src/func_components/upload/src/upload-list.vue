<template>
	<div class='upload_list_wrapper pt10'>
		<ul v-if="type == 'file'" class='files_list'>
			<li v-for='(item,index) in fileList'>
				<i class='el-icon-document icon'></i>
				<span>{{item.name}}</span>
				<i class='el-icon-success r mr10'></i>
				<i class='el-icon-close r mr10' @click='deleteItem(index)'></i>				
			</li>
		</ul>
	</div>
</template>
<script>
	export default{
		props:{
			fileList:Array,
			type:String,
		},
		data(){
			return {

			}
		},
		methods:{
			deleteItem(index){
				this.$emit('delete',index)
			}
		}
	}
</script>
<style lang="scss" scoped>
	.upload_list_wrapper{
		.files_list{
			li{
				background:#fff;
				margin-bottom:3px;
				text-align:left;
				font-size:14px;
				line-height:1.5;
				&:hover{
					// background:#efefef;
					box-shadow: 0px 1px 5px rgba(0, 0, 0, 0.2);
					.el-icon-success{
						display:none;
					}
					.el-icon-close{
						display:inline-block;
						cursor:pointer;
						&:hover{
							color:#f00;
						}
					}
				}
				.icon{
					font-size:14px;
					margin:0 7px;
				}
				.el-icon-success{
					color:#67c23a;
					line-height:1.5;
				}
				.el-icon-close{
					color:#606266;
					display: none;
					line-height:1.5;
				}
			}
		}
	}
</style>