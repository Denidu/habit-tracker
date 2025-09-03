import { database, DATABASE_ID, HABITS_COLLECTION } from "@/lib/appwrite";
import { useAuth } from "@/lib/auth-context";
import { useRouter } from "expo-router";
import { useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import { ID } from "react-native-appwrite";
import { Button, SegmentedButtons, TextInput, useTheme } from "react-native-paper";

const FREQUENCIES = ["daily", "weekly", "monthly"];
type Frequency = typeof FREQUENCIES[number];

export default function AddHabitScreen() {
    const [title, setTitle] = useState<string>("");
    const [description, setDescription] = useState<string>("");
    const [frequency, setFrequency] = useState<Frequency>("daily");
    const { user } = useAuth();
    const router = useRouter();
    const { colors } = useTheme();
    const [error, setError] = useState<string | null>(null);

    const handleAddHabit = async() => {
        if (!user) return;

        try {
            await database.createDocument(DATABASE_ID, HABITS_COLLECTION, ID.unique(), {
                user_id: user.$id,
                title,
                description,
                frequency,
                streak_count: 0,
                last_completed: new Date().toISOString()
            });
            router.back();
        } catch (error) {
            console.error("Error adding habit:", error);
        }
    }

    return (
        <View style={styles.container}>
            <TextInput label="Title" mode="outlined" style={styles.input} value={title} onChangeText={setTitle} />
            <TextInput label="Description" mode="outlined" style={styles.input} value={description} onChangeText={setDescription} />
            <View style={styles.frequencyContainer}>
          <SegmentedButtons onValueChange={(value) => setFrequency(value as Frequency)} value={frequency} buttons={FREQUENCIES.map((freq) => (
              { value: freq, label: freq.charAt(0).toUpperCase() + freq.slice(1) }
          ))} style={styles.segmentedButtons} />
        </View>
        <Button mode="contained" disabled={!title || !description} onPress={handleAddHabit}>
            <Text>Add Habit</Text>
        </Button>
        {error && <Text style={{ color: colors.error }}>{error}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#fff",
    justifyContent: "center"
  },
  input: {
    marginBottom: 8,
  },
  frequencyContainer: {
    marginBottom: 24
  },
  segmentedButtons: {
    marginTop: 16
  },
});
