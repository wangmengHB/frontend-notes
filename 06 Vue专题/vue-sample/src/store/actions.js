import * as types from './mutation-types'

export const enableEcard = ({commit}, payload) => {
    commit(types.ENABLE_ECARD, payload)
}

export const disableEcard = ({commit}, payload) => {
    commit(types.DISABLE_ECARD, payload)
}