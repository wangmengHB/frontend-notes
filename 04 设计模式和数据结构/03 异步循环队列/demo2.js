// 一个简单的异步循环队列的实现
const OFF = '__OFF__'
const ON = '__ON__'
let status = ON

const createTask = (msg) => () => (
    new Promise((resolve, reject) => {
        runSubTask(msg, resolve, reject)
    })
)

const runSubTask = (msg, resolve, reject) => {
    setTimeout(() => {
        console.log(`doing job: ${msg}.`)
        if (status !== ON) {
            resolve(msg)
            return
        }

        let num = Math.floor(Math.random() * 10) % 2
        if (num == 1) {
            runSubTask(msg + '-sub', resolve, reject)
        } else {
            resolve(msg)
        }
    }, 1000)
}


let observableOnce = function (val) {
    let value = val;
    let fn = null;

    function ob(newVal) {
        if (newVal == null) {
            return value
        }
        if (newVal !== value) {
            // notify the changes
            if (typeof fn === 'function') {
                fn(newVal, value)
                fn = null
            }
            value = newVal
        }
        return value
    }
    ob.once = function (callback) {
        fn = callback
    }
    return ob
}




class AutoTaskMgr {
    constructor() {
        this._store = []
        this._index = 0
        this._isSubTaskRunning = observableOnce(false)
        

        function isShutDown(newVal, oldVal) {
            if (status === OFF && newVal === false) {
                console.log('this is forced shut down')
                setTimeout(() => {
                    status = ON
                    this.run()
                }, 10000);
            }
        }

        
    }

    add(task) {
        this._store.push(task)
    }

    run () {
        let len = this._store.length
        let curTask = this._store[this._index]
        if (status !== ON) {
            return
        }

        if (this._index >= len) {
            setTimeout(() => {
                this._index = 0
                this.run()
            }, 3000);
            return
        }

        curTask().then(() => {
            if (status !== ON) {
                this._isSubTaskRunning(false)
                this._index++
                return
            }
            this._isSubTaskRunning(false)
            this._index++
            
            this.run()
        })
        this._isSubTaskRunning(true)

    }

    stop () {
        status = OFF
    }

    start () {
        status = ON
        this.run()
    }

    stopThenRun () {
        status = OFF
        console.log('stop is called!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!')
        if (this._isSubTaskRunning === false) {
            this.start()
        } else {
            this._isSubTaskRunning.once(function (isSubTaskRunning) {
                if (status === OFF && isSubTaskRunning === false) {
                    this.start()
                }
            }.bind(this))
        }
        
    }
}






let mgr = new AutoTaskMgr()
let msgs = ['a', 'b', 'c', 'd', 'e', 'f']
msgs.forEach((msg) => {
    let job = createTask(msg)
    mgr.add(job)
})

mgr.run()

setInterval(() => {
      
    mgr.stopThenRun()
}, 10000);
