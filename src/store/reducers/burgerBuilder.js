import * as actionTypes from "../actions/actionTypes";
import {updateObject} from "../utility";
const initialState = {
	ingredients: null,
	ingredientPrices: null,
	totalPrice: 4,
	error: false,
	building: false
}
const reducer = (state = initialState, action) => {
	switch (action.type){
		case actionTypes.ADD_INGREDIENT:
			const updatedIngredientAdd = {[action.ingredientName]: state.ingredients[action.ingredientName] + 1};
			const updatedIngredientsAdd = updateObject(state.ingredients, updatedIngredientAdd);
			const updatedStateAdd = {
				ingredients: updatedIngredientsAdd,
				totalPrice: state.totalPrice + state.ingredientPrices[action.ingredientName],
				building: true
			};
			return updateObject(state, updatedStateAdd);
		case actionTypes.REMOVE_INGREDIENT:
			const updatedIngredientRemove = {[action.ingredientName]: state.ingredients[action.ingredientName] - 1};
			const updatedIngredientsRemove = updateObject(state.ingredients, updatedIngredientRemove);
			const updatedStateRemove = {
				ingredients: updatedIngredientsRemove,
				totalPrice: state.totalPrice + state.ingredientPrices[action.ingredientName],
				building: true
			};
			return updateObject(state, updatedStateRemove);
		case actionTypes.SET_INGREDIENTS:
			return updateObject(state, {
								...state,
								ingredients: action.ingredients,
								totalPrice: 4,
								error: false,
								building: false
							}
			);
		case actionTypes.SET_INGREDIENT_PRICES:
			return updateObject(state, {ingredientPrices: action.ingredientPrices});
		case actionTypes.FETCH_INGREDIENTS_FAILED:
			return updateObject(state, {error: true});
		default:
			return state;
	}
}
export default reducer;