
import {setEnv} from './base'


setEnv(1024)


import('./page').then(({doSth}) => {
    doSth()
})
