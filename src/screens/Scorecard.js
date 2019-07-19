import React, { Component } from "react";
import PropTypes from "prop-types";
import {
  Alert,
  Dimensions,
  findNodeHandle,
  Image,
  Keyboard,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TextInput,
  View
} from "react-native";
import isEqual from "lodash.isequal";

import { columns, columnColors, summableColumns } from "../columns";
import {
  blueCard,
  coin,
  greenCard,
  purpleCard,
  shield,
  wonder,
  yellowCard
} from "../images";

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

  scrollToFocusedInput = (ref) => {
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
          100,
          true
        );
      }
    }, 100);
  };

  initializeRefs = () => {
    const refs = {};

    for (let i = 1; i <= NUM_OF_PLAYERS; i++) {
      columns.forEach((column) => {
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
      summableColumns.forEach((column) => {
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
      summableColumns.forEach((column) => {
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

  createRowForPlayer = (num) => {
    const rowInputs = [];
    const { inputValues, inputRefs } = this.state;
    const { showCalculator } = this.props;

    columns.forEach((column, index) => {
      const key = `p${num}-${column}`;
      const isName = column === "name";
      const isScience = column === "science";
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

      if (isScience) {
        inputValue = inputValue ? inputValue.score : "";
      }

      const playerNameForRow = inputValues[`p${num}-name`];
      const setNewValue = (value) => {
        const newValue = {};
        newValue[key] = value;
        this.setState({
          inputValues: Object.assign({}, inputValues, newValue)
        });
      };

      rowInputs.push(
        <TextInput
          key={key}
          ref={inputRefs[key]}
          editable={!(isTotal || isScience)}
          keyboardType={isName ? "default" : "numbers-and-punctuation"}
          keyboardShouldPersistTaps="always"
          autoCorrect={false}
          style={{
            ...baseInputStyle,
            backgroundColor: columnColors[index],
            flex: isName ? 3 : 1
          }}
          value={inputValue}
          returnKeyType="next"
          onChangeText={(text) => setNewValue(text)}
          onTouchStart={() => {
            if (isScience) {
              Keyboard.dismiss();
              showCalculator({
                callback: (value) => setNewValue(value),
                playerName:
                  playerNameForRow && playerNameForRow.length
                    ? playerNameForRow
                    : `Player ${num}`,
                values: inputValues[key]
              });
            }
          }}
          onFocus={() => {
            this.scrollToFocusedInput(inputRefs[key].current);
          }}
          onSubmitEditing={() => {
            // if name, move to next name field (down row)
            // else move to next column while scoring
            if (isName) {
              const nextRow = num + 1;
              if (nextRow <= 7) {
                inputRefs[`p${nextRow}-${columns[0]}`].current.focus();
              } else {
                inputRefs[key].current.blur();
              }
            } else {
              const nextIndex = index + 1;
              if (nextIndex < columns.length - 1) {
                inputRefs[`p${num}-${columns[nextIndex]}`].current.focus();
              } else {
                inputRefs[key].current.blur();
              }
            }
          }}
        />
      );
    });

    return rowInputs;
  };

  renderScorecardHeader = () => {
    const renderIcon = (iconName) => (
      <View
        style={{
          flex: 1,
          borderColor: "black",
          borderWidth: 1,
          alignItems: "center",
          justifyContent: "center"
        }}
      >
        <Image
          style={{
            height: (ROW_HEIGHT / 4) * 3,
            resizeMode: "contain"
          }}
          source={iconName}
        />
      </View>
    );

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
        {renderIcon(shield)}
        {renderIcon(coin)}
        {renderIcon(wonder)}
        {renderIcon(blueCard)}
        {renderIcon(yellowCard)}
        {renderIcon(purpleCard)}
        {renderIcon(greenCard)}
        <Text style={{ ...baseHeaderTextStyle }}>Score</Text>
      </View>
    );
  };

  renderScorecardFooter = () => {
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
          onPress={() =>
            Alert.alert("Clear All Scores?", "", [
              {
                text: "Cancel",
                onPress: () => {},
                style: "cancel"
              },
              {
                text: "Clear",
                onPress: () => {
                  this.clearValues();
                },
                style: "destructive"
              }
            ])
          }
        >
          {"Clear All Scores"}
        </Text>

        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            flex: 1,
            justifyContent: "flex-end"
          }}
        >
          <Text
            style={{ ...baseHeaderTextStyle, flex: 0, marginHorizontal: 8 }}
          >
            {"Show Score Totals"}
          </Text>
          <Switch
            style={{ transform: [{ scale: 0.8 }] }}
            value={showTotals}
            onValueChange={(val) => {
              this.setState({ showTotals: val });
            }}
          />
        </View>
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
