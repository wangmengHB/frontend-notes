<template>
  <el-tabs 
    v-model="activeName"
    type="border-card"
    class="tpl-mgmt"
    style="height:calc(100% - 2px)"
    @tab-click="handleClick">
    <el-tab-pane label="common" name="admin_common" height="100%" class="tab-content">
        <tmpl-container
          template-type="admin_common">
        </tmpl-container>
    </el-tab-pane>
    <el-tab-pane label="科技企业" name="admin_tech" class="tab-content">
        <tmpl-container
          template-type="admin_tech">

        </tmpl-container>
    </el-tab-pane>
    <el-tab-pane label="高校" name="admin_college" class="tab-content">
        <tmpl-container
          template-type="admin_college">
        </tmpl-container>
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

<style lang="scss">
.tpl-mgmt {
    .el-tabs__content {
        height: calc(100% - 68px);
    }
    .tab-content {
        overflow-y: auto;
        height: 100%;
    }
}


</style>

