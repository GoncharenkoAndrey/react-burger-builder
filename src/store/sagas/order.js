import axios from "../../axios-burger";
import {put} from "redux-saga/effects";
import * as actions from "../actions";
export function* purchaseBurgerSaga(action) {
	yield put(actions.purchaseBurgerStart());
	try {
		const response = yield axios.post("/orders?auth=" + action.token, action.orderData);
		yield put(actions.purchaseBurgerSuccess(response, action.orderData));
	}
	catch(error) {
		yield put(actions.purchaseBurgerFail(error));
	}
}
export function* fetchOrdersSaga(action) {
	yield put(actions.fetchOrdersStart());
	try {
		const ordersResponse = yield axios.get("/orders?auth=" + action.token);
		const fetchedOrders = [];
		for(let key in ordersResponse.data) {
			fetchedOrders.push({
				...ordersResponse.data[key],
				id: key
			});
		}
		yield put(actions.fetchOrdersSuccess(fetchedOrders));
	}
	catch(error) {
		yield put(actions.fetchOrdersFail(error));
	}
}