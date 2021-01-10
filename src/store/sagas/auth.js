import {put, delay, call} from "redux-saga/effects";
import axios from "../../axios-burger";
import * as actions from "../actions/index";
export function* logoutSaga(action) {
	yield call([localStorage, "removeItem"], "token");
	yield call([localStorage, "removeItem"], "expirationDate");
	yield call([localStorage, "removeItem"], "userId");
	yield put(actions.logoutSucceed());
}
export function* checkAuthTimeoutSaga(action) {
	 yield delay(action.expirationTime * 1000);
	 yield put(actions.logout());
}
export function* authUserSaga(action) {
	put(actions.authStart());
	const authData = {
		email: action.email,
		password: action.password,
		isSignup: action.isSignup
	};
	try {
		const response = yield axios.post("/auth", authData);
		const expirationDate = yield new Date(new Date().getTime() + response.data.expiresIn * 1000); 
		yield localStorage.setItem("token", response.data.token);
		yield localStorage.setItem("expirationDate", expirationDate);
		yield localStorage.setItem("userId", response.data.userId);
		yield put(actions.authSuccess(response.data.token, response.data.userId));
		yield put(actions.checkAuthTimeout(response.data.expiresIn));
	}
	catch(error) {
		yield put(actions.authFail({message:error.response.data.Error}));
	}
}
export function* authCheckStateSaga(action) {
	const token = yield localStorage.getItem("token");
	if(!token) {
		yield put(actions.logout());
	}
	else {
		const expirationDate = yield new Date(localStorage.getItem("expirationDate"));
		if(expirationDate < new Date()) {
			yield put(actions.logout());
		}
		else {
			const userId = yield localStorage.getItem("userId");
			yield put(actions.authSuccess(token, userId));
			yield put(actions.checkAuthTimeout(expirationDate.getSeconds()));
		}
	}
}