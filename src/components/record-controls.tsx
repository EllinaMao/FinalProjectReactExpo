import Feather from "@expo/vector-icons/Feather";
import { StyleSheet, TouchableOpacity, View } from "react-native";

interface RecordControlsProps {
  isRecording: boolean;
  hasAudio: boolean;
  onStart: () => void;
  onStop: () => void;
}

export const RecordControls = ({
  isRecording,
  hasAudio,
  onStart,
  onStop,
}: RecordControlsProps) => {
  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={[
          styles.buttonWrapper,
          isRecording ? styles.recordingActive : styles.recordingInactive,
        ]}
        onPress={isRecording ? onStop : onStart}
        activeOpacity={0.7}
      >
        <Feather
          name={isRecording ? "mic-off" : "mic"}
          size={32}
          color={isRecording ? "#ffffff" : "#ef4444"}
        />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 24,
  },
  buttonWrapper: {
    width: 80,
    height: 80,
    borderRadius: 40,
    alignItems: "center",
    justifyContent: "center",
  },
  recordingInactive: {
    backgroundColor: "#ffffff",
  },
  recordingActive: {
    backgroundColor: "#ef4444",

    elevation: 8,
    shadowColor: "#ef4444",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
  },
});
