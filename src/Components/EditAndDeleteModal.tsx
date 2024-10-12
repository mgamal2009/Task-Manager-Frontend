import {
  Modal,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
  StyleSheet,
} from "react-native";
import {responsiveHeight, responsiveWidth} from "../../constants/responsiveFont";
import colors from "../../constants/colors";
import Icon from "react-native-remix-icon";

const EditAndDeleteModal = ({editModal, toggleEditModal,toggleEditTaskModal,toggleDeleteTaskModal}) => {
  return (
    <Modal
      visible={editModal}
      transparent={true}
      animationType="fade"
      onRequestClose={toggleEditModal}
    >
      <TouchableWithoutFeedback onPress={toggleEditModal}>
        <View style={styles.modalBackground}>
          <TouchableWithoutFeedback>
            <View style={styles.popupContainer}>
              <TouchableOpacity activeOpacity={0.8} style={styles.editContainer} onPress={()=> {
                toggleEditModal()
                toggleEditTaskModal()
              }}>
                <Text style={styles.editText}>Edit task</Text>
                <Icon name={'edit-line'} size={responsiveWidth(24)} color={colors.darkGrey}/>
              </TouchableOpacity>
              <View style={styles.lineBreak}/>
              <TouchableOpacity activeOpacity={0.8} style={styles.editContainer} onPress={()=>{
                toggleEditModal()
                toggleDeleteTaskModal()
              }}>
                <Text style={styles.editText}>Delete task</Text>
                <Icon name={'delete-bin-2-line'} size={responsiveWidth(24)} color={colors.delete}/>
              </TouchableOpacity>
            </View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  )
}
const styles = StyleSheet.create({
  modalBackground: {
    flex: 1,
    backgroundColor: colors.background,
    justifyContent: "flex-end",
  },
  popupContainer: {
    backgroundColor: colors.white,
    marginBottom: responsiveHeight(32),
    marginHorizontal: responsiveWidth(24),
    borderRadius: responsiveWidth(24),
    paddingHorizontal: responsiveWidth(24),
  },
  lineBreak: {
    borderWidth: 1,
    borderColor: colors.lightGrey
  },
  editContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: responsiveWidth(24),

  },
  editText: {
    fontSize: responsiveWidth(18),
    fontFamily: 'montserrat-semiBold',

  },
})
export default EditAndDeleteModal