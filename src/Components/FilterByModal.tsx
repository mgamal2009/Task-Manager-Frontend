import {Modal, Text, TouchableOpacity, TouchableWithoutFeedback, View, StyleSheet} from "react-native";
import Icon from "react-native-remix-icon";
import {responsiveHeight, responsiveWidth} from "../../constants/responsiveFont";
import colors from "../../constants/colors";
import {Octicons} from "@expo/vector-icons";
import {useState} from "react";

const FilterByModal = ({filterByModal, toggleFilterByModal, onFilterChange, selectedCategoriesInitial, selectedPrioritiesInitial,}) =>{
  const [selectedCategories, setSelectedCategories] = useState(selectedCategoriesInitial);
  const [selectedPriorities, setSelectedPriorities] = useState(selectedPrioritiesInitial);
  const toggleCategory = (category) => {
    setSelectedCategories(prev => {
      if (prev.includes(category)) {
        return prev.filter(item => item !== category);
      } else {
        return [...prev, category];
      }
    });
  };

  const togglePriority = (priority) => {
    setSelectedPriorities(prev => {
      if (prev.includes(priority)) {
        return prev.filter(item => item !== priority);
      } else {
        return [...prev, priority];
      }
    });
  };

  const handleApply = () => {
    onFilterChange({ categories: selectedCategories, priorities: selectedPriorities });
    toggleFilterByModal();
  };
  return(
    <Modal
      visible={filterByModal}
      transparent={true}
      animationType="fade"
      onRequestClose={toggleFilterByModal}
    >
      <TouchableWithoutFeedback onPress={toggleFilterByModal}>
        <View style={styles.modalBackground}>
          <TouchableWithoutFeedback>
            <View style={styles.popupContainer}>
              <View style={styles.lineBreak}/>
              <Text style={styles.filterText}>Filter By</Text>
              <View style={styles.categoryRow}>
                <Text style={styles.categoryText}>Category</Text>
                <Octicons name={'chevron-down'} size={responsiveWidth(24)} color={colors.darkGrey}/>
              </View>

              <TouchableOpacity style={styles.categorySelect} onPress={() => toggleCategory('backend')}>
                <Text style={styles.categorySelectText}>Back-end</Text>
                <Icon name={selectedCategories.includes('backend') ? 'checkbox-fill' : 'checkbox-line'} size={responsiveWidth(24)} color={colors.primary}/>
              </TouchableOpacity>

              <TouchableOpacity style={styles.categorySelect} onPress={() => toggleCategory('frontend')}>
                <Text style={styles.categorySelectText}>Front-end</Text>
                <Icon name={selectedCategories.includes('frontend') ? 'checkbox-fill' : 'checkbox-line'} size={responsiveWidth(24)} color={colors.primary}/>
              </TouchableOpacity>

              <TouchableOpacity style={styles.categorySelect} onPress={() => toggleCategory('devops')}>
                <Text style={styles.categorySelectText}>DevOps</Text>
                <Icon name={selectedCategories.includes('devops') ? 'checkbox-fill' : 'checkbox-line'} size={responsiveWidth(24)} color={colors.primary}/>
              </TouchableOpacity>

              <TouchableOpacity style={styles.categorySelect} onPress={() => toggleCategory('ui_ux')}>
                <Text style={styles.categorySelectText}>UI/UX</Text>
                <Icon name={selectedCategories.includes('ui_ux') ? 'checkbox-fill' : 'checkbox-line'} size={responsiveWidth(24)} color={colors.primary}/>
              </TouchableOpacity>

              <View style={styles.fullLineBreak}/>

              <View style={styles.categoryRow}>
                <Text style={styles.categoryText}>Priority</Text>
                <Octicons name={'chevron-down'} size={responsiveWidth(24)} color={colors.darkGrey}/>
              </View>

              <TouchableOpacity style={styles.categorySelect} onPress={() => togglePriority('high')}>
                <Text style={styles.categorySelectText}>High</Text>
                <Icon name={selectedPriorities.includes('high') ? 'checkbox-fill' : 'checkbox-line'} size={responsiveWidth(24)} color={colors.primary}/>
              </TouchableOpacity>
              <TouchableOpacity style={styles.categorySelect} onPress={() => togglePriority('mid')}>
                <Text style={styles.categorySelectText}>Mid</Text>
                <Icon name={selectedPriorities.includes('mid') ? 'checkbox-fill' : 'checkbox-line'}
                      size={responsiveWidth(24)} color={colors.primary}/>
              </TouchableOpacity>

              <TouchableOpacity style={styles.categorySelect} onPress={() => togglePriority('low')}>
                <Text style={styles.categorySelectText}>Low</Text>
                <Icon name={selectedPriorities.includes('low') ? 'checkbox-fill' : 'checkbox-line'} size={responsiveWidth(24)} color={colors.primary}/>
              </TouchableOpacity>

              <TouchableOpacity activeOpacity={0.8} style={styles.button} onPress={handleApply}>
                <Text style={styles.buttonText}>Apply</Text>
              </TouchableOpacity>

              <TouchableOpacity activeOpacity={0.8} style={styles.cancel} onPress={toggleFilterByModal}>
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
  categorySelectText:{
    color: colors.categorySelect,
    fontSize: responsiveWidth(14)

  },
  categorySelect:{
    flexDirection:"row",
    justifyContent: 'space-between',
    alignItems: "center",
    marginBottom: responsiveHeight(16),

  },
  categoryText:{
    color: colors.darkBlue,
    fontFamily: 'montserrat-semiBold',
    fontSize: responsiveWidth(18),
  },
  categoryRow:{
    flexDirection:"row",
    justifyContent: 'space-between',
    alignItems: "center",
    marginBottom: responsiveHeight(12),
  },
  filterText:{
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
    alignSelf:'center',
  },
  fullLineBreak:{
    borderWidth: 1,
    borderColor: colors.lightGrey,
    marginBottom: responsiveHeight(24),
    marginTop: responsiveHeight(8),
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
export default FilterByModal