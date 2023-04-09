import React, { useState, useEffect, useRef } from "react";
import { StatusBar } from "expo-status-bar";
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  Pressable,
  SafeAreaView,
  Alert,
  Animated,
  Easing,
  Image,
  FlatList,
  ScrollView,
  KeyboardAvoidingView,
} from "react-native";
import { Picker } from "@react-native-picker/picker";

const US_STATES = [
  { label: "New York", value: "NY" },
  { label: "Alabama", value: "AL" },
  { label: "Alaska", value: "AK" },
  { label: "Arizona", value: "AZ" },
  { label: "Arkansas", value: "AR" },
  { label: "California", value: "CA" },
  { label: "Colorado", value: "CO" },
  { label: "Connecticut", value: "CT" },
  { label: "Delaware", value: "DE" },
  { label: "Florida", value: "FL" },
  { label: "Georgia", value: "GA" },
  { label: "Hawaii", value: "HI" },
  { label: "Idaho", value: "ID" },
  { label: "Illinois", value: "IL" },
  { label: "Indiana", value: "IN" },
  { label: "Iowa", value: "IA" },
  { label: "Kansas", value: "KS" },
  { label: "Kentucky", value: "KY" },
  { label: "Louisiana", value: "LA" },
  { label: "Maine", value: "ME" },
  { label: "Maryland", value: "MD" },
  { label: "Massachusetts", value: "MA" },
  { label: "Michigan", value: "MI" },
  { label: "Minnesota", value: "MN" },
  { label: "Mississippi", value: "MS" },
  { label: "Missouri", value: "MO" },
  { label: "Montana", value: "MT" },
  { label: "Nebraska", value: "NE" },
  { label: "Nevada", value: "NV" },
  { label: "New Hampshire", value: "NH" },
  { label: "New Jersey", value: "NJ" },
  { label: "New Mexico", value: "NM" },
  { label: "North Carolina", value: "NC" },
  { label: "North Dakota", value: "ND" },
  { label: "Ohio", value: "OH" },
  { label: "Oklahoma", value: "OK" },
  { label: "Oregon", value: "OR" },
  { label: "Pennsylvania", value: "PA" },
  { label: "Rhode Island", value: "RI" },
  { label: "South Carolina", value: "SC" },
  { label: "South Dakota", value: "SD" },
  { label: "Tennessee", value: "TN" },
  { label: "Texas", value: "TX" },
  { label: "Utah", value: "UT" },
  { label: "Vermont", value: "VT" },
  { label: "Virginia", value: "VA" },
  { label: "Washington", value: "WA" },
  { label: "West Virginia", value: "WV" },
  { label: "Wisconsin", value: "WI" },
  { label: "Wyoming", value: "WY" },
];

const API_URL = `https://site-safety-expert.vercel.app/api`;

// Loading Spinner Animation
const LoadingSpinner = () => {
  const rotation = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.loop(
      Animated.timing(rotation, {
        toValue: 1,
        duration: 1500,
        easing: Easing.linear,
        useNativeDriver: true,
      })
    ).start();
  }, [rotation]);

  const rotate = rotation.interpolate({
    inputRange: [0, 1],
    outputRange: ["0deg", "360deg"],
  });

  return (
    <View style={styles.loadingContainer}>
      <Animated.View style={{ transform: [{ rotate }] }}>
        <View style={styles.spinner} />
        <View style={styles.innerSpinner} />
      </Animated.View>
    </View>
  );
};

export default function App() {
  const [state, setState] = useState("New York");
  const [subject, setSubject] = useState("");

  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState();

  async function onSubmit(event) {
    setLoading(true);

    // stimulate an asynchronous operation
    setTimeout(() => {
      setLoading(false);
    }, 30000);

    try {
      const response = await fetch(`${API_URL}/generate-safety`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ state, subject }),
      });

      const data = await response.json();
      setResult(data.result);

      if (!response.ok) {
        throw new Error(`Error response: ${response.status}`);
      }
    } catch (e) {
      Alert.alert("Failed to generate results, Try later");
    } finally {
      setLoading(false);
    }
  }

  const renderState = () => {
    return US_STATES.map((state) => {
      return (
        <Picker key={state.value} label={state.label} value={state.value} />
      );
    });
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  const onTryAgain = () => {
    setResult("");
  };
  if (result) {
    return (
      <SafeAreaView style={styles.container}>
        <ScrollView
          style={styles.resultContainer}
          showsVerticalScrollIndicator={false}>
          <Text style={styles.title}>
            Here are the regulations and codes for {subject}💡
          </Text>
          <Text style={styles.result}>{result}</Text>
          <Pressable onPress={onTryAgain} style={styles.button}>
            <Text style={styles.buttonText}>Try again</Text>
          </Pressable>
        </ScrollView>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <KeyboardAvoidingView style={{ flex: 1 }} behavior="padding">
        <ScrollView>
          <View style={styles.container}>
            <View style={styles.imageContainer}>
              <Image
                style={styles.logo}
                source={require("./assets/logo.png")}
                resizeMode="contain"
              />
            </View>
            <View style={styles.selectorContainer}>
              <Text style={styles.label}>STATE</Text>
              <Picker
                selectedValue={state}
                onValueChange={(itemValue) => setState(itemValue)}
                mode="dropdown">
                {renderState()}
              </Picker>
            </View>
            <Text style={styles.label}>SUBJECT</Text>
            <TextInput
              placeholder="Subject"
              style={styles.input}
              value={subject}
              onChangeText={setSubject}
            />
            <Text style={styles.guide}>
              *Please enter the safety topic that you would like to know more
              about (e.g. scaffolding, PPE, safe work practices)
            </Text>
            {/* Submit Button */}
            <Pressable onPress={onSubmit} style={styles.button}>
              <Text style={styles.buttonText}>Find Safety Regulations</Text>
            </Pressable>
            <StatusBar style="auto" />
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    justifyContent: "center",
    patting: 10,
    margin: 10,
  },
  resultContainer: {
    flex: 1,
    marginHorizontal: 10,
  },
  imageContainer: {
    flex: 0.5,
    alignItems: "center",
    justifyContent: "center",
  },
  logo: {
    width: 150,
    height: 150,
  },
  title: {
    fontSize: 20,
  },
  result: {},
  selectorContainer: {
    flexDirection: "column",
  },
  selector: {
    flex: 1,
    textAlign: "center",
    backgroundColor: "gainsboro",
    margin: 5,
    padding: 16,
    borderRadius: 5,
    overflow: "hidden",
  },

  input: {
    fontSize: 16,

    borderColor: "#353740",
    borderWidth: 1,
    borderRadius: 4,

    padding: 16,
    marginTop: 6,
    marginBottom: 12,
  },
  label: {
    fontSize: 16,
    color: "gray",
  },
  guide: {
    fontSize: 12,
  },

  button: {
    marginTop: "auto",
    backgroundColor: "#10a37f",
    padding: 16,
    borderRadius: 4,
    alignItems: "center",
    marginVertical: 6,
    marginTop: 16,
  },
  buttonText: {
    color: "white",
    fontWeight: "bold",
  },

  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  spinner: {
    width: 60,
    height: 60,
    borderRadius: 30,
    borderWidth: 5,
    borderColor: "#00bfff",
    borderStyle: "solid",
    position: "absolute",
  },
  innerSpinner: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: "#00bfff",
  },
});

// Fix a screen when result is larger than the screen size. has to be scrollable
