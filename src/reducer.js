var intialState = {
    list_of_item_type: [],
    count_of_item_type:[],
    list_of_state:[],
    count_of_state:[],
}
const counterReducer = (state = intialState, action) => {
    switch (action.type) {
        case 'FETCHLISTORDERS':
            if ('OrderStatesObject' in action.payload && 'itemTypesObject' in action.payload){
                return {
                    ...state,
                    list_of_item_type: Object.keys(action.payload['itemTypesObject']),
                    count_of_item_type: Object.values(action.payload['itemTypesObject']),
                    list_of_state: Object.keys(action.payload['OrderStatesObject']),
                    count_of_state: Object.values(action.payload['OrderStatesObject']),
                }
            }
            return state
        default:
            return state;
    }
};

export default counterReducer;