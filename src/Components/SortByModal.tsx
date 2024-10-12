import {Modal, Text, TouchableOpacity, TouchableWithoutFeedback, View, StyleSheet} from "react-native";
import Icon from "react-native-remix-icon";
import {responsiveHeight, responsiveWidth} from "../../constants/responsiveFont";
import colors from "../../constants/colors";
import {Octicons} from "@expo/vector-icons";
import {useState} from "react";

const SortByModal = ({sortByModal, toggleSortByModal, onSortChange, sortCriteria}) => {
  const [criteria, setCriteria] = useState('')
  const handleApply = (criteria) => {
    onSortChange(criteria);
  }
  const handleCancel = () => {
    toggleSortByModal()
  }
  return (
    <Modal
      visible={sortByModal}
      transparent={true}
      animationType="fade"
      onRequestClose={toggleSortByModal}
    >
      <TouchableWithoutFeedback onPress={toggleSortByModal}>
        <View style={styles.modalBackground}>
          <TouchableWithoutFeedback>
            <View style={styles.popupContainer}>
              <View style={styles.lineBreak}/>
              <Text style={styles.filterText}>Sort By</Text>

              <View style={styles.categoryRow}>
                <Text style={styles.categoryText}>Category</Text>
                <Octicons name={'chevron-down'} size={responsiveWidth(24)} color={colors.darkGrey}/>
              </View>
              <TouchableOpacity activeOpacity={0.8} onPress={() => setCriteria('title-asc')}
                                style={styles.categorySelect}>
                <Text style={styles.categorySelectText}>A-Z Ascending</Text>
                {criteria === 'title-asc' ?
                  <Icon name={'radio-button-line'} size={responsiveWidth(24)} color={colors.primary}/> :
                  <Icon name={'checkbox-blank-circle-line'} size={responsiveWidth(24)} color={colors.primary}/>
                }
              </TouchableOpacity>
              <TouchableOpacity activeOpacity={0.8} onPress={() => setCriteria('title-desc')}
                                style={styles.categorySelect}>
                <Text style={styles.categorySelectText}>Z-A Descending</Text>
                {criteria === 'title-desc' ?
                  <Icon name={'radio-button-line'} size={responsiveWidth(24)} color={colors.primary}/> :
                  <Icon name={'checkbox-blank-circle-line'} size={responsiveWidth(24)} color={colors.primary}/>
                }
              </TouchableOpacity>
              <TouchableOpacity activeOpacity={0.8} onPress={() => setCriteria('dueDate')}
                                style={styles.categorySelect}>
                <Text style={styles.categorySelectText}>Due-Date</Text>
                {criteria === 'dueDate' ?
                  <Icon name={'radio-button-line'} size={responsiveWidth(24)} color={colors.primary}/> :
                  <Icon name={'checkbox-blank-circle-line'} size={responsiveWidth(24)} color={colors.primary}/>
                }
              </TouchableOpacity>
              <TouchableOpacity activeOpacity={0.8} onPress={() => setCriteria('priority-high-low')}
                                style={styles.categorySelect}>
                <Text style={styles.categorySelectText}>Priority High-low</Text>
                {criteria === 'priority-high-low' ?
                  <Icon name={'radio-button-line'} size={responsiveWidth(24)} color={colors.primary}/> :
                  <Icon name={'checkbox-blank-circle-line'} size={responsiveWidth(24)} color={colors.primary}/>
                }
              </TouchableOpacity>
              <TouchableOpacity activeOpacity={0.8} onPress={() => setCriteria('priority-low-high')}
                                style={styles.categorySelect}>
                <Text style={styles.categorySelectText}>Priority Low-high</Text>
                {criteria === 'priority-low-high' ?
                  <Icon name={'radio-button-line'} size={responsiveWidth(24)} color={colors.primary}/> :
                  <Icon name={'checkbox-blank-circle-line'} size={responsiveWidth(24)} color={colors.primary}/>
                }
              </TouchableOpacity>
              <TouchableOpacity activeOpacity={0.8} style={styles.button} onPress={()=>handleApply(criteria)}>
                <Text style={styles.buttonText}>Apply</Text>
              </TouchableOpacity>
              <TouchableOpacity activeOpacity={0.8} style={styles.cancel} onPress={handleCancel}>
                <Text style={styles.cancelText}>Cancel</Text>
              </TouchableOpacity>
            </View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  )
}
const styles = StyleSheet.create({
  cancel: {
    alignItems: 'center',
    marginTop: responsiveHeight(8),
    marginBottom: responsiveHeight(24),
  },
  cancelText: {
    color: colors.black,
    fontWeight: '600',
    fontSize: responsiveWidth(16),
  },
  button: {
    backgroundColor: colors.primary,
    alignItems: 'center',
    marginVertical: responsiveHeight(8),
    borderRadius: 16,
    paddingVertical: responsiveHeight(18)
  },
  buttonText: {
    color: colors.white,
    fontWeight: '600',
    fontSize: responsiveWidth(16),
  },
  categorySelectText: {
    color: colors.categorySelect,
    fontSize: responsiveWidth(14)

  },
  categorySelect: {
    flexDirection: "row",
    justifyContent: 'space-between',
    alignItems: "center",
    marginBottom: responsiveHeight(16),

  },
  categoryText: {
    color: colors.darkBlue,
    fontFamily: 'montserrat-semiBold',
    fontSize: responsiveWidth(18),
  },
  categoryRow: {
    flexDirection: "row",
    justifyContent: 'space-between',
    alignItems: "center",
    marginBottom: responsiveHeight(12),
  },
  filterText: {
    color: colors.gold,
    fontFamily: 'montserrat-semiBold',
    fontSize: responsiveWidth(18),
    marginBottom: responsiveHeight(24),
  },
  lineBreak: {
    borderWidth: 1,
    borderColor: colors.lightGrey,
    marginVertical: responsiveHeight(24),
    width: '50%',
    alignSelf: 'center',
  },
  modalBackground: {
    flex: 1,
    backgroundColor: colors.background,
    justifyContent: "flex-end",
  },
  popupContainer: {
    backgroundColor: colors.white,
    borderTopLeftRadius: responsiveWidth(24),
    borderTopRightRadius: responsiveWidth(24),
    paddingHorizontal: responsiveWidth(24),
  },
})
export default SortByModal