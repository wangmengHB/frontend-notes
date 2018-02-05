<template>
    <el-table class="product-list"
      :data="productList"
      ref='table'
      height="100%"
      style="width: 100%">
      <el-table-column
        prop="productName"
        label="名片名称"
        header-align="center"
        width="180">
      </el-table-column>
      <el-table-column
        prop="productId"
        label="名片ID"
        header-align="center"
        width="180">
      </el-table-column>
      <el-table-column
        prop="company"
        header-align="center"
        label="公司认证">
      </el-table-column>
      <el-table-column
        prop="adminName"
        label="管理员"
        header-align="center"
        width="180">
        <template slot-scope="scope">
            <div v-for="person in scope.row.adminName" :key="person">
                {{person}}
            </div>
        </template>
      </el-table-column>
      <el-table-column
        prop="appName"
        label="授权公众号"
        header-align="center"
        width="180">
        <template slot-scope="scope">
            <div v-for="app in scope.row.appName" :key="app">
                {{app}}
            </div>
        </template>
      </el-table-column>
      <el-table-column
        prop="status"
        label="使能"
        header-align="center"
        width="100">       
        <template slot-scope="scope">
            <el-switch
            @change="switchProduct(scope.row)"
            active-color="#13ce66" 
            inactive-color="#C0CCDA" 
            v-model="scope.row.status">
            </el-switch>
        </template>   
      </el-table-column>
      <template slot='append' v-if='pageNum >= 1'>
	      	<p class='tc lh60 light_blue' v-if='hasMore'>
	      		<z-ballSpinFadeLoader></z-ballSpinFadeLoader>
	      		加载中...
	      	</p>
	      	<p class='tc lh34 light_blue' v-else>没有更多数据了</p>
	    </template>
    </el-table>
</template>


<script>
    import {getProductList, switchProduct} from '../../api'
    import {indicator} from '../../util'

    export default {
        data () {
            return {
                tableData: [],
                pageNum: 0,
                hasMore: true,
            }
        },
        computed: {
            productList() {
                return this.tableData.map(item => {
                    return {
                        ...item,
                        status: item.enabled == 0? true: false
                    }
                }) 
            }
        },
        mounted() {
            let {tableData, pageNum} = this.$data;
            let me = this;
            if (pageNum == 0) {
                indicator.showBusy();
                getProductList().then(function(data) {
                    me.$data.tableData = data.result;
                    me.$data.pageNum++;
                });
            }
            let table = this.$refs.table.$el.querySelector('.el-table__body-wrapper');

			table.addEventListener('scroll',() => {
                if (window.requestAnimationFrame) {
                    requestAnimationFrame(() => {
                        this.scroll(table);
                    })
                } else {
                    setTimeout(() => {
                        this.scroll(table);
                    }, 50)
                }
			})

        },
        methods: {
            scroll(table) {
                let {scrollTop, scrollHeight, offsetHeight} = table;
                if (Math.abs(scrollTop + offsetHeight - scrollHeight) < 5) {
                    console.log('bottom');
                    this.loadMore();
                }
            },
            
            loadMore() {
                let {pageNum, tableData, hasMore} = this.$data;
                let me = this;
				this.$nextTick(()=>{
                    if (!hasMore) {
                        return;
                    }
					getProductList(pageNum).then((data) => {
                        if (data.result && data.result.length > 0) {
                            me.$data.tableData = tableData.concat(data.result);
                            me.$data.pageNum++;
                            return;
                        }
                        me.$data.hasMore = false;
                    });
				})				
            },
            
            switchProduct(product) {              
                let on = product.status;
                let id = product.productId;
                product.status = !on;
                switchProduct(on, id).then((res) => {
                    product.status = on;
                });
            }
        }

    }

</script>

<style scoped lang="scss">
.product-list {
    width: 100%;
    height: 100%;
    overflow-x: hidden;
    overflow-y: auto;
    text-align: center;
    box-shadow: 0 1px 5px #ccc;
}

</style>
