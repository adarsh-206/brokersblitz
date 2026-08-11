import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useEffect, useRef } from "react";
import { Animated, Dimensions, Text, View } from "react-native";

const { height: SCREEN_HEIGHT } = Dimensions.get("window");

export default function SplashScreen() {
  const router = useRouter();

  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.8)).current;
  const slideAnim = useRef(new Animated.Value(SCREEN_HEIGHT * 0.05)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        friction: 6,
        tension: 40,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 600,
        useNativeDriver: true,
      }),
    ]).start();

    const timeout = setTimeout(() => {
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 400,
        useNativeDriver: true,
      }).start(() => {
        router.replace("/(tabs)");
      });
    }, 2500);

    return () => clearTimeout(timeout);
  }, []);

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: "#FFFFFF",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Animated.View
        style={{
          opacity: fadeAnim,
          transform: [{ scale: scaleAnim }, { translateY: slideAnim }],
          alignItems: "center",
        }}
      >
        <View
          style={{
            width: 110,
            height: 110,
            backgroundColor: "#5D45F9",
            borderRadius: 30,
            alignItems: "center",
            justifyContent: "center",
            elevation: 8,
            shadowColor: "#5D45F9",
            shadowOffset: { width: 0, height: 8 },
            shadowOpacity: 0.25,
            shadowRadius: 12,
            marginBottom: 24,
          }}
        >
          <Ionicons name="flash" size={54} color="#FFFFFF" />
        </View>

        <Text
          style={{
            fontSize: 32,
            fontWeight: "900",
            color: "#1E1B4B",
            letterSpacing: -0.5,
          }}
        >
          Brokers<Text style={{ color: "#5D45F9" }}>Blitz</Text>
        </Text>

        <Text
          style={{
            fontSize: 12,
            fontWeight: "600",
            color: "#6B7280",
            marginTop: 8,
            letterSpacing: 2,
            textTransform: "uppercase",
          }}
        >
          Deals Done Faster
        </Text>
      </Animated.View>
    </View>
  );
}
