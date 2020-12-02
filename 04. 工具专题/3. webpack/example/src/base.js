


let __env = 0

export function setEnv (val) {
    __env = val
}

export function getEnv () {
    return __env
}

export default {
    setEnv,
    getEnv
}