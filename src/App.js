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
      calculatorOffset: new Animated.Value(SCREEN_HEIGHT),
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
        const { calculatorOffset } = this.state;
        Animated.timing(calculatorOffset, {
          toValue: 0,
          duration: 222,
          easing: Easing.out(Easing.quad)
        }).start(() => {
          this.setState({ calcShowing: true });
        });
      }
    );
  };

  hideScienceCalculator = (value) => {
    const { calculatorOffset, onHideCallback } = this.state;

    if (value) {
      onHideCallback(value);
    }

    this.setState(
      {
        calculatorValues: "",
        calcShowing: false
      },
      () => {
        Animated.timing(calculatorOffset, {
          toValue: SCREEN_HEIGHT,
          duration: 222,
          easing: Easing.out(Easing.quad)
        }).start();
      }
    );
  };

  render() {
    const {
      calculatorOffset,
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
            opacity: calculatorOffset.interpolate({
              inputRange: [0, 1],
              outputRange: [1, 0]
            })
          }}
        />

        <Animated.View
          style={{
            ...StyleSheet.absoluteFillObject,
            top: calculatorOffset.interpolate({
              inputRange: [0, 1],
              outputRange: [0, 1]
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
