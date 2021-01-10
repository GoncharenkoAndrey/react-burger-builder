import axios from "../../axios-burger";
import {put} from "redux-saga/effects";
import * as actions from "../actions";
export function* initIngredientsSaga(action) {
	try{
		const ingredientsResponse = yield axios.get("/ingredients")
		const ingredients = {};
		const ingredientPrices = {};
		for(let i = 0; i < ingredientsResponse.data.length; i++){
			ingredients[ingredientsResponse.data[i].name] = 0;
			ingredientPrices[ingredientsResponse.data[i].name] = ingredientsResponse.data[i].price;
		}
		yield put(actions.setIngredients(ingredients));
		yield put(actions.setIngredientPrices(ingredientPrices));
	}
	catch(error){
		yield put(actions.fetchIngredientsFailed());
	};
}