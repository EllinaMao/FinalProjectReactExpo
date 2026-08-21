import { AudioModule, RecordingPresets, useAudioRecorder } from "expo-audio";
import { File, Paths } from "expo-file-system";
import { useRouter } from "expo-router";
import { useState } from "react";
import { StyleSheet, Text, TextInput, View } from "react-native";

import { ActionButtons } from "@/components/action-buttons";
import { QualityOption, QualitySelector } from "@/components/quality-selector";
import { RecordControls } from "@/components/record-controls";
import { dbManager } from "@/lib/db";

export default function RecorderModalScreen() {
  const router = useRouter();
  
  const [title, setTitle] = useState("");
  const [isRecording, setIsRecording] = useState(false);
  const [audioFilePath, setAudioFilePath] = useState<string | null>(null);
  const [selectedQuality, setSelectedQuality] = useState<QualityOption>("high");

  const recorder = useAudioRecorder(
    selectedQuality === "high"
      ? RecordingPresets.HIGH_QUALITY
      : RecordingPresets.LOW_QUALITY
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
      await dbManager.addRecord(title, finalAudioPath);

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
        <Text style={styles.headerTitle}>Новая аудиозапись</Text>

        <TextInput
          style={styles.input}
          placeholder="Введите название..."
          value={title}
          onChangeText={setTitle}
        />

        <QualitySelector
          selectedQuality={selectedQuality}
          onSelect={setSelectedQuality}
          disabled={isRecording}
        />

        <RecordControls
          isRecording={isRecording}
          hasAudio={!!audioFilePath}
          onStart={handleStartRecording}
          onStop={handleStopRecording}
        />

        {audioFilePath && !isRecording && (
          <Text style={styles.statusText}>Запись готова к сохранению</Text>
        )}

        <ActionButtons
          onCancel={handleClose}
          onSave={handleSave}
          saveDisabled={!title || !audioFilePath} 
        />
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
  statusText: {
    color: "#10b981",
    textAlign: "center",
    marginBottom: 20,
  },
});