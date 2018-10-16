import React, { Component } from "react";
import { StyleSheet, Text, View, TextInput } from "react-native";

export default class App extends Component {
  render() {
    const columnNames = [
      "military",
      "treasury",
      "wonders",
      "civilian",
      "commercial",
      "guilds",
      "science",
      "totalpoints"
    ];
    const columnColors = [
      "indianred",
      "lemonchiffon",
      "wheat",
      "royalblue",
      "orange",
      "blueviolet",
      "mediumseagreen",
      "white"
    ];

    const rowInputs1 = [];

    columnNames.forEach((column, index) => {
      rowInputs1.push(
        <TextInput
          key={`p1-${column}`}
          style={{
            height: "100%",
            flex: 1,
            backgroundColor: columnColors[index],
            borderColor: "black",
            borderWidth: 1
          }}
        />
      );
    });

    return (
      <View style={styles.container}>
        <View style={{ flexDirection: "row", height: 32 }}>
          <TextInput
            style={{
              height: "100%",
              flex: 3,
              backgroundColor: "white",
              borderColor: "black",
              borderWidth: 1
            }}
          />
          {rowInputs1}
        </View>

        <View style={{ flexDirection: "row", height: 32 }}>
          <TextInput
            style={{
              height: "100%",
              flex: 3,
              backgroundColor: "white",
              borderColor: "black",
              borderWidth: 1
            }}
          />
          {rowInputs1}
        </View>
        <View style={{ flexDirection: "row", height: 32 }}>
          <TextInput
            style={{
              height: "100%",
              flex: 3,
              backgroundColor: "white",
              borderColor: "black",
              borderWidth: 1
            }}
          />
          {rowInputs1}
        </View>
        <View style={{ flexDirection: "row", height: 32 }}>
          <TextInput
            style={{
              height: "100%",
              flex: 3,
              backgroundColor: "white",
              borderColor: "black",
              borderWidth: 1
            }}
          />
          {rowInputs1}
        </View>
        <View style={{ flexDirection: "row", height: 32 }}>
          <TextInput
            style={{
              height: "100%",
              flex: 3,
              backgroundColor: "white",
              borderColor: "black",
              borderWidth: 1
            }}
          />
          {rowInputs1}
        </View>
        <View style={{ flexDirection: "row", height: 32 }}>
          <TextInput
            style={{
              height: "100%",
              flex: 3,
              backgroundColor: "white",
              borderColor: "black",
              borderWidth: 1
            }}
          />
          {rowInputs1}
        </View>
        <View style={{ flexDirection: "row", height: 32 }}>
          <TextInput
            style={{
              height: "100%",
              flex: 3,
              backgroundColor: "white",
              borderColor: "black",
              borderWidth: 1
            }}
          />
          {rowInputs1}
        </View>
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
    padding: 16
  }
});
