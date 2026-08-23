import {
  AudioModule,
  RecordingPresets,
  setAudioModeAsync,
  useAudioRecorder,
} from "expo-audio";
import { File, Paths } from "expo-file-system";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { StyleSheet, Text, TextInput, View } from "react-native";

import { ActionButtons } from "@/components/action-buttons";
import { RecordControls } from "@/components/record-controls";
import * as Crypto from "expo-crypto";
import { QualityOption, QualitySelector } from "../components/quality-selector";
import { formatTime } from "../helpers/formatTime";
import { dbManager } from "../lib/db";

export default function RecorderModalScreen() {
  const router = useRouter();

  const [title, setTitle] = useState("");
  const [isRecording, setIsRecording] = useState(false);
  const [selectedQuality, setSelectedQuality] = useState<QualityOption>("high");
  const [recordDuration, setRecordDuration] = useState(0);
  const [audioLength, setAudioLength] = useState<number | null>(null);

  const recorder = useAudioRecorder(
    selectedQuality === "high"
      ? RecordingPresets.HIGH_QUALITY
      : RecordingPresets.LOW_QUALITY,
  );

  useEffect(() => {
    let interval: ReturnType<typeof setInterval>;
    if (isRecording) {
      interval = setInterval(() => {
        setRecordDuration((prev) => prev + 1);
      }, 1000);
    } else {
      setAudioLength(recordDuration);
      setRecordDuration(0);
    }
    return () => clearInterval(interval);
  }, [isRecording]);

  // const formatTime = (seconds: number) => {
  //   const m = Math.floor(seconds / 60)
  //     .toString()
  //     .padStart(2, "0");
  //   const s = (seconds % 60).toString().padStart(2, "0");
  //   return `${m}:${s}`;
  // };

  const handleStartRecording = async () => {
    try {
      const permission = await AudioModule.requestRecordingPermissionsAsync();
      if (!permission.granted) {
        console.error("Нет прав на микрофон!");
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
  };

  const handleSave = async () => {
    try {
      let TitleNew = Crypto.randomUUID();
      if (!title) {
        setTitle(`Audio ${TitleNew}`);
      }

      const currentUri = recorder.uri;
      if (!currentUri) {
        console.error("Попытка сохранить, но файл еще не готов!");
        return;
      }

      const fileName = `audio_${TitleNew}.m4a`;
      const sourceFile = new File(currentUri);
      const destinationFile = new File(Paths.document, fileName);

      await sourceFile.move(destinationFile);

      console.log("Сохраняем в БД путь:", destinationFile.uri);
      await dbManager.addRecord(title, destinationFile.uri, audioLength);

      setTitle("");
      setAudioLength(null);
      router.back();
    } catch (error) {
      console.error("Ошибка при сохранении:", error);
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

        {isRecording && (
          <View style={styles.timerContainer}>
            <Text style={styles.timerText}>
              Идет запись: {formatTime(recordDuration)}
            </Text>
          </View>
        )}

        <RecordControls
          isRecording={isRecording}
          hasAudio={!!recorder.uri}
          onStart={handleStartRecording}
          onStop={handleStopRecording}
        />

        {recorder.uri && !isRecording && (
          <Text style={styles.statusText}>Запись готова к сохранению</Text>
        )}

        <ActionButtons
          onCancel={handleClose}
          onSave={handleSave}
          saveDisabled={!title || !recorder.uri}
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
  timerContainer: {
    alignItems: "center",
    marginBottom: 16,
  },
  timerText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#ef4444",
  },
});
