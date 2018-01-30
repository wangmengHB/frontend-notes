<template>
  <div class="tmpl-container">
      <div class="container">
          <div class="item" v-for="tpl in tpls" :key="tpl.id">
            <img src="./file.png" alt=""/>
            <div class="title">
                {{tpl.templateName}}
            </div>
          </div>
      </div>
      
      <el-upload
        class="upload"
        ref="upload"
        action="https://jsonplaceholder.typicode.com/posts/"
        :on-preview="handlePreview"
        :on-remove="handleRemove"
        :file-list="fileList"
        :auto-upload="false">
        <el-button slot="trigger" size="small" type="primary">选取文件</el-button>
        <el-button style="margin-left: 10px;" size="small" type="success" @click="submitUpload">上传到服务器</el-button>
      </el-upload>
  </div>
</template>


<script>
export default {
    data () {
        return {
            tpls: [
                {
                    "id": 1,
                    "templateType": "admin_common",
                    "templateName": "个性化定制.xlsx",
                    "templateUrl": "aispeech-aichat.oss-cn-hangzhou.aliyuncs.com/enterprise-card/common-resource/个性化定制.xlsx",
                    "createBy": null
                }, {
                    "id": 2,
                    "templateType": "admin_common",
                    "templateName": "个性化定制.xlsx",
                    "templateUrl": "aispeech-aichat.oss-cn-hangzhou.aliyuncs.com/enterprise-card/common-resource/个性化定制.xlsx",
                    "createBy": null
                }, {
                    "id": 3,
                    "templateType": "admin_common",
                    "templateName": "个性化定制.xlsx",
                    "templateUrl": "aispeech-aichat.oss-cn-hangzhou.aliyuncs.com/enterprise-card/common-resource/个性化定制.xlsx",
                    "createBy": null
                }, {
                    "id": 4,
                    "templateType": "admin_common",
                    "templateName": "个性化定制.xlsx",
                    "templateUrl": "aispeech-aichat.oss-cn-hangzhou.aliyuncs.com/enterprise-card/common-resource/个性化定制.xlsx",
                    "createBy": null
                }, {
                    "id": 5,
                    "templateType": "admin_common",
                    "templateName": "个性化定制.xlsx",
                    "templateUrl": "aispeech-aichat.oss-cn-hangzhou.aliyuncs.com/enterprise-card/common-resource/个性化定制.xlsx",
                    "createBy": null
                }, {
                    "id": 6,
                    "templateType": "admin_common",
                    "templateName": "个性化定制.xlsx",
                    "templateUrl": "aispeech-aichat.oss-cn-hangzhou.aliyuncs.com/enterprise-card/common-resource/个性化定制.xlsx",
                    "createBy": null
                }, {
                    "id": 7,
                    "templateType": "admin_common",
                    "templateName": "个性化定制.xlsx",
                    "templateUrl": "aispeech-aichat.oss-cn-hangzhou.aliyuncs.com/enterprise-card/common-resource/个性化定制.xlsx",
                    "createBy": null
                }, {
                    "id": 8,
                    "templateType": "admin_common",
                    "templateName": "个性化定制.xlsx",
                    "templateUrl": "aispeech-aichat.oss-cn-hangzhou.aliyuncs.com/enterprise-card/common-resource/个性化定制.xlsx",
                    "createBy": null
                }, {
                    "id": 9,
                    "templateType": "admin_common",
                    "templateName": "个性化定制.xlsx",
                    "templateUrl": "aispeech-aichat.oss-cn-hangzhou.aliyuncs.com/enterprise-card/common-resource/个性化定制.xlsx",
                    "createBy": null
                }, {
                    "id": 10,
                    "templateType": "admin_common",
                    "templateName": "个性化定制.xlsx",
                    "templateUrl": "aispeech-aichat.oss-cn-hangzhou.aliyuncs.com/enterprise-card/common-resource/个性化定制.xlsx",
                    "createBy": null
                }, {
                    "id": 11,
                    "templateType": "admin_common",
                    "templateName": "个性化定制.xlsx",
                    "templateUrl": "aispeech-aichat.oss-cn-hangzhou.aliyuncs.com/enterprise-card/common-resource/个性化定制.xlsx",
                    "createBy": null
                }, {
                    "id": 12,
                    "templateType": "admin_common",
                    "templateName": "个性化定制.xlsx",
                    "templateUrl": "aispeech-aichat.oss-cn-hangzhou.aliyuncs.com/enterprise-card/common-resource/个性化定制.xlsx",
                    "createBy": null
                }, {
                    "id": 13,
                    "templateType": "admin_common",
                    "templateName": "个性化定制.xlsx",
                    "templateUrl": "aispeech-aichat.oss-cn-hangzhou.aliyuncs.com/enterprise-card/common-resource/个性化定制.xlsx",
                    "createBy": null
                }, {
                    "id": 14,
                    "templateType": "admin_common",
                    "templateName": "个性化定制.xlsx",
                    "templateUrl": "aispeech-aichat.oss-cn-hangzhou.aliyuncs.com/enterprise-card/common-resource/个性化定制.xlsx",
                    "createBy": null
                }, {
                    "id": 15,
                    "templateType": "admin_common",
                    "templateName": "个性化定制.xlsx",
                    "templateUrl": "aispeech-aichat.oss-cn-hangzhou.aliyuncs.com/enterprise-card/common-resource/个性化定制.xlsx",
                    "createBy": null
                }, {
                    "id": 16,
                    "templateType": "admin_common",
                    "templateName": "个性化定制.xlsx",
                    "templateUrl": "aispeech-aichat.oss-cn-hangzhou.aliyuncs.com/enterprise-card/common-resource/个性化定制.xlsx",
                    "createBy": null
                }, {
                    "id": 17,
                    "templateType": "admin_common",
                    "templateName": "个性化定制.xlsx",
                    "templateUrl": "aispeech-aichat.oss-cn-hangzhou.aliyuncs.com/enterprise-card/common-resource/个性化定制.xlsx",
                    "createBy": null
                }, {
                    "id": 18,
                    "templateType": "admin_common",
                    "templateName": "个性化定制.xlsx",
                    "templateUrl": "aispeech-aichat.oss-cn-hangzhou.aliyuncs.com/enterprise-card/common-resource/个性化定制.xlsx",
                    "createBy": null
                }, {
                    "id": 19,
                    "templateType": "admin_common",
                    "templateName": "个性化定制.xlsx",
                    "templateUrl": "aispeech-aichat.oss-cn-hangzhou.aliyuncs.com/enterprise-card/common-resource/个性化定制.xlsx",
                    "createBy": null
                }, {
                    "id": 20,
                    "templateType": "admin_common",
                    "templateName": "个性化定制.xlsx",
                    "templateUrl": "aispeech-aichat.oss-cn-hangzhou.aliyuncs.com/enterprise-card/common-resource/个性化定制.xlsx",
                    "createBy": null
                }, {
                    "id": 21,
                    "templateType": "admin_common",
                    "templateName": "个性化定制.xlsx",
                    "templateUrl": "aispeech-aichat.oss-cn-hangzhou.aliyuncs.com/enterprise-card/common-resource/个性化定制.xlsx",
                    "createBy": null
                }, {
                    "id": 22,
                    "templateType": "admin_common",
                    "templateName": "个性化定制.xlsx",
                    "templateUrl": "aispeech-aichat.oss-cn-hangzhou.aliyuncs.com/enterprise-card/common-resource/个性化定制.xlsx",
                    "createBy": null
                }, {
                    "id": 23,
                    "templateType": "admin_common",
                    "templateName": "个性化定制.xlsx",
                    "templateUrl": "aispeech-aichat.oss-cn-hangzhou.aliyuncs.com/enterprise-card/common-resource/个性化定制.xlsx",
                    "createBy": null
                }, {
                    "id": 24,
                    "templateType": "admin_common",
                    "templateName": "个性化定制.xlsx",
                    "templateUrl": "aispeech-aichat.oss-cn-hangzhou.aliyuncs.com/enterprise-card/common-resource/个性化定制.xlsx",
                    "createBy": null
                }, {
                    "id": 25,
                    "templateType": "admin_common",
                    "templateName": "个性化定制.xlsx",
                    "templateUrl": "aispeech-aichat.oss-cn-hangzhou.aliyuncs.com/enterprise-card/common-resource/个性化定制.xlsx",
                    "createBy": null
                }, {
                    "id": 26,
                    "templateType": "admin_common",
                    "templateName": "个性化定制.xlsx",
                    "templateUrl": "aispeech-aichat.oss-cn-hangzhou.aliyuncs.com/enterprise-card/common-resource/个性化定制.xlsx",
                    "createBy": null
                }, {
                    "id": 27,
                    "templateType": "admin_common",
                    "templateName": "个性化定制.xlsx",
                    "templateUrl": "aispeech-aichat.oss-cn-hangzhou.aliyuncs.com/enterprise-card/common-resource/个性化定制.xlsx",
                    "createBy": null
                }, {
                    "id": 28,
                    "templateType": "admin_common",
                    "templateName": "个性化定制.xlsx",
                    "templateUrl": "aispeech-aichat.oss-cn-hangzhou.aliyuncs.com/enterprise-card/common-resource/个性化定制.xlsx",
                    "createBy": null
                }, {
                    "id": 29,
                    "templateType": "admin_common",
                    "templateName": "个性化定制.xlsx",
                    "templateUrl": "aispeech-aichat.oss-cn-hangzhou.aliyuncs.com/enterprise-card/common-resource/个性化定制.xlsx",
                    "createBy": null
                }, {
                    "id": 30,
                    "templateType": "admin_common",
                    "templateName": "个性化定制.xlsx",
                    "templateUrl": "aispeech-aichat.oss-cn-hangzhou.aliyuncs.com/enterprise-card/common-resource/个性化定制.xlsx",
                    "createBy": null
                }, {
                    "id": 31,
                    "templateType": "admin_common",
                    "templateName": "个性化定制.xlsx",
                    "templateUrl": "aispeech-aichat.oss-cn-hangzhou.aliyuncs.com/enterprise-card/common-resource/个性化定制.xlsx",
                    "createBy": null
                }, {
                    "id": 32,
                    "templateType": "admin_common",
                    "templateName": "个性化定制.xlsx",
                    "templateUrl": "aispeech-aichat.oss-cn-hangzhou.aliyuncs.com/enterprise-card/common-resource/个性化定制.xlsx",
                    "createBy": null
                }, {
                    "id": 33,
                    "templateType": "admin_common",
                    "templateName": "个性化定制.xlsx",
                    "templateUrl": "aispeech-aichat.oss-cn-hangzhou.aliyuncs.com/enterprise-card/common-resource/个性化定制.xlsx",
                    "createBy": null
                }, {
                    "id": 34,
                    "templateType": "admin_common",
                    "templateName": "个性化定制.xlsx",
                    "templateUrl": "aispeech-aichat.oss-cn-hangzhou.aliyuncs.com/enterprise-card/common-resource/个性化定制.xlsx",
                    "createBy": null
                }, {
                    "id": 35,
                    "templateType": "admin_common",
                    "templateName": "个性化定制.xlsx",
                    "templateUrl": "aispeech-aichat.oss-cn-hangzhou.aliyuncs.com/enterprise-card/common-resource/个性化定制.xlsx",
                    "createBy": null
                }, {
                    "id": 36,
                    "templateType": "admin_common",
                    "templateName": "个性化定制.xlsx",
                    "templateUrl": "aispeech-aichat.oss-cn-hangzhou.aliyuncs.com/enterprise-card/common-resource/个性化定制.xlsx",
                    "createBy": null
                }, {
                    "id": 37,
                    "templateType": "admin_common",
                    "templateName": "个性化定制.xlsx",
                    "templateUrl": "aispeech-aichat.oss-cn-hangzhou.aliyuncs.com/enterprise-card/common-resource/个性化定制.xlsx",
                    "createBy": null
                }, {
                    "id": 38,
                    "templateType": "admin_common",
                    "templateName": "个性化定制.xlsx",
                    "templateUrl": "aispeech-aichat.oss-cn-hangzhou.aliyuncs.com/enterprise-card/common-resource/个性化定制.xlsx",
                    "createBy": null
                }, {
                    "id": 39,
                    "templateType": "admin_common",
                    "templateName": "个性化定制.xlsx",
                    "templateUrl": "aispeech-aichat.oss-cn-hangzhou.aliyuncs.com/enterprise-card/common-resource/个性化定制.xlsx",
                    "createBy": null
                }, {
                    "id": 40,
                    "templateType": "admin_common",
                    "templateName": "个性化定制.xlsx",
                    "templateUrl": "aispeech-aichat.oss-cn-hangzhou.aliyuncs.com/enterprise-card/common-resource/个性化定制.xlsx",
                    "createBy": null
                }, 
            ]
        }
    }
}
</script>

<style scoped lang="scss">
.tmpl-container {
    width: 100%;

    box-sizing: content-box;

    .container {
        width: 100%;
        height: 340px;
        overflow-y: auto;
        .item {
            display: inline-block;
            padding: 10px;
            width: 100px;
            height: 80px;
            margin: 10px;
            font-size: 10px;
            text-align: center;
            img {
                width: 41px;
                height: 49px;
                text-align: center;
                margin: 0 auto;
            }

            &:hover {
                cursor: pointer;
                background-color: #ccc;
            }
        }
    }
    
    .upload {
        margin-top: 20px;
        width: 300px;
        // height: 100px;
    }
}
</style>
