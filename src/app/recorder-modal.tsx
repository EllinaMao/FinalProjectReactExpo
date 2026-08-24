import {
  AudioModule,
  RecordingPresets,
  setAudioModeAsync,
  useAudioRecorder,
} from "expo-audio";
import * as Crypto from "expo-crypto";
import { File, Paths } from "expo-file-system";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { Alert, StyleSheet, Text, View } from "react-native";

import { ActionButtons } from "@/components/action-buttons";
import { RecordControls } from "@/components/record-controls";
import { SaveRecordModal } from "@/components/ui/saveModal";
import { generateDefaultTitle } from "@/helpers/generate-default-title";
import { QualityOption, QualitySelector } from "../components/quality-selector";
import { formatTime } from "../helpers/formatTime";
import { Category, dbManager } from "../lib/db";

export default function RecorderModalScreen() {
  const router = useRouter();

  const [title, setTitle] = useState("");

  const [categoryIds, setCategoryIds] = useState<string[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);

  const [isRecording, setIsRecording] = useState(false);
  const [selectedQuality, setSelectedQuality] = useState<QualityOption>("high");
  const [recordDuration, setRecordDuration] = useState(0);
  const [audioLength, setAudioLength] = useState<number | null>(null);

  const [isSaveDialogVisible, setIsSaveDialogVisible] = useState(false);

  const recorder = useAudioRecorder(
    selectedQuality === "high"
      ? RecordingPresets.HIGH_QUALITY
      : RecordingPresets.LOW_QUALITY,
  );

  useEffect(() => {
    const loadCategories = async () => {
      try {
        const cats = await dbManager.getAllCategories();
        setCategories(cats);
      } catch (error) {
        console.error("Ошибка при загрузке категорий:", error);
      }
    };
    loadCategories();
  }, []);

  useEffect(() => {
    let interval: ReturnType<typeof setInterval>;
    if (isRecording) {
      setRecordDuration(0);
      setAudioLength(null);

      interval = setInterval(() => {
        setRecordDuration((prev) => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isRecording]);

  const handleStartRecording = async () => {
    try {
      const permission = await AudioModule.requestRecordingPermissionsAsync();
      if (!permission.granted) {
        console.error("Нет разрешения на микрофон!");
      }

      await setAudioModeAsync({
        playsInSilentMode: true,
        allowsRecording: true,
      });

      await recorder.prepareToRecordAsync();
      recorder.record();
      setIsRecording(true);
    } catch (error) {
      console.error("Ошибка старта:", error);
      setIsRecording(false);
    }
  };

  const handleStopRecording = () => {
    recorder.stop();
    setIsRecording(false);
    setAudioLength(recordDuration);
  };

  const handleOpenSaveDialog = () => {
    if (!title.trim()) {
      setTitle(generateDefaultTitle());
    }
    setIsSaveDialogVisible(true);
  };

  const handleSave = async () => {
    try {
      let finalTitle = title.trim();
      if (!finalTitle) {
        finalTitle = generateDefaultTitle();
      }

      const currentUri = recorder.uri;
      if (!currentUri) {
        return;
      }

      const fileName = `audio_${Crypto.randomUUID()}.m4a`;
      const sourceFile = new File(currentUri);
      const destinationFile = new File(Paths.document, fileName);

      await sourceFile.move(destinationFile);
      await dbManager.addRecord(
        finalTitle,
        destinationFile.uri,
        audioLength,
        categoryIds,
      );
      setTitle("");
      setAudioLength(null);
      setCategoryIds([]);
      setIsSaveDialogVisible(false);
      router.back();
    } catch (error) {
      console.error("Ошибка при сохранении:", error);
      Alert.alert("Ошибка", "Не удалось сохранить запись");
    }
  };

  const handleClose = () => {
    if (isRecording) recorder.stop();
    setTitle("");
    router.back();
  };

  return (
    <View style={styles.overlay}>
      <View style={styles.modalContent}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Запись аудио</Text>
        </View>

        <QualitySelector
          selectedQuality={selectedQuality}
          onSelect={setSelectedQuality}
          disabled={isRecording}
        />

        <View style={styles.centerSection}>
          <Text
            style={[styles.timerText, isRecording && styles.timerTextActive]}
          >
            {formatTime(recordDuration)}
          </Text>

          {recorder.uri && !isRecording && recordDuration > 0 && (
            <Text style={styles.statusText}>Запись готова</Text>
          )}

          <RecordControls
            isRecording={isRecording}
            hasAudio={!!recorder.uri}
            onStart={handleStartRecording}
            onStop={handleStopRecording}
          />
        </View>

        <ActionButtons
          onCancel={handleClose}
          onSave={handleOpenSaveDialog}
          saveDisabled={!recorder.uri || isRecording}
        />
      </View>

      <SaveRecordModal
        visible={isSaveDialogVisible}
        title={title}
        categoryIds={categoryIds}
        categories={categories}
        onTitleChange={setTitle}
        onCategoryChange={setCategoryIds}
        onCancel={() => setIsSaveDialogVisible(false)}
        onSave={handleSave}
      />
    </View>
  );
}
const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.4)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    width: "90%",
    backgroundColor: "#ffffff",
    borderRadius: 24,
    padding: 24,
    minHeight: 420,
    justifyContent: "space-between",
    elevation: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.1,
    shadowRadius: 15,
  },
  header: {
    alignItems: "center",
    marginBottom: 20,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: "800",
    color: "#111827",
  },
  centerSection: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  timerText: {
    fontSize: 48,
    fontWeight: "300",
    fontVariant: ["tabular-nums"],
    color: "#374151",
    marginBottom: 8,
  },
  timerTextActive: {
    color: "#ef4444",
    fontWeight: "500",
  },
  statusText: {
    color: "#10b981",
    fontSize: 14,
    fontWeight: "600",
    textTransform: "uppercase",
    letterSpacing: 1,
  },
});
