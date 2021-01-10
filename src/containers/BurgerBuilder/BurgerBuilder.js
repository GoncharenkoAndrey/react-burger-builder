import React,{Component} from 'react';
import {connect} from "react-redux";
import Aux from '../../hoc/Aux/Aux';
import Burger from '../../components/Burger/Burger';
import BuildControls from '../../components/Burger/BuildControls/BuildControls';
import Modal from "../../components/UI/Modal/Modal";
import OrderSummary from "../../components/Burger/OrderSummary/OrderSummary";
import Spinner from "../../components/UI/Spinner/Spinner";
import withErrorHandler from "../../hoc/withErrorHandler/withErrorHandler";
import * as actions from "../../store/actions/index";
import axios from "../../axios-burger";
export class BurgerBuilder extends Component {
	state = {
		purchaseable:false,
		purchasing: false,
	};
	componentDidMount() {
		this.props.onInitIngredients();
	}
	updatePurchaseState(ingredients) {
		const sum = Object.keys(ingredients)
					.map(igKey=>{
						return ingredients[igKey];
					})
					.reduce((sum,el)=>{
						return sum + el;
					},0);
		return sum > 0;
	}
	purchaseHandler = () => {
		if(this.props.isAuthenticated) {
			this.setState({purchasing: true});
		}
		else {
			this.props.onSetAuthRedirectPath("/checkout")
			this.props.history.push("/auth");
		}
	}
	purchaseCancelHandler = () => {
		this.setState({purchasing: false});
	}
	purchaseContinueHandler = () => {
		this.props.onInitPurchase();
		this.props.history.push("/checkout");
	}
	render(){
		if(this.props.ings) {
			const disabledInfo = {
				...this.props.ings
			};
			for(let key in disabledInfo){
				disabledInfo[key] = disabledInfo[key] <= 0;
			}
			let orderSummary = <OrderSummary
								ingredients={this.props.ings}
								price={this.props.price}
								purchaseCanceled={this.purchaseCancelHandler}
								purchaseCuntinued={this.purchaseContinueHandler}
							/>;
			return(
					<Aux>
						<Modal show={this.state.purchasing} modalClosed = {this.purchaseCancelHandler}>
							{orderSummary}
						</Modal>
						<Burger ingredients={this.props.ings} />
						<BuildControls
							ingredientAdded = {this.props.onIngredientAdded}
							ingredientRemoved = {this.props.onIngredientRemove}
							purchaseable={this.updatePurchaseState(this.props.ings)}
							disabled = {disabledInfo}
							ordered = {this.purchaseHandler}
							isAuth = {this.props.isAuthenticated}
							price={this.props.price}
						/>
					</Aux>
			);
		}
		else {
			return this.props.error ? <p>Ingredients can not be loaded!</p> : <Spinner />;
		}
	}
}
const mapStateToProps = state => {
	return {
		ings: state.burgerBuilder.ingredients,
		price: state.burgerBuilder.totalPrice,
		error: state.burgerBuilder.error,
		isAuthenticated: state.auth.token !== null
	};
};
const mapDispatchToProps = dispatch => {
	return {
		onIngredientAdded: (ingName) => dispatch(actions.addIngredient(ingName)),
		onIngredientRemove: (ingName) => dispatch(actions.removeIngredient(ingName)),
		onInitIngredients: () => dispatch(actions.initIngredients()),
		onInitPurchase: () => dispatch(actions.purchaseInit),
		onSetAuthRedirectPath: (path) => dispatch(actions.setAuthRedirectPath(path))
	};
};
export default connect(mapStateToProps, mapDispatchToProps)(withErrorHandler(BurgerBuilder, axios));