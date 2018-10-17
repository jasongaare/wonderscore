import React, { Component } from "react";
import { StyleSheet, View, TextInput } from "react-native";
import isEqual from "lodash.isequal";

const NUM_OF_PLAYERS = 7;
const baseInputStyle = {
	borderColor: "black",
	borderWidth: 1,
	color: "black",
	fontSize: 20,
	height: "100%",
	textAlign: "center"
};

const columns = [
	"name",
	"military",
	"treasury",
	"wonders",
	"civilian",
	"commercial",
	"guilds",
	"science",
	"totalpoints"
];

const summableColumns = [
	"military",
	"treasury",
	"wonders",
	"civilian",
	"commercial",
	"guilds",
	"science"
];

const columnColors = [
	"white",
	"indianred",
	"lemonchiffon",
	"wheat",
	"royalblue",
	"orange",
	"blueviolet",
	"mediumseagreen",
	"white"
];

export default class App extends Component {
	constructor(props) {
		super(props);

		this.state = {
			inputValues: {},
			inputRefs: {}
		};
	}

	componentDidMount() {
		this.createValues(NUM_OF_PLAYERS);
	}

	componentDidUpdate(prevProps, prevState) {
		const { inputValues } = this.state;

		if (!isEqual(inputValues, prevState.inputValues)) {
			this.updateTotals();
		}
	}

	createValues = playerNum => {
		if (playerNum === 0) {
			return;
		}

		const { inputValues, inputRefs } = this.state;
		const valuesForPlayer = {};
		const refsForPlayer = {};

		columns.forEach(column => {
			const key = `p${playerNum}-${column}`;
			valuesForPlayer[key] = "";
			refsForPlayer[key] = React.createRef();
		});

		this.setState(
			{
				inputValues: Object.assign({}, inputValues, valuesForPlayer),
				inputRefs: Object.assign({}, inputRefs, refsForPlayer)
			},
			() => {
				this.createValues(playerNum - 1);
			}
		);
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

	render() {
		const rowInputs1 = [];
		const { inputValues, inputRefs } = this.state;

		columns.forEach((column, index) => {
			const key = `p1-${column}`;
			const isName = column === "name";
			const isTotal = column === "totalpoints";

			rowInputs1.push(
				<TextInput
					key={key}
					ref={inputRefs[key]}
					editable={!isTotal}
					keyboardType={isName ? "default" : "numbers-and-punctuation"}
					style={{
						...baseInputStyle,
						backgroundColor: columnColors[index],
						flex: isName ? 3 : 1
					}}
					value={inputValues[key]}
					onChangeText={text => {
						const newValue = {};
						newValue[key] = text;
						this.setState({
							inputValues: Object.assign({}, inputValues, newValue)
						});
					}}
					onSubmitEditing={() => {
						const nextIndex = index + 1;
						if (nextIndex < columns.length - 1) {
							inputRefs[`p1-${columns[nextIndex]}`].current.focus();
						}
					}}
				/>
			);
		});

		return (
			<View style={styles.container}>
				<View style={{ flexDirection: "row", height: 32 }}>{rowInputs1}</View>
			</View>
		);
	}
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		justifyContent: "flex-start",
		alignItems: "center",
		backgroundColor: "khaki",
		padding: 16
	}
});
