import authReducer from './authReducer'
import employeeReducer from './employeeReducer'
import {combineReducers} from 'redux'

const rootReducer = combineReducers({
    auth: authReducer,
    employees: employeeReducer
})

export default rootReducer