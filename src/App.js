import React, { Component } from "react";
import { Animated, Dimensions, Easing, StyleSheet, View } from "react-native";
import Scorecard from "./Scorecard";
import ScienceCalculator from "./ScienceCalc";

const { height: SCREEN_HEIGHT } = Dimensions.get("window");

class App extends Component {
	constructor() {
		super();

		this.state = {
			// calculatorOffset: new Animated.Value(SCREEN_HEIGHT)
			calculatorOffset: new Animated.Value(0)
		};
	}

	showScienceCalculator = () => {
		const { calculatorOffset } = this.state;
		Animated.timing(calculatorOffset, {
			toValue: 0,
			duration: 421,
			easing: Easing.out(Easing.quad)
		}).start();
	};

	render() {
		const { calculatorOffset } = this.state;

		return (
			<View style={{ flex: 1 }}>
				<Scorecard showCalculator={this.showScienceCalculator} />

				<Animated.View
					style={{
						...StyleSheet.absoluteFillObject,
						top: calculatorOffset.interpolate({
							inputRange: [0, 1],
							outputRange: [0, 1]
						})
					}}
				>
					<ScienceCalculator />
				</Animated.View>
			</View>
		);
	}
}

export default App;
