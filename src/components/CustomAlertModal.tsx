import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { Modal, Text, TouchableOpacity, View } from "react-native";

export interface CustomAlertModalProps {
  visible: boolean;
  type?: "danger" | "success" | "info";
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  onConfirm: () => void;
  onCancel?: () => void;
}

export default function CustomAlertModal({
  visible,
  type = "info",
  title,
  message,
  confirmText = "OK",
  cancelText,
  onConfirm,
  onCancel,
}: CustomAlertModalProps) {
  const getTheme = () => {
    switch (type) {
      case "danger":
        return {
          iconName: "warning" as const,
          iconBg: "#FEE2E2",
          iconColor: "#EF4444",
          buttonBg: "#EF4444",
          buttonText: "#FFFFFF",
        };
      case "success":
        return {
          iconName: "checkmark-circle" as const,
          iconBg: "#EEF2FF",
          iconColor: "#5D45F9",
          buttonBg: "#5D45F9",
          buttonText: "#FFFFFF",
        };
      default:
        return {
          iconName: "information-circle" as const,
          iconBg: "#EEF2FF",
          iconColor: "#5D45F9",
          buttonBg: "#5D45F9",
          buttonText: "#FFFFFF",
        };
    }
  };

  const theme = getTheme();

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onCancel || onConfirm}
    >
      <View
        style={{
          flex: 1,
          backgroundColor: "rgba(15, 23, 42, 0.6)",
          justifyContent: "center",
          alignItems: "center",
          paddingHorizontal: 24,
        }}
      >
        <View
          style={{
            width: "100%",
            backgroundColor: "#FFFFFF",
            borderRadius: 28,
            padding: 24,
            alignItems: "center",
            elevation: 8,
            shadowColor: "#000000",
            shadowOffset: { width: 0, height: 10 },
            shadowOpacity: 0.1,
            shadowRadius: 20,
          }}
        >
          <View
            style={{
              width: 64,
              height: 64,
              backgroundColor: theme.iconBg,
              borderRadius: 20,
              alignItems: "center",
              justifyContent: "center",
              marginBottom: 16,
            }}
          >
            <Ionicons name={theme.iconName} size={32} color={theme.iconColor} />
          </View>

          <Text
            style={{
              fontSize: 20,
              fontWeight: "800",
              color: "#1E1B4B",
              marginBottom: 8,
              textAlign: "center",
            }}
          >
            {title}
          </Text>

          <Text
            style={{
              fontSize: 14,
              color: "#6B7280",
              textAlign: "center",
              lineHeight: 20,
              marginBottom: 24,
            }}
          >
            {message}
          </Text>

          <View style={{ flexDirection: "row", gap: 12, width: "100%" }}>
            {cancelText && onCancel && (
              <TouchableOpacity
                onPress={onCancel}
                style={{
                  flex: 1,
                  paddingVertical: 14,
                  borderRadius: 16,
                  backgroundColor: "#F3F4F6",
                  alignItems: "center",
                }}
              >
                <Text
                  style={{
                    fontSize: 15,
                    fontWeight: "700",
                    color: "#4B5563",
                  }}
                >
                  {cancelText}
                </Text>
              </TouchableOpacity>
            )}

            <TouchableOpacity
              onPress={onConfirm}
              style={{
                flex: 1,
                paddingVertical: 14,
                borderRadius: 16,
                backgroundColor: theme.buttonBg,
                alignItems: "center",
                elevation: 2,
                shadowColor: theme.buttonBg,
                shadowOffset: { width: 0, height: 4 },
                shadowOpacity: 0.25,
                shadowRadius: 6,
              }}
            >
              <Text
                style={{
                  fontSize: 15,
                  fontWeight: "800",
                  color: theme.buttonText,
                }}
              >
                {confirmText}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}
