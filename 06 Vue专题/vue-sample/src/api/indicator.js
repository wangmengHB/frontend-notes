import Vue from 'vue'


let vm = new Vue();
class Indicator {
    constructor() {
        this.loadingService = null;
		this.loadingCount = 0;
    }

    showBusy() {
        this.loadingCount++;
        this.loadingService = vm.$loading.service({
            // lock: true,
            // target: '#app .detail',
            text: '拼命加载中...',
            spinner: 'el-icon-loading',
            background: 'rgba(0, 0, 0, 0.5)'
        });
    }

    hideBusy() {
        this.loadingService && 
        this.loadingService.close && 
        this.loadingService.close()
    }

    checkStatus() {
		this.loadingCount--;
		!this.loadingCount && this.hideBusy()
	}
 
    message(option) {
        vm.$message(option)
    }

    error(msg) {
        vm.$message.error(msg)
    }

}

export default new Indicator()