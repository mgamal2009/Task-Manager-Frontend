import {
  Modal,
  Text,
  TouchableOpacity,
  View,
  StyleSheet,
  Platform
} from "react-native";
import {responsiveHeight, responsiveWidth} from "../../constants/responsiveFont";
import DateTimePicker from '@react-native-community/datetimepicker';

const DateTimeModal = ({date, setDate, mode, setMode, show, setShow, modalVisible, setModalVisible, setValue}) => {
  const platform = Platform.OS === 'ios'

  const formatDateTime = (date) => {
    return `${date.toLocaleTimeString()}, ${date.toLocaleDateString()}`;
  };
  const onChange = (event: any, selectedDate?: Date) => {
    const currentDate = selectedDate || date;
    setDate(currentDate);
    setValue(formatDateTime(currentDate))
  };

  const onChangeAndroid = (event: any, selectedDate?: Date) => {
    const currentDate = selectedDate || date;
    setDate(currentDate);
    setValue(formatDateTime(currentDate))
    if (mode === 'date') {
      setMode('time');
    } else {
      setShow(false)
    }
  };

  const handleDateConfirm = () => {
    if (mode === 'date') {
      setMode('time');
    } else {
      setModalVisible(false);
      setMode('date');
    }
  };

  const handleDateCancel = () => {
    setModalVisible(false);
    setMode('date');
  };

  return (
    platform ?
      (
        <Modal
          animationType="slide"
          transparent={true}
          visible={modalVisible}
          onRequestClose={handleDateCancel}
        >
          <View style={styles.centeredView}>
            <View style={styles.modalView}>
              <Text style={styles.modalText}>
                {mode === 'date' ? 'Select Date' : 'Select Time'}
              </Text>

              {show && (<DateTimePicker
                testID="dateTimePicker"
                value={date}
                mode={mode}
                is24Hour={false}
                display="default"
                onChange={onChange}
                style={styles.datePickerCon}
              />)}

              <View style={styles.buttonContainer}>
                <TouchableOpacity
                  style={[styles.dateButton, styles.buttonCancel]}
                  onPress={handleDateCancel}
                >
                  <Text style={styles.textStyle}>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.dateButton, styles.buttonConfirm]}
                  onPress={handleDateConfirm}
                >
                  <Text style={styles.textStyle}>
                    {mode === 'date' ? 'Next' : 'Confirm'}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
      ) :
      (
        show && <DateTimePicker
          testID="dateTimePicker"
          value={date}
          mode={mode}
          is24Hour={false}
          display="default"
          onChange={onChangeAndroid}
          style={styles.datePickerCon}
        />
      )
  )
}
const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalView: {
    backgroundColor: "white",
    borderRadius: responsiveWidth(20),
    padding: responsiveWidth(35),
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    width: '80%',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginTop: responsiveHeight(20),
  },
  dateButton: {
    borderRadius: responsiveWidth(20),
    padding: responsiveWidth(10),
    elevation: 2,
    minWidth: responsiveWidth(100),
  },
  buttonCancel: {
    backgroundColor: "#FF3B30",
  },
  buttonConfirm: {
    backgroundColor: "#34C759",
  },
  textStyle: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center"
  },
  modalText: {
    marginBottom: responsiveHeight(15),
    textAlign: "center",
    fontSize: responsiveWidth(18),
    fontWeight: 'bold',
  },
  datePickerCon: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'flex-start',
  },
})
export default DateTimeModal