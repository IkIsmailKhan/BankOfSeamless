import createDataContext from './createDataContext';
import transferFundApi from '../api/transferFund';
import axios from 'axios';

const transferReducer = (state, action) => {
    switch (action.type) {

        case 'get_balance':
            return { ...state, balance: action.payload, error: '' }

        case 'get_currencies':
            return { ...state, currencies: action.payload, error: '' }

        case 'ibanVerify':
            return { ...state, balance: action.payload, error: '' }

        case 'get_bankDetails':
            return { ...state, bankLogo: action.payload.logo, bankName: action.payload.name, error: '' }

        case 'add_error':
            return { ...state, error: action.payload }

        default:
            return state;
    }
};

const getCurrencies = (dispatch) => {
    return async () => {
        try {
            const response = await axios.get('https://gist.githubusercontent.com/madnik/49937c83061d1bc0d064/raw/f14d9aa9392b332c9756e06b8d289b9379525e29/currencies.json')
            dispatch({ type: 'get_currencies', payload: response.data })
        }
        catch (err) {
            dispatch({
                type: 'add_error', payload: 'Loading Currencies'
            })
        }
    }
}

const getBalance = (dispatch) => {
    return async () => {
        try {
            const response = await transferFundApi.get('/api/v1/balance');
            dispatch({ type: 'get_balance', payload: response.data })
        }
        catch (err) {
            dispatch({
                type: 'add_error', payload: 'Loading Balance'
            })
        }
    }
}

const getBankDetails = (dispatch) => {
    return async ({ iban }) => {
        try {
            const response = await transferFundApi.get(`/api/v1/bank/${iban}`);
            console.log(response.data)
            dispatch({ type: 'get_bankDetails', payload: { logo: response.data.data.logo, name: response.data.data.bank } })

        }
        catch (err) {
            console.log(err)
            dispatch({ type: 'add_error', payload: 'err.response.data.error.message ' })
        }
    }
}

const ibanVerify = (dispatch) => {
    return async ({ iban, amount, currency }) => {
        try {
            const response = await transferFundApi.post(`/api/v1/transfer/${iban}`, { amount, currency });
            dispatch({ type: 'ibanVerify', payload: response.data.balance })
        }
        catch (err) {
            dispatch({ type: 'add_error', payload: err.response.data.error.message })
        }
    }
}

export const { Provider, Context } = createDataContext(
    transferReducer,
    { getBalance, ibanVerify, getBankDetails, getCurrencies },
    { balance: null, bankLogo: null, bankName: null, currencies: null, error: '' }
)