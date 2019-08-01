import React, { Component } from "react";
import PropTypes from "prop-types";
import {
  Slider,
  StyleSheet,
  View,
  Text,
  Image,
  TouchableOpacity,
  Dimensions,
  SafeAreaView
} from "react-native";
import { scienceCog, scienceCompass, scienceTablet } from "../images";

const SCREEN_WIDTH = Dimensions.get("window").width;
const MAX_SLIDER_VALUE = 6;
const CARD_TYPES = {
  COG: 0,
  TABLET: 1,
  COMPASS: 2
};

class ScienceCalc extends Component {
  state = {
    cogCardCount: 0,
    tabletCardCount: 0,
    compassCardCount: 0,
    isShowing: false // eslint-disable-line react/no-unused-state
  };

  static getDerivedStateFromProps(props, state) {
    const { isShowing, calculatorValues } = props;

    if (isShowing === state.isShowing) {
      return null;
    }

    const {
      cogCardCount,
      tabletCardCount,
      compassCardCount
    } = calculatorValues;

    return {
      cogCardCount: cogCardCount || state.cogCardCount,
      tabletCardCount: tabletCardCount || state.tabletCardCount,
      compassCardCount: compassCardCount || state.compassCardCount,
      isShowing
    };
  }

  getCurrentScore = () => {
    const { cogCardCount, tabletCardCount, compassCardCount } = this.state;
    const square = (x) => x * x;

    const completeSets = Math.min(
      cogCardCount,
      tabletCardCount,
      compassCardCount
    );
    const completeSetBonus = completeSets * 7;

    return (
      square(cogCardCount) +
      square(tabletCardCount) +
      square(compassCardCount) +
      completeSetBonus
    );
  };

  renderSliderRow = (cardType) => {
    const { cogCardCount, tabletCardCount, compassCardCount } = this.state;

    let sliderValue = null;
    let onValueChange = () => {};
    let image = null;

    switch (cardType) {
      case CARD_TYPES.COG:
        image = scienceCog;
        sliderValue = cogCardCount;
        onValueChange = (val) => {
          this.setState({
            cogCardCount: val
          });
        };
        break;
      case CARD_TYPES.TABLET:
        image = scienceTablet;
        sliderValue = tabletCardCount;
        onValueChange = (val) => {
          this.setState({
            tabletCardCount: val
          });
        };
        break;
      case CARD_TYPES.COMPASS:
        image = scienceCompass;
        sliderValue = compassCardCount;
        onValueChange = (val) => {
          this.setState({
            compassCardCount: val
          });
        };
        break;
      default:
        break;
    }

    if (sliderValue === null) {
      return null;
    }

    return (
      <View style={styles.sliderRow}>
        <View style={styles.numberOfTextContainer}>
          <Text style={{ fontSize: 18, color: "black" }}>Number of</Text>
          <Image
            style={{
              height: 44,
              resizeMode: "contain"
            }}
            source={image}
          />
          {/* <Text style={{ fontSize: 18, color: "black" }}>cards:</Text> */}
        </View>
        <View style={styles.countView}>
          <Text style={styles.countText}>{sliderValue}</Text>
        </View>
        <Slider
          style={styles.rowRightContainer}
          minimumValue={0}
          minimumTrackTintColor="green"
          maximumValue={MAX_SLIDER_VALUE}
          step={1}
          value={sliderValue}
          onValueChange={onValueChange}
        />
      </View>
    );
  };

  render() {
    const { hideSelf, playerName } = this.props;
    const { isShowing } = this.state;

    if (!isShowing) {
      return (
        <SafeAreaView style={styles.outerContainer}>
          <View style={styles.container} />
        </SafeAreaView>
      );
    }

    return (
      <SafeAreaView style={styles.outerContainer}>
        <View style={styles.container}>
          <View style={styles.titleContainer}>
            <Text style={styles.headerText}>Calculate science score for</Text>
            <Text style={styles.playerName}>{`${playerName}`}</Text>
          </View>
          {this.renderSliderRow(CARD_TYPES.COG)}
          {this.renderSliderRow(CARD_TYPES.TABLET)}
          {this.renderSliderRow(CARD_TYPES.COMPASS)}

          <View
            style={{
              width: "100%",
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "center"
            }}
          >
            <View style={styles.numberOfTextContainer}>
              <Text style={styles.scoreText}>Total:</Text>
            </View>
            <View
              style={[
                styles.countView,
                {
                  backgroundColor: "transparent",
                  overflow: "visible"
                }
              ]}
            >
              <Text
                style={[
                  styles.scoreText,
                  {
                    textAlign: "center"
                  }
                ]}
              >
                {this.getCurrentScore()}
              </Text>
            </View>
            <View
              style={[
                styles.rowRightContainer,
                {
                  alignItems: "flex-end"
                }
              ]}
            >
              <TouchableOpacity
                style={{
                  padding: 12,
                  backgroundColor: "green",
                  borderRadius: 4,
                  alignItems: "center",
                  justifyContent: "center",
                  alignSelf: "flex-end"
                }}
                onPress={() => {
                  const {
                    cogCardCount,
                    tabletCardCount,
                    compassCardCount
                  } = this.state;

                  hideSelf({
                    cogCardCount,
                    tabletCardCount,
                    compassCardCount,
                    score: `${this.getCurrentScore()}`
                  });

                  setTimeout(() => {
                    this.setState({
                      cogCardCount: 0,
                      tabletCardCount: 0,
                      compassCardCount: 0
                    });
                  }, 321);
                }}
              >
                <Text
                  style={{ color: "white", fontSize: 16, fontWeight: "bold" }}
                >
                  Done
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  outerContainer: {
    flex: 1
  },
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "khaki",
    padding: 16,
    margin: "1%",
    marginHorizontal: "2%",
    borderRadius: 12
  },
  headerText: {
    color: "green",
    fontSize: 20,
    fontStyle: "italic",
    textAlign: "center"
  },
  playerName: {
    color: "black",
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center"
  },
  sliderRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    width: "100%"
  },
  numberOfTextContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-end",
    width: SCREEN_WIDTH / 4,
    maxWidth: 210
  },
  countView: {
    margin: 8,
    width: 32,
    height: 32,
    backgroundColor: "white",
    justifyContent: "center",
    borderRadius: 4
  },
  countText: {
    textAlign: "center",
    color: "black",
    fontSize: 20,
    fontWeight: "bold",
    lineHeight: 32
  },
  rowRightContainer: {
    width: SCREEN_WIDTH / 2.5,
    maxWidth: 280,
    marginLeft: 16
  },
  scoreText: {
    color: "black",
    fontSize: 24,
    fontWeight: "bold"
  }
});

ScienceCalc.propTypes = {
  hideSelf: PropTypes.func.isRequired,
  playerName: PropTypes.string.isRequired,
  calculatorValues: PropTypes.oneOfType([PropTypes.object, PropTypes.string]) // eslint-disable-line
};

export default ScienceCalc;
