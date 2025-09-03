import { client, database, DATABASE_ID, HABITS_COLLECTION, RealTimeResponse } from "@/lib/appwrite";
import { useAuth } from "@/lib/auth-context";
import { Habit } from "@/types/database.type";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useEffect, useRef, useState } from "react";
import { ScrollView, StyleSheet, View } from "react-native";
import { Query } from "react-native-appwrite";
import { Swipeable } from "react-native-gesture-handler";
import { Button, Surface, Text } from "react-native-paper";

export default function Index() {
  const { signOut, user } = useAuth();

  const [habits, setHabits] = useState<Habit[]>();

  const swipeableRefs = useRef<{ [key: string]: Swipeable | null }>({});

  useEffect(() => {
      if (user) {
      const channel = `databases.${DATABASE_ID}.collections.${HABITS_COLLECTION}.documents`;
      const habitSubcription = client.subscribe(channel, (response: RealTimeResponse) => {
        if (response.events.includes("databases.*.collections.*.documents.*.create") || response.events.includes("databases.*.collections.*.documents.*.update")) {
          fetchHabits();
        }else if (response.events.includes("databases.*.collections.*.documents.*.delete")) {
          fetchHabits();
        }
      });
      fetchHabits();

      return () => {
        habitSubcription()
      }
    }
  }, [user]);

  const fetchHabits = async () => {
    try{
      const response = await database.listDocuments(DATABASE_ID, HABITS_COLLECTION, [Query.equal("user_id", user?.$id ?? "") ] );
      setHabits(response.documents as unknown as Habit[]);
    }catch(error){
      console.error("Error fetching habits:", error);
    }
  };

  const renderRightActions = () => (
    <View>
      <MaterialCommunityIcons name="check-circle-outline" size={32} color={"#51ee7bff"} />
    </View>
  )

  const renderLeftActions = () => (
    <View>
      <MaterialCommunityIcons name="trash-can-outline" size={32} color={"#dc4646ff"} />
    </View>
  )

  return (
    <View
      style={styles.container}>
      <View style={styles.header}>
        <Text variant="headlineSmall" style={styles.title}>Today's Habits</Text>
        <Button mode="text" onPress={signOut} icon={"logout"}>
          Sign Out
        </Button>
      </View> 


    <ScrollView showsVerticalScrollIndicator={false}>
      {habits?.length === 0 ? (
        
        <View style={styles.emptyState}>
          {""}
          <Text style={styles.emptyStateText}>No habits yet. Add your first habit!</Text>
        </View>
      ) : (
        
        habits?.map((habit, key) => ( 
          <Swipeable ref={(ref) => {swipeableRefs.current[habit.$id] = ref;}}
          key={key} overshootLeft={false} overshootRight={false} renderLeftActions={renderLeftActions} renderRightActions={renderRightActions}>
            <Surface key={habit.$id} style={styles.card} elevation={1}>
              <View  style={styles.cardContent}>
                <Text key={habit.$id} variant="bodyLarge" style={styles.cardTitle}>{habit.title}</Text>
                <Text variant="bodyLarge" style={styles.cardDescription}>{habit.description}</Text>
                  <View style={styles.cardFooter}>
                    <View style={styles.streakContainer}>
                    <MaterialCommunityIcons name="fire" size={18} color="#ff9800" />
                    <Text style={styles.streakText}>{habit.streak_count} Day Streak</Text>
                  </View>
                  <View style={styles.frequencyContainer}>
                    <Text style={styles.frequencyText}>{habit.frequency.charAt(0).toUpperCase() + habit.frequency.slice(1)}</Text>
                  </View>
                </View>
              </View>
              </Surface>
        </Swipeable>
        ))
      )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#f5f5f5",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 24,
    alignContent: "center",
  },
  title:{
    fontWeight: "bold",
  },
  emptyState:{
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  emptyStateText:{
    textAlign: "center",
    color: "#666666",
  },
  card:{
    marginBottom: 18,
    borderRadius: 18,
    backgroundColor: "#f7f2fa",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 1,
  },
  cardContent:{
    padding: 20,
  },
  cardTitle:{
    fontWeight: "bold",
    fontSize: 20,
    marginBottom: 4,
    color: "#22233b",
  },
  cardDescription:{
    marginTop: 4,
    fontSize: 15,
    marginBottom: 16,
    color: "#6c6c80",
  },
  cardFooter:{
    flexDirection: "row",
    justifyContent: "space-between",
    alignContent: "center",
  },
  streakContainer:{
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff3e0",
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  streakText:{
    marginLeft: 6,
    fontSize: 14,
    color: "#ff9800",
    fontWeight: "bold",
  },
  frequencyContainer:{
    backgroundColor: "#ede7f6",
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 4,
  },
  frequencyText:{
    marginLeft: 6,
    fontSize: 14,
    color: "#7c4dff",
    fontWeight: "bold",
  }


});