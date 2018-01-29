<template>
  <el-tabs 
    v-model="activeName"
    type="border-card"
    style="height:100%" 
    @tab-click="handleClick">
    <el-tab-pane label="common" name="admin_common" style="height:100%">
        <tmpl-container></tmpl-container>
    </el-tab-pane>
    <el-tab-pane label="科技企业" name="admin_tech">
        <tmpl-container></tmpl-container>
    </el-tab-pane>
    <el-tab-pane label="高校" name="admin_college">
        <tmpl-container></tmpl-container>
    </el-tab-pane>

  </el-tabs>
</template>

<script>
    import TmplContainer from './TmplContainer.vue'
    export default {
        data() {
            return {
                activeName: 'admin_common',
                tabs: [
                    'admin_common',
                    'admin_tech',
                    'admin_college'
                ],
                templateTypes: [
                    
                    {
                    "id": 1,
                    "templateType": "admin_common",
                    "templateName": "个性化定制.xlsx",
                    "templateUrl": "aispeech-aichat.oss-cn-hangzhou.aliyuncs.com/enterprise-card/common-resource/个性化定制.xlsx",
                    "createBy": null
                    }
  
                ]
            };
            },
        methods: {
            handleClick(tab, event) {
                console.log(tab, event);
            }
        },
        components: {
            TmplContainer
        }
    }
</script>

<style>

</style>

