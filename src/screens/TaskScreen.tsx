import {
  Text,
  View,
  StyleSheet,
  TouchableOpacity,
  ScrollView
} from "react-native";
import colors from "../../constants/colors";
import {responsiveHeight, responsiveWidth} from "../../constants/responsiveFont";
import {useState} from "react";
import {CalendarRemove} from "iconsax-react-native";
import {Entypo} from '@expo/vector-icons';
import AddTaskModal from "../Components/AddTaskModal";
import EditAndDeleteModal from "../Components/EditAndDeleteModal";
import DeleteTaskModal from "../Components/DeleteTaskModal";
import RemixIcon from "react-native-remix-icon";
import {formatDateTime} from "../Utils/formatDateTime";

const TaskScreen = ({navigation, route}) => {
  const [editModal, setEditModal] = useState(false)
  const [editTaskModal, setEditTaskModal] = useState(false)
  const [deleteTaskModal, setDeleteTaskModal] = useState(false)

  const toggleEditModal = () => {
    setEditModal(!editModal);
  };
  const toggleEditTaskModal = () => {
    setEditTaskModal(!editTaskModal);
  };
  const toggleDeleteTaskModal = () => {
    setDeleteTaskModal(!deleteTaskModal);
  };
  const handleBack = () => {
    navigation.goBack();
  }

  const {task} = route.params;
  const [currentTask, setCurrentTask] = useState(task)
  return (
    <View style={styles.container}>
      <ScrollView>
        <View style={styles.backRow}>
          <TouchableOpacity activeOpacity={0.8} onPress={handleBack}>
            <RemixIcon style={styles.backIcon} name={'arrow-left-line'} size={responsiveWidth(24)}
                       color={colors.black}/>
          </TouchableOpacity>
          <Text style={styles.title}>Task Details</Text>
        </View>
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <View style={styles.taskDeadLine}>
              <CalendarRemove size={responsiveWidth(16)} color={colors.orange}/>
              <Text style={styles.date}>{formatDateTime(currentTask.dueDate)}</Text>
            </View>
            <TouchableOpacity activeOpacity={0.8} onPress={toggleEditModal}>
              <Entypo name={"dots-three-horizontal"} size={24} color={colors.darkGrey}/>
            </TouchableOpacity>
          </View>
          <View style={styles.cardCat}>
            <View
              style={[styles.cat, {backgroundColor: colors[currentTask.description.toLowerCase()] || colors.backend}]}>
              <Text style={styles.text}>{currentTask.category.toUpperCase()}</Text>
            </View>
            <View style={[styles.cat, {backgroundColor: colors[currentTask.priority.toLowerCase()] || colors.low}]}>
              <Text style={styles.text}>{currentTask.priority.toUpperCase()}</Text>
            </View>
          </View>
          <Text style={styles.taskTitle}>{currentTask.title}</Text>
        </View>
        <View style={styles.card}>
          <Text style={styles.taskDescription}>Description</Text>
          <Text style={styles.descContent}>{currentTask.description}</Text>
        </View>
        <View style={styles.card}>
          <Text style={styles.subTask}>Sub-tasks</Text>
          <View style={styles.subTaskRow}>
            <Text style={styles.subTaskTitle}>
              Landing page - Mobile Version
            </Text>
            <View style={styles.subTaskStatus}>
              <Text style={styles.subTaskStatusText}>Done</Text>
            </View>
          </View>
          <View style={styles.subTaskRow}>
            <Text style={styles.subTaskTitle}>
              Landing page - Mobile Version
            </Text>
            <View style={styles.subTaskStatus}>
              <Text style={styles.subTaskStatusText}>Done</Text>
            </View>
          </View>
          <View style={styles.addSubTask}>
            <Text style={styles.addSubTitle}>Add Sub Task</Text>
            <RemixIcon name={'add-fill'} color={colors.black} size={responsiveWidth(24)}/>
          </View>
        </View>
        <EditAndDeleteModal editModal={editModal} toggleEditModal={() => toggleEditModal()}
                            toggleEditTaskModal={() => toggleEditTaskModal()}
                            toggleDeleteTaskModal={() => toggleDeleteTaskModal()}/>
        <AddTaskModal navigation={navigation} addTaskModal={editTaskModal}
                      toggleAddTaskModal={() => toggleEditTaskModal()} edit={true} task={currentTask}
                      setCurrentTask={(task) => setCurrentTask(task)}/>
        <DeleteTaskModal navigation={navigation} deleteTaskModal={deleteTaskModal} toggleDeleteTaskModal={() => toggleDeleteTaskModal()} task={currentTask} taskScreen={true}/>
      </ScrollView>
    </View>
  )
}
const styles = StyleSheet.create({
  addSubTitle: {
    fontSize: responsiveWidth(14),
    fontWeight: '700',
  },
  descContent: {
    color: colors.medGrey,
    fontSize: responsiveWidth(14),

  },
  taskDescription: {
    color: colors.black,
    fontSize: responsiveWidth(12),
    marginBottom: responsiveHeight(24),
    fontWeight: '600',
  },
  addSubTask: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: colors.subTaskBack,
    borderStyle: 'dashed',
    borderWidth: 1,
    borderColor: colors.darkGrey,
    paddingHorizontal: responsiveWidth(16),
    paddingVertical: responsiveHeight(12),
    borderRadius: 16,
    marginTop: responsiveHeight(8),
  },
  subTaskStatusText: {
    fontFamily: 'montserrat-medium',

  },
  subTaskStatus: {
    backgroundColor: colors.lightGreen,
    paddingHorizontal: responsiveWidth(16),
    paddingVertical: responsiveHeight(8),
    borderRadius: 4,
  },
  subTaskTitle: {
    fontSize: responsiveWidth(14),
    width: responsiveWidth(200),
    color: colors.darkBlue,

  },
  subTaskRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: responsiveHeight(16),
  },
  subTask: {
    color: colors.black,
    fontSize: responsiveWidth(12),
    marginBottom: responsiveHeight(16),
    fontWeight: '600',
  },
  cat: {
    paddingVertical: responsiveHeight(6),
    paddingHorizontal: responsiveWidth(20),
    marginRight: responsiveWidth(4),
    borderRadius: responsiveWidth(4),
  },
  cardCat: {
    flexDirection: 'row',
  },
  text: {
    color: colors.black,
    fontFamily: 'montserrat-medium',
    fontSize: responsiveWidth(12),
  },

  taskTitle: {
    fontFamily: 'montserrat-semiBold',
    fontSize: responsiveWidth(18),
    marginTop: responsiveHeight(24),
    color: colors.black,

  },
  taskDeadLine: {
    flexDirection: "row",
    alignItems: "center",
    fontSize: responsiveWidth(12),
  },
  date: {
    marginLeft: responsiveWidth(8),
  },
  cardHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: responsiveHeight(24),
  },
  card: {
    borderRadius: responsiveWidth(16),
    borderColor: colors.grey,
    borderWidth: 1,
    padding: responsiveWidth(16),
    marginBottom: responsiveHeight(16),
  },
  title: {
    color: colors.black,
    fontFamily: 'montserrat-semiBold',
    fontSize: responsiveWidth(18),
    marginLeft: responsiveHeight(16),
  },
  backIcon: {
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#F6F6F6',
  },
  backRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: responsiveHeight(24),
  },

  container: {
    flex: 1,
    marginHorizontal: responsiveWidth(24),
    marginTop: responsiveHeight(90),
  },
})
export default TaskScreen;