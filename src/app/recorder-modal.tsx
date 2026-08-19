import { AudioModule, RecordingPresets, useAudioRecorder } from "expo-audio";
import { File, Paths } from "expo-file-system";
import { useRouter } from "expo-router";
import { useState } from "react";
import {
    Text as RNText,
    StyleSheet,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";

import {
    Column,
    Text as ComposeText,
    Host,
    RadioButton,
    Row,
    useMaterialColors,
} from "@expo/ui/jetpack-compose";

import {
    fillMaxWidth,
    height,
    padding,
    selectable,
    selectableGroup,
} from "@expo/ui/jetpack-compose/modifiers";

export default function RecorderModalScreen() {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [isRecording, setIsRecording] = useState(false);
  const [audioFilePath, setAudioFilePath] = useState<string | null>(null);
  const colors = useMaterialColors();

  const [selectedQuality, setSelectedQuality] = useState<"low" | "high">(
    "high",
  );

  const qualityOptions = [
    { label: "Низкое качество записи", id: "low" },
    { label: "Высокое качество записи", id: "high" },
  ] as const;

  const recorder = useAudioRecorder(
    selectedQuality === "high"
      ? RecordingPresets.HIGH_QUALITY
      : RecordingPresets.LOW_QUALITY,
  );

  const handleStartRecording = async () => {
    try {
      const permission = await AudioModule.requestRecordingPermissionsAsync();
      if (!permission.granted) return;

      recorder.record();
      setIsRecording(true);
      setAudioFilePath(null);
    } catch (error) {
      console.error(error);
      setIsRecording(false);
    }
  };

  const handleStopRecording = () => {
    recorder.stop();
    setIsRecording(false);
    if (recorder.uri) setAudioFilePath(recorder.uri);
  };

  const handleSave = async () => {
    try {
      let finalAudioPath = null;
      if (audioFilePath) {
        const fileName = `audio_${Date.now()}.m4a`;
        const sourceFile = new File(audioFilePath);
        const destinationFile = new File(Paths.document, fileName);
        await sourceFile.move(destinationFile);
        finalAudioPath = destinationFile.uri;
      }

      console.log("Сохраняем:", title, finalAudioPath);
      setTitle("");
      setAudioFilePath(null);
      router.back();
    } catch (error) {
      console.error(error);
    }
  };

  const handleClose = () => {
    if (isRecording) recorder.stop();
    setTitle("");
    setAudioFilePath(null);
    setIsRecording(false);
    router.back();
  };

  return (
    <View style={styles.overlay}>
      <View style={styles.modalContent}>
        <RNText style={styles.headerTitle}>Новая аудиозапись</RNText>

        <TextInput
          style={styles.input}
          placeholder="Введите название..."
          value={title}
          onChangeText={setTitle}
        />

        <View style={styles.qualityContainer}>
          <RNText style={styles.qualityLabel}>Качество записи:</RNText>

          <Host matchContents>
            <Column modifiers={[selectableGroup()]}>
              {qualityOptions.map((opt) => (
                <Row
                  key={opt.id}
                  verticalAlignment="center"
                  modifiers={[
                    fillMaxWidth(),
                    height(48),
                    selectable(
                      opt.id === selectedQuality,
                      () => {
                        if (!isRecording) setSelectedQuality(opt.id);
                      },
                      "radioButton",
                    ),
                  ]}
                >
                  <RadioButton selected={opt.id === selectedQuality} />

                  <ComposeText
                    color={colors.onSurface}
                    modifiers={[padding(16, 0, 0, 0)]}
                  >
                    {opt.label}
                  </ComposeText>
                </Row>
              ))}
            </Column>
          </Host>
        </View>

        <View style={styles.recordControls}>
          {isRecording ? (
            <TouchableOpacity
              style={styles.stopButton}
              onPress={handleStopRecording}
            >
              <RNText style={styles.buttonText}>Остановить запись</RNText>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity
              style={styles.recordButton}
              onPress={handleStartRecording}
            >
              <RNText style={styles.buttonText}>
                {audioFilePath ? "Перезаписать" : "Начать запись"}
              </RNText>
            </TouchableOpacity>
          )}
        </View>

        {audioFilePath && !isRecording && (
          <RNText style={styles.statusText}>Запись готова к сохранению</RNText>
        )}

        <View style={styles.actionButtons}>
          <TouchableOpacity style={styles.cancelButton} onPress={handleClose}>
            <RNText style={styles.buttonText}>Отмена</RNText>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.saveButton,
              (!title || !audioFilePath) && styles.saveButtonDisabled,
            ]}
            onPress={handleSave}
            disabled={!title || !audioFilePath}
          >
            <RNText style={styles.buttonText}>Сохранить</RNText>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

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
  qualityContainer: {
    marginBottom: 20,
  },
  qualityLabel: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 8,
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
