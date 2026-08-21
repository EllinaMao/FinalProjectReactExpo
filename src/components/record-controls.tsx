import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

interface RecordControlsProps {
  isRecording: boolean;
  hasAudio: boolean; 
  onStart: () => void;
  onStop: () => void;
}

export const RecordControls = ({ isRecording, hasAudio, onStart, onStop }: RecordControlsProps) => {
  return (
    <View style={styles.recordControls}>
      {isRecording ? (
        <TouchableOpacity style={styles.stopButton} onPress={onStop}>
          <Text style={styles.buttonText}>Остановить запись</Text>
        </TouchableOpacity>
      ) : (
        <TouchableOpacity style={styles.recordButton} onPress={onStart}>
          <Text style={styles.buttonText}>
            {hasAudio ? "Перезаписать" : "Начать запись"}
          </Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  recordControls: {
    alignItems: "center",
    marginBottom: 20,
  },
  recordButton: {
    backgroundColor: "#ef4444",
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 24,
  },
  stopButton: {
    backgroundColor: "#3b82f6",
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 24,
  },
  buttonText: {
    color: "white",
    fontWeight: "bold",
  },
});