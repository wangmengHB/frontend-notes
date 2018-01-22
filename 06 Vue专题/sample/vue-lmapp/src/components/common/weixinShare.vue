 <template>
    <div class="mask_out" style="display: block" @click="closeShare()" @touchmove.prevent>
        <img src="../../images/weixintip.png" class="weixintip">
    </div>
</template>

<script>
    export default {
    	data(){
            return{
                positionY: 0,
                timer: null,
            }
        },
        mounted(){

        },
        methods:{
            closeShare(){
                this.$emit('closeShare')
            }
        }
    }
</script>

<style lang="scss" scoped>
    .mask_out{
        position: fixed;
        top: 0;
        bottom: 0;
        left: 0;
        right: 0;
        z-index: 100;
        background: rgba(0,0,0,0.65);
        cursor: pointer;
        max-width: 640px;
        margin:0 auto;
    }
    .weixintip{
        display: block;
        width: 85%;
        position: absolute;
        left: 50%;
        top:0%;
        margin-left:-35%;
    }
</style>
