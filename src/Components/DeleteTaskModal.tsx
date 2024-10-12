import {
  Modal,
  Text,
  View,
  StyleSheet,
  ScrollView, TouchableOpacity, Alert
} from "react-native";
import {responsiveHeight, responsiveWidth} from "../../constants/responsiveFont";
import colors from "../../constants/colors";
import {CalendarRemove} from "iconsax-react-native";
import RemixIcon from "react-native-remix-icon";
import {useMutation, useQueryClient} from "@tanstack/react-query";
import {deleteTask, updateTask} from "../Hooks/TaskApi";
import {formatDateTime} from "../Utils/formatDateTime";

const DeleteTaskModal = ({navigation, deleteTaskModal, toggleDeleteTaskModal, task, taskScreen = false}) => {
  const queryClient = useQueryClient();

  const {mutateAsync: useDeleteTask} = useMutation({
    mutationFn: deleteTask,
    onSuccess: () => {
      queryClient.invalidateQueries({queryKey: ["tasks"]});
    },
  });
  const handleApply = async () => {
    try {
      await useDeleteTask(
        task.id
        , {
          onSuccess: () => {
            toggleDeleteTaskModal();

            setTimeout(() => {
              if (taskScreen) {
                navigation.reset({
                  index: 0,
                  routes: [{ name: 'Home' }],
                });
              }
            }, 200);
          },
        })
    } catch (error) {
      if (error.response.data.errors) {
        const message = error.response.data.errors.map(err => {
          return Object.values(err)
        });
        Alert.alert(message.join('\n'));
      } else if (error.response.data === "Invalid token") {
        navigation.reset({
          index: 0,
          routes: [{name: 'Login'}],
        });

      } else {
        Alert.alert(error.response.data.message);
      }
    }
  }
  const handleCancel = () => {
    toggleDeleteTaskModal()
  }
  return (
    <Modal
      visible={deleteTaskModal}
      transparent={true}
      animationType="fade"
      onRequestClose={toggleDeleteTaskModal}
    >
      <View style={styles.modalBackground}>
        <View style={styles.popupContainer}>
          <ScrollView style={{flex: 1}} showsVerticalScrollIndicator={true}>
            <Text style={styles.deleteText}>Delete Task</Text>
            <Text style={styles.confirm}>Are you sure you want to delete the task</Text>
            <View style={styles.card}>
              <View style={styles.taskDeadLine}>
                <CalendarRemove size={responsiveWidth(16)} color={colors.orange}/>
                <Text style={styles.date}>{formatDateTime(task.dueDate)}</Text>
              </View>
              <View style={styles.cardCat}>
                <View style={[styles.cat, {backgroundColor: colors[task.description.toLowerCase()] || colors.backend}]}>
                  <Text style={styles.text}>{task.category.toUpperCase()}</Text>
                </View>
                <View style={[styles.cat, {backgroundColor: colors[task.priority.toLowerCase()] || colors.low}]}>
                  <Text style={styles.text}>{task.priority.toUpperCase()}</Text>
                </View>
              </View>
              <Text style={styles.taskTitle}>{task.title}</Text>
            </View>
            <View style={styles.card}>
              <Text style={styles.taskDescription}>Description</Text>
              <Text style={styles.descContent} numberOfLines={6}>{task.description}</Text>
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
            <TouchableOpacity activeOpacity={0.8} style={styles.button} onPress={handleApply}>
              <Text style={styles.buttonText}>Confirm</Text>
            </TouchableOpacity>
            <TouchableOpacity activeOpacity={0.8} style={styles.cancel} onPress={handleCancel}>
              <Text style={styles.cancelText}>Cancel</Text>
            </TouchableOpacity>
          </ScrollView>
        </View>
      </View>
    </Modal>
  )
}
const styles = StyleSheet.create({
  addSubTitle: {
    fontSize: responsiveWidth(14),
    fontWeight: '700',
  },
  cancel: {
    alignItems: 'center',
    marginBottom: responsiveHeight(24),
    borderRadius: 16,
    backgroundColor: colors.primary,
    paddingVertical: responsiveHeight(18)

  },
  cancelText: {
    color: colors.white,
    fontWeight: '600',
    fontSize: responsiveWidth(16),
  },
  button: {
    alignItems: 'center',
    marginTop: responsiveHeight(32),
    marginBottom: responsiveHeight(16),
    borderRadius: 16,
    borderColor: colors.orange,
    borderWidth: 1,
    paddingVertical: responsiveHeight(18)
  },
  buttonText: {
    color: colors.orange,
    fontWeight: '600',
    fontSize: responsiveWidth(16),
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
  descContent: {
    color: colors.medGrey,
    fontSize: responsiveWidth(14),

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
  taskDescription: {
    color: colors.black,
    fontSize: responsiveWidth(12),
    marginBottom: responsiveHeight(24),
    fontWeight: '600',
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
    marginBottom: responsiveHeight(24),
  },
  date: {
    marginLeft: responsiveWidth(8),
  },
  card: {
    borderRadius: responsiveWidth(16),
    borderColor: colors.grey,
    borderWidth: 1,
    padding: responsiveWidth(16),
    marginBottom: responsiveHeight(16),
  },
  confirm: {
    color: colors.black,
    fontFamily: 'montserrat-semiBold',
    fontSize: responsiveWidth(24),
    marginBottom: responsiveHeight(36),
  },
  deleteText: {
    color: colors.orange,
    fontFamily: 'montserrat-semiBold',
    fontSize: responsiveWidth(16),
    marginBottom: responsiveHeight(16),
    marginTop: responsiveHeight(32),
  },
  modalBackground: {
    flex: 1,
    backgroundColor: colors.background,
    justifyContent: "flex-end",
  },
  popupContainer: {
    backgroundColor: colors.white,
    borderRadius: responsiveWidth(24),
    paddingHorizontal: responsiveWidth(16),
    margin: responsiveWidth(24),
    marginTop: responsiveHeight(48),
    flex: 1,
  },
})
export default DeleteTaskModal