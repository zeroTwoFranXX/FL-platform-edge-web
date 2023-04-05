const edge = {
  namespaced: true,
  state: {
    info: null
  },
  mutations: {
    setInfo(state, details) {
      state.info = details
    }
  },
  getters: {
    info: state => {
      return state.info
    }
  }
}

export default edge