import {
    AudioModule,
    RecordingOptions,
    RecordingPresets,
    useAudioRecorder,
} from "expo-audio";
import { useState } from "react";
import {
    Modal,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";

interface RecorderModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (title: string, audioFilePath?: string) => void;
  RecordingOptions?: RecordingOptions;
}

// interface DropdownProps {
//   options: string[];
//   selectedOption: string;
//   onSelect: (option: string) => void;
// }
// const [selectedOption, setSelectedOption] = useState<RecordingOptions>(RecordingPresets.HIGH_QUALITY);

const RecorderModal = ({
  isOpen,
  onClose,
  onSave,
  RecordingOptions,
}: RecorderModalProps) => {
  const [title, setTitle] = useState("");
  const [isRecording, setIsRecording] = useState(false);
  const [audioFilePath, setAudioFilePath] = useState<string | null>(null);

  const recorder = useAudioRecorder(
    RecordingOptions || RecordingPresets.HIGH_QUALITY,
  );

  const handleStartRecording = async () => {
    try {
      const permission = await AudioModule.requestRecordingPermissionsAsync();

      if (!permission.granted) {
        console.error("Разрешение на доступ к микрофону не предоставлено");
        return;
      }

      recorder.record();
      setIsRecording(true);
      setAudioFilePath(null);
    } catch (error) {
      console.error("Ошибка при старте записи:", error);
      setIsRecording(false);
    }
  };

  const handleStopRecording = () => {
    try {
      recorder.stop();
      setIsRecording(false);

      if (recorder.uri) {
        setAudioFilePath(recorder.uri);
      }
    } catch (error) {
      console.error("Ошибка при остановке записи:", error);
    }
  };

  const handleSave = () => {
    onSave(title, audioFilePath ?? undefined);

    setTitle("");
    setAudioFilePath(null);
    onClose();
  };

  const handleClose = () => {
    if (isRecording) {
      recorder.stop();
    }

    setTitle("");
    setAudioFilePath(null);
    setIsRecording(false);
    onClose();
  };

  return (
    <Modal visible={isOpen} animationType="slide" transparent>
      <View style={styles.overlay}>
        <View style={styles.modalContent}>
          <Text style={styles.headerTitle}>Новая аудиозапись</Text>

          <TextInput
            style={styles.input}
            placeholder="Введите название..."
            value={title}
            onChangeText={setTitle}
          />

          <View style={styles.recordControls}>
            {isRecording ? (
              <TouchableOpacity
                style={styles.stopButton}
                onPress={handleStopRecording}
              >
                <Text style={styles.buttonText}>Остановить запись</Text>
              </TouchableOpacity>
            ) : (
              <TouchableOpacity
                style={styles.recordButton}
                onPress={handleStartRecording}
              >
                <Text style={styles.buttonText}>
                  {audioFilePath ? "Перезаписать" : "Начать запись"}
                </Text>
              </TouchableOpacity>
            )}
          </View>

          {audioFilePath && !isRecording && (
            <Text style={styles.statusText}>Запись готова к сохранению</Text>
          )}

          <View style={styles.actionButtons}>
            <TouchableOpacity style={styles.cancelButton} onPress={handleClose}>
              <Text style={styles.buttonText}>Отмена</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.saveButton, !title && styles.saveButtonDisabled]}
              onPress={handleSave}
              disabled={!title}
            >
              <Text style={styles.buttonText}>Сохранить</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    width: "85%",
    backgroundColor: "white",
    borderRadius: 12,
    padding: 20,
    elevation: 5,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 16,
    textAlign: "center",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 10,
    marginBottom: 20,
  },
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
  statusText: {
    color: "#10b981",
    textAlign: "center",
    marginBottom: 20,
  },
  actionButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  cancelButton: {
    backgroundColor: "#6b7280",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
    flex: 1,
    marginRight: 10,
    alignItems: "center",
  },
  saveButton: {
    backgroundColor: "#10b981",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
    flex: 1,
    marginLeft: 10,
    alignItems: "center",
  },
  saveButtonDisabled: {
    backgroundColor: "#9ca3af",
  },
  buttonText: {
    color: "white",
    fontWeight: "bold",
  },
});

export default RecorderModal;
