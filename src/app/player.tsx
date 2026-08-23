import { dbManager, Record } from "@/lib/db";
import AntDesign from "@expo/vector-icons/AntDesign";
import Entypo from "@expo/vector-icons/Entypo";
import Slider from "@react-native-community/slider";
import { setAudioModeAsync, useAudioPlayer } from "expo-audio";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { formatTime } from "../helpers/formatTime";

function PlayerUI({ record, router }: { record: Record; router: any }) {
  let audioSource = "";
  if (record.audioFilePath) {
    audioSource = record.audioFilePath.startsWith("file://")
      ? record.audioFilePath
      : `file://${record.audioFilePath}`;
  } else {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.errorText}>Файл не найден</Text>
        <TouchableOpacity
          style={styles.closeButton}
          onPress={() => router.back()}
        >
          <AntDesign name="rollback" size={24} color="black" />
        </TouchableOpacity>
      </View>
    );
  }

  const player = useAudioPlayer(audioSource);

  const handleTogglePlay = () => {
    if (!player) return;
    if (player.playing) {
      player.pause();
    } else {
      player.play();
    }
  };

  const handleSeek = (value: number) => {
    if (player) {
      player.seekTo(value);
    }
  };

  const validDuration =
    player?.duration && player.duration > 0 ? player.duration : 1;
  return (
    <View style={styles.container}>
      <Text style={styles.title}>{record.title}</Text>

      <View style={styles.sliderContainer}>
        <Text style={styles.timeText}>
          {formatTime(player?.currentTime ?? 0)}
        </Text>

        <Slider
          style={styles.slider}
          minimumValue={0}
          maximumValue={validDuration}
          value={player?.currentTime ?? 0}
          onSlidingComplete={handleSeek}
          minimumTrackTintColor="#3b82f6"
          maximumTrackTintColor="#d1d5db"
          thumbTintColor="#3b82f6"
        />

        <Text style={styles.timeText}>{formatTime(player?.duration ?? 0)}</Text>
      </View>

      <View style={styles.controls}>
        <TouchableOpacity style={styles.playButton} onPress={handleTogglePlay}>
          {player?.playing ? (
            <Entypo name="controller-paus" size={28} color="#ffffff" />
          ) : (
            <Entypo name="controller-play" size={28} color="#ffffff" />
          )}
        </TouchableOpacity>
      </View>

      <TouchableOpacity
        style={styles.closeButton}
        onPress={() => router.back()}
      >
        <Text style={styles.closeButtonText}>Закрыть</Text>
      </TouchableOpacity>
    </View>
  );
}

export default function PlayerScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();

  const [record, setRecord] = useState<Record | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchRecord = async () => {
      if (!id) return;
      try {
        const data = await dbManager.getRecordById(id);
        setRecord(data);
      } catch (error) {
        console.error("Ошибка при получении записи:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchRecord();
  }, [id]);

  useEffect(() => {
    const setupAudio = async () => {
      try {
        await setAudioModeAsync({
          playsInSilentMode: true,
        });
      } catch (e) {
        console.error("Ошибка при настройке аудио-режима:", e);
      }
    };
    setupAudio();
  }, []);

  if (isLoading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#3b82f6" />
      </View>
    );
  }

  if (!record || !record.audioFilePath) {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.errorText}>Файл не найден</Text>
        <TouchableOpacity
          style={styles.closeButton}
          onPress={() => router.back()}
        >
          <AntDesign name="rollback" size={24} color="black" />
        </TouchableOpacity>
      </View>
    );
  }

  return <PlayerUI record={record} router={router} />;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#ffffff",
    justifyContent: "center",
    alignItems: "center",
  },
  centerContainer: {
    flex: 1,
    backgroundColor: "#ffffff",
    justifyContent: "center",
    alignItems: "center",
  },
  errorText: {
    fontSize: 18,
    color: "#ef4444",
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 40,
    textAlign: "center",
    color: "#1f2937",
  },
  sliderContainer: {
    flexDirection: "row",
    alignItems: "center",
    width: "100%",
    marginBottom: 40,
    paddingHorizontal: 10,
  },
  slider: {
    flex: 1,
    marginHorizontal: 15,
    height: 40,
  },
  timeText: {
    fontSize: 14,
    color: "#6b7280",
    fontVariant: ["tabular-nums"],
  },
  controls: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 30,
  },
  playButton: {
    backgroundColor: "#3b82f6",
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 30,
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    justifyContent: "center",
    alignItems: "center",
    minWidth: 80,
  },
  closeButton: {
    padding: 10,
  },
  closeButtonText: {
    color: "#9ca3af",
    fontSize: 16,
    fontWeight: "600",
  },
});
