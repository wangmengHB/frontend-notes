<template lang="pug">
    div.tmpl-container
        div.container
            div.item(v-for="tpl in tpls" :key="tpl.id")
                img(src="./file.png" @click="download(tpl.templateUrl)")
                div.title {{tpl.templateName}}
                div.close(@click="deleteTemplate(tpl)")
                    i.el-icon-close
            
        div.upload
            el-button(size="small" type="primary" @click="chooseFile") 选取文件
            el-button(style="margin-left: 10px;" size="small" type="success" @click="submitUpload") 上传到服务器
            input(type="file" ref="input" @change="handleChange" accept=".xls,.xlsx")
            div.upload_list_wrapper.pt10
                ul.files_list
                    li(v-for='(item,index) in fileList' :key="item.name")
                        i.el-icon-document.icon
                        span {{item.name}}
                        i.el-icon-success.r.mr10
                        i.el-icon-close.r.mr10(@click='deleteItem(index)')

</template>


<script>
import {
    getTplByType, 
    uploadTemplate, 
    deleteTemplate, 
} from '../../../api'
import {indicator} from '../../../util'
export default {
    props: {
        templateType: {
            type: String,
        },
        limit: {
            type: Number,
            default: function() {
                return 1;
            }
        }

    },
    data () {
        return {
            tpls: [],
            fileList: []
        }
    },
    mounted () {
        let me = this;
        getTplByType(me.templateType).then((res) => {
            me.$data.tpls = res.result;
        })
    },
    methods: {
        download(url) {
            let downUrl = `http://${url}`;
            location.href = downUrl;
        },

        deleteTemplate(tpl) {
            let me = this;
            let fileId = tpl.id;
            deleteTemplate(fileId).then(res => {
                getTplByType(me.templateType).then((res) => {
                    me.$data.tpls = res.result;
                })
            })
            
        },

        submitUpload() {
            let templateType = this.templateType;
            let me = this;
            if (this.$data.fileList.length == 0) {
                return;
            }
            indicator.showBusy()
            this.$data.fileList.forEach(item => {
                let file = new FormData();
                file.append('fileName', item);
                uploadTemplate(templateType, file).then((res)=>{
                    me.$data.fileList = [];
                    getTplByType(me.templateType).then((res) => {
                        me.$data.tpls = res.result;
                    })
                })
            })          
        },

        chooseFile() {
            this.$refs.input.click();
        },

        handleChange(e) {
            // strict <input/> only has one file at one time.          
            let file = e.target.files[0];
            if (!file) {
                return;
            }
            if (!isExcel(file)) {
                this.$refs.input.value = '';
                return indicator.error('只支持Excel格式文件');
                
            }
            this.fileList.push(file);
            this.fileList.splice(0, this.fileList.length - this.limit)
            this.$refs.input.value = '';
            
        },

        deleteItem(index) {
            this.fileList.splice(index,1)
        }
    }
}

const isExcel = (file) => {
    if (/excel/.test(file.type)) {
        return true;
    }
    if (/openxmlformats\-officedocument\.spreadsheetml/.test(file.type)) {
        return true;
    }
    return false;
}


</script>

<style scoped lang="scss">
.tmpl-container {
    width: 100%;

    box-sizing: content-box;

    .container {
        width: calc(100% - 4px);
        margin: 2px;
        height: 340px;
        box-shadow: 0 1px 5px #ccc;
        overflow-y: auto;
        .item {
            display: inline-block;
            vertical-align: middle;
            padding: 10px;
            width: 100px;
            height: 80px;
            margin: 10px;
            font-size: 10px;
            text-align: center;
            position: relative;
            img {
                width: 41px;
                height: 49px;
                text-align: center;
                margin: 0 auto;
                &:hover {
                    cursor: pointer;
                }
            }

            &:hover {             
                background-color: #ccc;
                .close {
                    display: block;
                }            
            }

            .close {
                width: 30px;
                height: 30px;
                top: 0;
                right: 0;
                position: absolute;
                display: none;
                i {
                    width: 20px;
                    line-height: 20px;
                    text-align: center;
                }
                &:hover {
                    cursor: pointer;
                }
            } 


        }
    }
    
    .upload {
        margin-top: 20px;
        width: 300px;
        input{
            display:none;
        }
    }
}
</style>
