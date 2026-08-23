import Entypo from "@expo/vector-icons/Entypo";
import Slider from "@react-native-community/slider";
import { useAudioPlayer } from "expo-audio";
import { useLocalSearchParams, useRouter } from "expo-router";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { formatTime } from "../helpers/formatTime";

export default function PlayerScreen() {
  const router = useRouter();

  const { title, uri } = useLocalSearchParams<{ title: string; uri: string }>();
  const player = useAudioPlayer(uri);

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

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{title}</Text>

      <View style={styles.sliderContainer}>
        <Text style={styles.timeText}>
          {formatTime(player?.currentTime ?? 0)}
        </Text>

        <Slider
          style={styles.slider}
          minimumValue={0}
          maximumValue={player?.duration ?? 1}
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
          <Text style={styles.playButtonText}>
            {player?.playing ? (
              <Entypo name="controller-paus" size={24} color="black" />
            ) : (
              <Entypo name="controller-play" size={24} color="black" />
            )}
          </Text>
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
  },
  playButtonText: {
    color: "#ffffff",
    fontSize: 18,
    fontWeight: "bold",
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
