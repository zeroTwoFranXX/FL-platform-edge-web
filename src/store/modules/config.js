
// import {
//     getComponentTypeByNodeId,
//     getVueNameByNodeId
// } from '@/views/model-console/bussiness/nodesData'

const config = {
    namespaced: true,
    state: {
        currentNode: ''
    },
    mutations: {
        setCurrentNodeId (state, nodeId) {
            state.currentNode = nodeId
        }
    },
    getters: {
        currentNodeId: state => {
            return state.currentNode
        },
        currentComponentType: state => {
            return getComponentTypeByNodeId(state.currentNode)
        },
        currentVueName: state => {
            return getVueNameByNodeId(state.currentNode)
        }
    }
}

export default config
