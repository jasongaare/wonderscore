import React, { Component } from "react";
import PropTypes from "prop-types";
import {
	Dimensions,
	findNodeHandle,
	Keyboard,
	ScrollView,
	StyleSheet,
	Switch,
	Text,
	TextInput,
	View
} from "react-native";
import isEqual from "lodash.isequal";
import { columns, columnColors, summableColumns } from "./columns";

const { height: SCREEN_HEIGHT } = Dimensions.get("window");
const CONTAINER_PADDING = 16;
const ROW_HEIGHT = SCREEN_HEIGHT / 12;
const NUM_OF_PLAYERS = 7;

const baseInputStyle = {
	borderColor: "black",
	borderWidth: 1,
	color: "black",
	fontSize: 18,
	height: "100%",
	textAlign: "center"
};

const baseHeaderTextStyle = {
	color: "white",
	textAlign: "center",
	borderColor: "black",
	borderWidth: 1,
	flex: 1
};

class Scorecard extends Component {
	constructor(props) {
		super(props);

		this.scrollview = React.createRef();
		const didHideListener = Keyboard.addListener("keyboardDidHide", () => {
			this.scrollview.current.scrollTo({ y: 0, animated: true });
		});

		this.state = {
			didHideListener,
			inputValues: {},
			inputRefs: {},
			showTotals: true
		};
	}

	componentDidMount() {
		this.initializeRefs();
		this.clearValues();
	}

	componentDidUpdate(prevProps, prevState) {
		const { inputValues } = this.state;

		if (!isEqual(inputValues, prevState.inputValues)) {
			this.updateTotals();
		}
	}

	componentWillUnmount() {
		const { didHideListener } = this.state;
		Keyboard.removeSubscription(didHideListener);
	}

	scrollToFocusedInput = ref => {
		const node = findNodeHandle(ref);
		setTimeout(() => {
			if (
				this.scrollview &&
				this.scrollview.current &&
				this.scrollview.current.getScrollResponder
			) {
				const scrollResponder = this.scrollview.current.getScrollResponder();
				scrollResponder.scrollResponderScrollNativeHandleToKeyboard(
					node,
					70,
					true
				);
			}
		}, 100);
	};

	initializeRefs = () => {
		const refs = {};

		for (let i = 1; i <= NUM_OF_PLAYERS; i++) {
			columns.forEach(column => {
				const key = `p${i}-${column}`;

				refs[key] = React.createRef();
			});
		}

		this.setState({
			inputRefs: Object.assign({}, refs)
		});
	};

	clearValues = () => {
		const { inputValues } = this.state;
		const nexInputValues = {};

		for (let i = 1; i <= NUM_OF_PLAYERS; i++) {
			summableColumns.forEach(column => {
				const key = `p${i}-${column}`;
				nexInputValues[key] = "";
			});
		}

		this.setState({
			inputValues: Object.assign({}, inputValues, nexInputValues)
		});
	};

	updateTotals = () => {
		const { inputValues } = this.state;
		const totalPointsValues = {};

		for (let i = 1; i <= NUM_OF_PLAYERS; i++) {
			let points = 0;
			summableColumns.forEach(column => {
				let columnPoints = parseInt(inputValues[`p${i}-${column}`]);
				if (!isNaN(columnPoints)) {
					points += columnPoints;
				}
			});

			totalPointsValues[`p${i}-totalpoints`] = `${points}`;
		}

		this.setState({
			inputValues: Object.assign({}, inputValues, totalPointsValues)
		});
	};

	createRowForPlayer = num => {
		const rowInputs = [];
		const { inputValues, inputRefs } = this.state;

		columns.forEach((column, index) => {
			const key = `p${num}-${column}`;
			const isName = column === "name";
			const isTotal = column === "totalpoints";

			// handle special case for totalpoints column value
			let inputValue = inputValues[key];
			if (isTotal) {
				const totalIntValue = parseInt(inputValue);
				const { showTotals } = this.state;

				if (!showTotals || totalIntValue === 0) {
					inputValue = "";
				}
			}

			rowInputs.push(
				<TextInput
					key={key}
					ref={inputRefs[key]}
					editable={!isTotal}
					keyboardType={isName ? "default" : "numbers-and-punctuation"}
					keyboardShouldPersistTaps="always"
					autoCorrect={false}
					style={{
						...baseInputStyle,
						backgroundColor: columnColors[index],
						flex: isName ? 3 : 1
					}}
					value={inputValue}
					onChangeText={text => {
						const newValue = {};
						newValue[key] = text;
						this.setState({
							inputValues: Object.assign({}, inputValues, newValue)
						});
					}}
					onFocus={() => this.scrollToFocusedInput(inputRefs[key].current)}
					onSubmitEditing={() => {
						const nextIndex = index + 1;
						if (nextIndex < columns.length - 1) {
							inputRefs[`p${num}-${columns[nextIndex]}`].current.focus();
						}
					}}
				/>
			);
		});

		return rowInputs;
	};

	renderScorecardHeader = () => {
		return (
			<View
				style={{
					flexDirection: "row",
					height: ROW_HEIGHT,
					backgroundColor: "black",
					width: "100%",
					alignItems: "center"
				}}
			>
				<Text style={{ ...baseHeaderTextStyle, flex: 3 }}>Player Name</Text>
				<Text style={{ ...baseHeaderTextStyle }}>A</Text>
				<Text style={{ ...baseHeaderTextStyle }}>A</Text>
				<Text style={{ ...baseHeaderTextStyle }}>A</Text>
				<Text style={{ ...baseHeaderTextStyle }}>A</Text>
				<Text style={{ ...baseHeaderTextStyle }}>A</Text>
				<Text style={{ ...baseHeaderTextStyle }}>A</Text>
				<Text style={{ ...baseHeaderTextStyle }}>A</Text>
				<Text style={{ ...baseHeaderTextStyle }}>Score</Text>
			</View>
		);
	};

	renderScorecardFooter = () => {
		const { showCalculator } = this.props;
		const { showTotals } = this.state;
		return (
			<View
				style={{
					flexDirection: "row",
					height: ROW_HEIGHT,
					backgroundColor: "black",
					width: "100%",
					alignItems: "center",
					paddingHorizontal: 4
				}}
			>
				<Text
					style={{
						...baseHeaderTextStyle,
						color: "khaki",
						textAlign: "left"
					}}
					onPress={() => this.clearValues()}
				>
					{"Clear All Scores"}
				</Text>

				<View style={{ flexDirection: "row", alignItems: "center", flex: 1 }}>
					<Text
						style={{ ...baseHeaderTextStyle, flex: 0, marginHorizontal: 8 }}
					>
						{"Total Scores"}
					</Text>
					<Switch
						style={{ transform: [{ scale: 0.8 }] }}
						value={showTotals}
						onValueChange={val => {
							this.setState({ showTotals: val });
						}}
					/>
				</View>

				<Text
					style={{
						...baseHeaderTextStyle,
						color: "khaki",
						flex: 2,
						textAlign: "right"
					}}
					onPress={() => showCalculator()}
				>
					{"Scientific Score Calculator"}
				</Text>
			</View>
		);
	};

	render() {
		const inputRows = [];
		for (let i = 1; i <= NUM_OF_PLAYERS; i++) {
			inputRows.push(
				<View
					key={`p${i}-inputRow`}
					style={{ flexDirection: "row", height: ROW_HEIGHT }}
				>
					{this.createRowForPlayer(i)}
				</View>
			);
		}

		return (
			<View style={styles.container}>
				<ScrollView
					ref={this.scrollview}
					style={{ width: "100%" }}
					contentContainerStyle={{
						marginTop:
							(SCREEN_HEIGHT - 2 * CONTAINER_PADDING - 9 * ROW_HEIGHT) / 2
					}}
					showsVerticalScrollIndicator={false}
					keyboardDismissMode="on-drag"
					keyboardShouldPersistTaps="handled"
				>
					{this.renderScorecardHeader()}
					{inputRows}
					{this.renderScorecardFooter()}
				</ScrollView>
			</View>
		);
	}
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		justifyContent: "center",
		alignItems: "center",
		backgroundColor: "khaki",
		padding: CONTAINER_PADDING
	}
});

Scorecard.propTypes = {
	showCalculator: PropTypes.func.isRequired
};

export default Scorecard;
