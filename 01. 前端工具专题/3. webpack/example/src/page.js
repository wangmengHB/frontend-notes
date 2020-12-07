import {getEnv} from './base'


export function doSth () {
    let env = getEnv()
    console.log(`env: ${env}`)
}

export default {
    doSth
}