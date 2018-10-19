import React, { Component } from "react";
import { StyleSheet, View } from "react-native";

class Scorecard extends Component {
	constructor(props) {
		super(props);

		this.state = {
			visible: false
		};
	}

	render() {
		return <View style={styles.container} />;
	}
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		justifyContent: "center",
		alignItems: "center",
		backgroundColor: "green",
		padding: 16
	}
});

export default Scorecard;
