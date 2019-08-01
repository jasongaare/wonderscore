import React, { Component } from "react";
import {
  Animated,
  Dimensions,
  Easing,
  SafeAreaView,
  StyleSheet
} from "react-native";
import Scorecard from "./screens/Scorecard";
import ScienceCalculator from "./screens/ScienceCalc";

const { height: SCREEN_HEIGHT } = Dimensions.get("window");

class App extends Component {
  constructor() {
    super();

    this.state = {
      calculatorOpacity: new Animated.Value(0),
      playerNameForCalc: "Player",
      onHideCallback: () => {},
      calculatorValues: "",
      calcShowing: false
    };
  }

  showScienceCalculator = ({ playerName, callback, values }) => {
    this.setState(
      {
        playerNameForCalc: playerName,
        onHideCallback: callback,
        calculatorValues: values
      },
      () => {
        const { calculatorOpacity } = this.state;
        Animated.timing(calculatorOpacity, {
          toValue: 1,
          duration: 222,
          useNativeDriver: true
        }).start(() => {
          this.setState({ calcShowing: true });
        });
      }
    );
  };

  hideScienceCalculator = (value) => {
    const { calculatorOpacity, onHideCallback } = this.state;

    if (value) {
      onHideCallback(value);
    }

    this.setState(
      {
        calculatorValues: "",
        calcShowing: false
      },
      () => {
        Animated.timing(calculatorOpacity, {
          toValue: 0,
          duration: 222,
          useNativeDriver: true
        }).start();
      }
    );
  };

  render() {
    const {
      calculatorOpacity,
      playerNameForCalc,
      calculatorValues,
      calcShowing
    } = this.state;

    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: "khaki" }}>
        <Scorecard showCalculator={this.showScienceCalculator} />

        <Animated.View
          pointerEvents="none"
          style={{
            ...StyleSheet.absoluteFillObject,
            backgroundColor: "rgba(0,0,0,0.25)",
            opacity: calculatorOpacity.interpolate({
              inputRange: [0, 0.75],
              outputRange: [0, 1],
              extrapolate: "clamp"
            })
          }}
        />

        <Animated.View
          pointerEvents={calcShowing ? "auto" : "none"}
          style={{
            ...StyleSheet.absoluteFillObject,
            opacity: calculatorOpacity.interpolate({
              inputRange: [0.25, 1],
              outputRange: [0, 1],
              extrapolate: "clamp"
            })
          }}
        >
          <ScienceCalculator
            playerName={playerNameForCalc}
            hideSelf={this.hideScienceCalculator}
            calculatorValues={calculatorValues}
            isShowing={calcShowing}
          />
        </Animated.View>
      </SafeAreaView>
    );
  }
}

export default App;
