// 一个简单的异步循环队列的实现


let jobA = () => new Promise((resolve, reject) => {
    setTimeout(() => {
        console.log('done job A.')
        resolve('A')
    }, 3000)
})


let jobB = () => new Promise((resolve, reject) => {
    setTimeout(() => {
        console.log('done job B.')
        resolve('B')
    }, 3000)
})

let jobC = () => new Promise((resolve, reject) => {
    setTimeout(() => {
        console.log('done job C.')
        resolve('C')
    }, 3000)
})

let jobD = () => new Promise((resolve, reject) => {
    setTimeout(() => {
        console.log('done job D.')
        resolve('D')
    }, 3000)
})

let jobE = () => new Promise((resolve, reject) => {
    setTimeout(() => {
        console.log('done job E.')
        resolve('A')
    }, 3000)
})


class CircleQueue {
    constructor () {
        this.current = null
        this._store = []
        this._index = 0
    }

    add(task) {
        let node = new Node(task)
        this._store.push(node)
        this.build()
    }

    build () {
        let len = this._store.length;
        if (len === 0) {
            return
        }
        if (len === 1) {
            this._store[0].next = this._store[0]
            this._store[0].prev = this._store[0]
            return
        }

        for (let i = 0; i < len - 1; i++) {
            this._store[i].next = this._store[i + 1]
            this._store[i + 1].prev = this._store[i]
        }
        this._store[len-1].next = this._store[0]
        this._store[0].prev = this._store[len -1]
    }

    getCurrent () {
        if (this._store.length === 0) {
            return null
        }
        let current = this._store[this._index]
        let next = this._index + 1
        if (next >= this._store.length) {
            next = 0
        }
        this._index = next
        return current
    }
}

class Node {
    constructor (task) {
        this.next = null
        this.prev = null
        this.task = task
        if (typeof task !== 'function') {
            throw new Error('task must be a function')
        }
    }
}


let queue = new CircleQueue()
queue.add(jobA)
queue.add(jobB)
queue.add(jobC)
queue.add(jobD)
queue.add(jobE)



function runTask (node) {
    if (!(node instanceof Node)) {
        return
    }
    node.task().then(() => {
        let next = node.next
        runTask(next)
    })
}


let current = queue.getCurrent()

runTask(current)
