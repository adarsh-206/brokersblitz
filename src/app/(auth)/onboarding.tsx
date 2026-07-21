import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useEffect, useRef, useState } from "react";
import {
  Dimensions,
  FlatList,
  NativeScrollEvent,
  NativeSyntheticEvent,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const { width: SCREEN_WIDTH } = Dimensions.get("window");

interface Slide {
  id: string;
  title: string;
  subtitle: string;
  icon: keyof typeof Ionicons.glyphMap;
  badgeLeftIcon: keyof typeof Ionicons.glyphMap;
  badgeLeftColor: string;
  badgeRightIcon: keyof typeof Ionicons.glyphMap;
  badgeRightColor: string;
  illustrationBg: string;
  iconColor: string;
}

const SLIDES: Slide[] = [
  {
    id: "1",
    title: "Any Broker,\nEvery Deal!",
    subtitle:
      "Property, cars, or insurance—manage all your parties & inventory in one simple app.",
    icon: "briefcase",
    badgeLeftIcon: "home",
    badgeLeftColor: "#3B82F6",
    badgeRightIcon: "car",
    badgeRightColor: "#F59E0B",
    illustrationBg: "rgba(93, 69, 249, 0.1)",
    iconColor: "#5D45F9",
  },
  {
    id: "2",
    title: "No More\nDiary Jhanjhat",
    subtitle:
      "Stop writing leads on random papers. Track status, follow-ups & client history on the go.",
    icon: "document-text",
    badgeLeftIcon: "call",
    badgeLeftColor: "#22C55E",
    badgeRightIcon: "alarm",
    badgeRightColor: "#EF4444",
    illustrationBg: "rgba(245, 158, 11, 0.1)",
    iconColor: "#F59E0B",
  },
  {
    id: "3",
    title: "Crack Deals\nDouble Fast!",
    subtitle:
      "Share neat proposals directly on WhatsApp and convert your hot leads into solid brokerage.",
    icon: "cash",
    badgeLeftIcon: "logo-whatsapp",
    badgeLeftColor: "#25D366",
    badgeRightIcon: "trophy",
    badgeRightColor: "#10B981",
    illustrationBg: "rgba(34, 197, 94, 0.1)",
    iconColor: "#22C55E",
  },
];

export default function OnboardingScreen() {
  const router = useRouter();
  const [activeIndex, setActiveIndex] = useState(0);
  const flatListRef = useRef<FlatList<Slide>>(null);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const startAutoPlay = () => {
    stopAutoPlay();
    timerRef.current = setInterval(() => {
      let nextIndex = activeIndex + 1;
      if (nextIndex >= SLIDES.length) {
        nextIndex = 0;
      }
      flatListRef.current?.scrollToIndex({
        index: nextIndex,
        animated: true,
      });
      setActiveIndex(nextIndex);
    }, 3500);
  };

  const stopAutoPlay = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  };

  useEffect(() => {
    startAutoPlay();
    return () => stopAutoPlay();
  }, [activeIndex]);

  const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const scrollPosition = event.nativeEvent.contentOffset.x;
    const index = Math.round(scrollPosition / SCREEN_WIDTH);
    if (index !== activeIndex && index >= 0 && index < SLIDES.length) {
      setActiveIndex(index);
    }
  };

  const handleGetStarted = () => {
    stopAutoPlay();
    router.replace("/(auth)/login");
  };

  const renderSlide = ({ item }: { item: Slide }) => {
    return (
      <View
        style={{
          width: SCREEN_WIDTH,
          alignItems: "center",
          justifyContent: "center",
          paddingHorizontal: 24,
        }}
      >
        <View
          style={{
            width: 180,
            height: 180,
            backgroundColor: item.illustrationBg,
            borderRadius: 90,
            alignItems: "center",
            justifyContent: "center",
            marginBottom: 36,
            position: "relative",
          }}
        >
          <View
            style={{
              width: 120,
              height: 120,
              backgroundColor: "rgba(255, 255, 255, 0.8)",
              borderRadius: 60,
              alignItems: "center",
              justifyContent: "center",
              elevation: 2,
              shadowColor: "#000",
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.05,
              shadowRadius: 4,
            }}
          >
            <Ionicons name={item.icon} size={56} color={item.iconColor} />
          </View>

          <View
            style={{
              position: "absolute",
              top: 4,
              left: 4,
              backgroundColor: item.badgeLeftColor,
              padding: 10,
              borderRadius: 16,
              elevation: 4,
              shadowColor: item.badgeLeftColor,
              shadowOffset: { width: 0, height: 4 },
              shadowOpacity: 0.3,
              shadowRadius: 6,
            }}
          >
            <Ionicons name={item.badgeLeftIcon} size={18} color="white" />
          </View>

          <View
            style={{
              position: "absolute",
              bottom: 12,
              right: 4,
              backgroundColor: item.badgeRightColor,
              padding: 10,
              borderRadius: 16,
              elevation: 4,
              shadowColor: item.badgeRightColor,
              shadowOffset: { width: 0, height: 4 },
              shadowOpacity: 0.3,
              shadowRadius: 6,
            }}
          >
            <Ionicons name={item.badgeRightIcon} size={18} color="white" />
          </View>
        </View>

        <Text
          style={{
            fontSize: 28,
            fontWeight: "900",
            color: "#1E1B4B",
            textAlign: "center",
            lineHeight: 36,
          }}
        >
          {item.title}
        </Text>

        <Text
          style={{
            fontSize: 14,
            color: "#6B7280",
            textAlign: "center",
            marginTop: 14,
            paddingHorizontal: 16,
            lineHeight: 22,
          }}
        >
          {item.subtitle}
        </Text>
      </View>
    );
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#F7F8FC" }}>
      <View
        style={{
          flex: 1,
          justifyContent: "space-between",
          paddingVertical: 16,
        }}
      >
        <View style={{ flex: 1 }}>
          <FlatList
            ref={flatListRef}
            data={SLIDES}
            renderItem={renderSlide}
            keyExtractor={(item) => item.id}
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            onScroll={handleScroll}
            scrollEventThrottle={16}
            onTouchStart={stopAutoPlay}
            onTouchEnd={startAutoPlay}
          />
        </View>

        <View style={{ paddingHorizontal: 24, paddingBottom: 8 }}>
          <View
            style={{
              flexDirection: "row",
              justifyContent: "center",
              marginBottom: 32,
            }}
          >
            {SLIDES.map((_, index) => (
              <View
                key={index}
                style={{
                  width: index === activeIndex ? 24 : 6,
                  height: 6,
                  borderRadius: 3,
                  backgroundColor:
                    index === activeIndex
                      ? "#5D45F9"
                      : "rgba(156, 163, 175, 0.4)",
                  marginHorizontal: 4,
                }}
              />
            ))}
          </View>

          <TouchableOpacity
            style={{
              width: "100%",
              backgroundColor: "#5D45F9",
              paddingVertical: 16,
              borderRadius: 18,
              alignItems: "center",
              flexDirection: "row",
              justifyContent: "center",
              elevation: 4,
              shadowColor: "#5D45F9",
              shadowOffset: { width: 0, height: 4 },
              shadowOpacity: 0.3,
              shadowRadius: 8,
            }}
            onPress={handleGetStarted}
          >
            <Text
              style={{
                color: "white",
                fontWeight: "800",
                fontSize: 16,
                marginRight: 8,
              }}
            >
              Get Started
            </Text>
            <Ionicons name="arrow-forward" size={18} color="white" />
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}
