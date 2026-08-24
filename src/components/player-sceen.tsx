import { Record } from "@/lib/db";
import Entypo from "@expo/vector-icons/Entypo";
import Slider from "@react-native-community/slider";
import { useAudioPlayer } from "expo-audio";
import { useEffect, useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { formatTime } from "../helpers/formatTime";

export function PlayerUI({ record, router }: { record: Record; router: any }) {
  const filePath = record.audioFilePath || "";

  const audioSource = filePath.startsWith("file://")
    ? filePath
    : `file://${filePath}`;

  const player = useAudioPlayer(audioSource);

  const [currentTime, setCurrentTime] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);

  const [isSeeking, setIsSeeking] = useState(false);

  useEffect(() => {
    if (!player) return;

    const interval = setInterval(() => {
      setIsPlaying(player.playing);

      if (!isSeeking) {
        setCurrentTime(player.currentTime);
      }
    }, 100);

    return () => clearInterval(interval);
  }, [player, isSeeking]);

  const handleTogglePlay = () => {
    if (!player) return;
    if (player.playing) {
      player.pause();
      setIsPlaying(false);
    } else {
      player.play();
      setIsPlaying(true);
    }
  };

  const handleSlidingStart = () => {
    setIsSeeking(true);
  };

  const handleSeek = (value: number) => {
    if (player) {
      player.seekTo(value);
      setCurrentTime(value);
    }
    setIsSeeking(false);
  };

  const validDuration =
    player?.duration && player.duration > 0 ? player.duration : 1;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{record.title}</Text>

      <View style={styles.sliderContainer}>
        <Text style={styles.timeText}>{formatTime(currentTime)}</Text>

        <Slider
          style={styles.slider}
          minimumValue={0}
          maximumValue={validDuration}
          value={currentTime}
          onSlidingStart={handleSlidingStart}
          onSlidingComplete={handleSeek}
          minimumTrackTintColor="#3b82f6"
          maximumTrackTintColor="#d1d5db"
          thumbTintColor="#3b82f6"
        />

        <Text style={styles.timeText}>{formatTime(player?.duration ?? 0)}</Text>
      </View>

      <View style={styles.controls}>
        <TouchableOpacity style={styles.playButton} onPress={handleTogglePlay}>
          {isPlaying ? (
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
