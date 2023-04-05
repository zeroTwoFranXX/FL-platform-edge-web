// 模型管理管理，模型控制台
import { GetModelParamsEnumList } from '@/services/api/model-console'
import { parseModelEnumType } from '@/common/helpers/model'

const model = {
    namespaced: true,
    state: {
        currentModelId: '', // 当前的模型id
        paramsEnum: {} // 模型控制台枚举类
    },
    mutations: {
        setCurrentModelId (state, modelId) {
            state.currentModelId = modelId
        },
        setParamsEnum (state, paramsEnum) {
            paramsEnum = paramsEnum || {}
            state.paramsEnum = paramsEnum
        }
    },
    getters: {
        currentModelId: state => {
            return state.currentModelId
        },
        evalTypes: state => {
            return parseModelEnumType(state.paramsEnum.eval_type)
        },
        methods: state => {
            return parseModelEnumType(state.paramsEnum.method)
        },
        objectives: state => {
            return parseModelEnumType(state.paramsEnum.objective)
        },
        taskTypes: state => {
            return parseModelEnumType(state.paramsEnum.task_type)
        },
        workModes: state => {
            return parseModelEnumType(state.paramsEnum.work_mode)
        }
    },
    actions: {
        getModelParamsEnumList ({ dispatch, commit }) {
            GetModelParamsEnumList().then(response => {
                // console.log('getModelParamsEnum', response)
                if (response && response.data && typeof response.data.Params === 'object') {
                    commit('setParamsEnum', response.data.Params)
                }
            })
        }
    }
}

export default model
