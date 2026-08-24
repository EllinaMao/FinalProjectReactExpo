import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

export type QualityOption = "low" | "high";

interface QualitySelectorProps {
  selectedQuality: QualityOption;
  onSelect: (quality: QualityOption) => void;
  disabled: boolean;
}

export const QualitySelector = ({
  selectedQuality,
  onSelect,
  disabled,
}: QualitySelectorProps) => {
  return (
    <View style={styles.container}>
      <Text style={styles.label}>Качество записи</Text>

      <View
        style={[styles.segmentedControl, disabled && styles.disabledControl]}
      >
        <TouchableOpacity
          style={[
            styles.segment,
            selectedQuality === "low" && styles.activeSegment,
          ]}
          onPress={() => !disabled && onSelect("low")}
          activeOpacity={0.7}
          disabled={disabled}
        >
          <Text
            style={[
              styles.segmentText,
              selectedQuality === "low" && styles.activeText,
            ]}
          >
            Низкое
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.segment,
            selectedQuality === "high" && styles.activeSegment,
          ]}
          onPress={() => !disabled && onSelect("high")}
          activeOpacity={0.7}
          disabled={disabled}
        >
          <Text
            style={[
              styles.segmentText,
              selectedQuality === "high" && styles.activeText,
            ]}
          >
            Высокое
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 30,
    width: "100%",
    alignItems: "center",
  },
  label: {
    fontSize: 13,
    fontWeight: "600",
    color: "#9ca3af",
    marginBottom: 12,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  segmentedControl: {
    flexDirection: "row",
    backgroundColor: "#f3f4f6",
    borderRadius: 14,
    padding: 4,
    width: "100%",
  },
  disabledControl: {
    opacity: 0.5,
  },
  segment: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  activeSegment: {
    backgroundColor: "#ffffff",
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
  },
  segmentText: {
    fontSize: 15,
    fontWeight: "500",
    color: "#6b7280",
  },
  activeText: {
    color: "#111827",
    fontWeight: "700",
  },
});
