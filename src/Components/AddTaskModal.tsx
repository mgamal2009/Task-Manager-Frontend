import {
  Modal,
  Text,
  TouchableOpacity,
  View,
  StyleSheet,
  TextInput,
  ScrollView, Alert, Button, Image
} from "react-native";
import {responsiveHeight, responsiveWidth} from "../../constants/responsiveFont";
import colors from "../../constants/colors";
import DropDownPicker from 'react-native-dropdown-picker';
import {useState} from "react";
import RemixIcon from "react-native-remix-icon";
import DateTimeModal from "./DateTimeModal";
import {useMutation, useQueryClient} from "@tanstack/react-query";
import * as ImagePicker from 'expo-image-picker';
import {createUser} from "../Hooks/AuthApi";
import {createTask, updateTask} from "../Hooks/TaskApi";
import AsyncStorage from "@react-native-async-storage/async-storage";
import firebase from "firebase/compat";
// import storage = firebase.storage;
import {ref, uploadBytes, getDownloadURL} from 'firebase/storage';
import {storage} from "../../firebaseConfig";

const AddTaskModal = ({
                        navigation,
                        addTaskModal,
                        toggleAddTaskModal,
                        edit = false,
                        task = null,
                        setCurrentTask = null
                      }) => {
  const queryClient = useQueryClient();
  const [categoryOpen, setCategoryOpen] = useState(false);
  const [categoryValue, setCategoryValue] = useState(edit ? task.category : null);
  const [taskTitle, setTaskTitle] = useState(edit ? task.title : '');
  const [description, setDescription] = useState(edit ? task.description : '');
  const [date, setDate] = useState(new Date());
  const [dueDate, setDueDate] = useState(edit ? task.dueDate : '');
  // const [imageUrl, setImageUrl] = useState('');
  const [mode, setMode] = useState<'date' | 'time'>('date');
  const [show, setShow] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [categories, setCategories] = useState([
    {label: 'Back-end', value: 'backend'},
    {label: 'DevOps', value: 'devops'},
    {label: 'UI/UX', value: 'ui_ux'},
    {label: 'Front-end', value: 'frontend'},
  ]);
  const [priorityOpen, setPriorityOpen] = useState(false);
  const [priorityValue, setPriorityValue] = useState(edit ? task.priority : null);
  const [priorities, setPriorities] = useState([
    {label: 'High', value: 'high'},
    {label: 'Mid', value: 'mid'},
    {label: 'Low', value: 'low'},
  ]);
  const [imageUri, setImageUri] = useState<string | null>(null);
  const [uploadedImageUrl, setUploadedImageUrl] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false)
  const showDatePicker = () => {
    setModalVisible(true);
    setMode('date');
    setShow(true);
  };
  const {mutateAsync: useCreateTask} = useMutation({
    mutationFn: createTask,
    onSuccess: () => {
      queryClient.invalidateQueries({queryKey: ["tasks"]});
    },
  });
  const {mutateAsync: useUpdateTask} = useMutation({
    mutationFn: updateTask,
    onSuccess: () => {
      queryClient.invalidateQueries({queryKey: ["tasks"]});
    },
  });
  const validateForm = () => {
    if (taskTitle.length < 5 || taskTitle.length > 100) {
      Alert.alert('Validation Error', 'Title must be between 5 and 100 characters.');
      return false;
    }
    if (description.length < 10 || description.length > 500) {
      Alert.alert('Validation Error', 'Description must be between 10 and 500 characters.');
      return false;
    }
    if (!categoryValue) {
      Alert.alert('Validation Error', 'Category must not be empty.');
      return false;
    }
    if (!priorityValue) {
      Alert.alert('Validation Error', 'Priority must not be empty.');
      return false;
    }
    if (!dueDate) {
      Alert.alert('Validation Error', 'Due Date must not be empty.');
      return false;
    }

    // If all validations pass
    return true;
  };
  const handleApply = async () => {
    if (validateForm()) {
      try {
        if (edit) {
          await useUpdateTask({
            id: task.id,
            title: taskTitle,
            description: description,
            imageUrl: task.imageUrl,
            category: categoryValue,
            priority: priorityValue,
            dueDate: dueDate
          }, {
            onSuccess: (data) => {
              if (setCurrentTask !== null) {
                setCurrentTask(data)
              }
              toggleAddTaskModal()
            },
          })
        } else {
          console.log("upload start")
          const value = await uploadImage();
          await useCreateTask({
            title: taskTitle,
            description: description,
            imageUrl: value,
            category: categoryValue,
            priority: priorityValue,
            dueDate: dueDate
          }, {
            onSuccess: (data) => {
              setTaskTitle('')
              setDescription('')
              setUploadedImageUrl('')
              setCategoryValue(null)
              setPriorityValue(null)
              setDueDate('')
              toggleAddTaskModal()
            },
          })
        }
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
  }
  const handleCancel = async () => {
    if (edit) {
      setTaskTitle(task.title)
      setDescription(task.description)
      setUploadedImageUrl(task.imageUrl)
      setCategoryValue(task.category)
      setPriorityValue(task.priority)
      setDueDate(task.dueDate)
    } else {
      setTaskTitle('')
      setDescription('')
      setUploadedImageUrl('')
      setCategoryValue(null)
      setPriorityValue(null)
      setDueDate('')
    }
    toggleAddTaskModal()
  }
  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 1,
    });

    if (!result.canceled) {
      setImageUri(result.assets[0].uri);
    }
  };

  // Upload the image to Firebase Storage and get the URL
  const uploadImage = async () => {
    try {
      if (!imageUri) return;
      setUploading(true)
      // Create a reference to where the image will be stored
      const storageRef = ref(storage, `images/${Date.now()}.jpg`);
      console.log("storage ref ", storageRef)
      // Convert image to bytes and upload
      const response = await fetch(imageUri);
      console.log("response ", response)
      const blob = await response.blob();

      /*uploadBytes(storageRef, blob).then(async (snapshot) => {
        const downloadUrl = await getDownloadURL(storageRef).then((snapshot) => {
          return snapshot
        }).catch((error) => {
          return ""
        });
        setUploadedImageUrl(downloadUrl);
      }).catch((error) => {
      });*/
      console.log({blob})
      const uploadResult = await uploadBytes(storageRef, blob);
      console.log(uploadResult)

      // Get the URL of the uploaded image
      const downloadUrl = await getDownloadURL(storageRef);
      console.log(downloadUrl)
      setUploading(false)
      // Optionally, set the uploaded image URL in the state
      setUploadedImageUrl(downloadUrl);
      setImageUri(null)
      return downloadUrl; // Return the download URL


    } catch (error) {
      console.log(error)
      return null; // Return null in case of error
    }

  };
  if (uploading) {

    return (<Modal visible={true}>
      <View style={{
        justifyContent: 'center', alignItems: 'center', flex: 1,
        backgroundColor: colors.background,
      }}>
        <Text style={{fontWeight: 'bold', color: colors.black, fontSize: 20}}>Uploading...</Text>
      </View>
    </Modal>)
  }
  return (
    <Modal
      visible={addTaskModal}
      transparent={true}
      animationType="fade"
      onRequestClose={toggleAddTaskModal}
    >
      <View style={styles.modalBackground}>
        <View style={styles.popupContainer}>
          <ScrollView>
            <Text
              style={[styles.addText, edit ? {color: colors.darkGrey,} : {color: colors.gold,}]}>{edit ? 'Edit Task' : 'Add New Task'}</Text>
            <Button title="Pick an Image" onPress={pickImage}/>
            {imageUri ? <Image source={{uri: imageUri}} style={{width: 200, height: 200}}/> :
              <Text>No image selected</Text>}
            <Text style={styles.title}>Task name</Text>
            <TextInput placeholder={'Enter task name'} placeholderTextColor={colors.darkGrey}
                       style={styles.textInput}
                       value={taskTitle}
                       onChangeText={(text) => setTaskTitle(text)}

            />
            <Text style={styles.title}>Description</Text>
            <TextInput placeholder={'Enter task Description'} placeholderTextColor={colors.darkGrey}
                       style={[styles.textInput, styles.descTextInput]} multiline={true}
                       value={description}
                       onChangeText={(description) => setDescription(description)}
            />
            <Text style={styles.title}>Select category</Text>
            <DropDownPicker
              open={categoryOpen}
              value={categoryValue}
              items={categories}
              setOpen={setCategoryOpen}
              setValue={setCategoryValue}
              setItems={setCategories}
              placeholder="Category"
              placeholderStyle={{color: colors.darkGrey}}
              style={styles.textInput}
              textStyle={{fontSize: responsiveWidth(14)}}
              dropDownContainerStyle={styles.dropdownContainer}
              ArrowUpIconComponent={() => (
                <RemixIcon name="arrow-up-s-line" size={responsiveWidth(20)} color={colors.darkGrey}/>
              )}
              ArrowDownIconComponent={() => (
                <RemixIcon name="arrow-down-s-line" size={responsiveWidth(20)} color={colors.darkGrey}/>
              )}
              zIndex={1000}
              elevation={3}
            />
            <Text style={styles.title}>Set task priority</Text>
            <DropDownPicker
              open={priorityOpen}
              value={priorityValue}
              items={priorities}
              setOpen={setPriorityOpen}
              setValue={setPriorityValue}
              setItems={setPriorities}
              placeholder="Priority"
              placeholderStyle={{color: colors.darkGrey}}
              style={styles.textInput}
              textStyle={{fontSize: responsiveWidth(14)}}
              dropDownContainerStyle={styles.dropdownContainer}
              ArrowUpIconComponent={() => (
                <RemixIcon name="arrow-up-s-line" size={responsiveWidth(20)} color={colors.darkGrey}/>
              )}
              ArrowDownIconComponent={() => (
                <RemixIcon name="arrow-down-s-line" size={responsiveWidth(20)} color={colors.darkGrey}/>
              )}
              zIndex={900}
              elevation={2}
            />

            <Text style={styles.title}>Task Due-Date</Text>
            <TouchableOpacity activeOpacity={0.8} style={styles.datePicker}
                              onPress={() => {
                                showDatePicker()
                              }}>
              <Text style={styles.date}>{dueDate}</Text>
              <RemixIcon style={[styles.calenderIcon, {transform: [{translateY: -responsiveWidth(24) / 2}]}]}
                         name="calendar-todo-fill" size={responsiveWidth(24)}
                         color={colors.darkGrey}/>
            </TouchableOpacity>

            <DateTimeModal
              date={date}
              setDate={(date) => setDate(date)}
              show={show}
              setShow={(show) => {
                setShow(show)
              }}
              mode={mode}
              setMode={(mode) => setMode(mode)}
              modalVisible={modalVisible}
              setModalVisible={(modal) => setModalVisible(modal)}
              setValue={(val) => setDueDate(val)}
            />

            <TouchableOpacity activeOpacity={0.8} style={styles.button} onPress={handleApply}>
              <Text style={styles.buttonText}>{edit ? 'Save edits' : "Done"}</Text>
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
  textStyle: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center"
  },
  date: {
    fontSize: responsiveWidth(14),
    color: colors.black,
    paddingHorizontal: responsiveWidth(16),
    paddingVertical: responsiveHeight(16),
    borderWidth: 1,
    borderColor: colors.grey,
    borderRadius: responsiveWidth(16),
  },
  datePicker: {
    marginTop: responsiveHeight(12),
    marginBottom: responsiveHeight(16),
  },
  calenderIcon: {
    position: 'absolute',
    top: '50%',
    right: responsiveWidth(16)
  },
  dropdownContainer: {
    borderWidth: 1,
    borderColor: colors.grey,
  },
  descTextInput: {
    height: responsiveHeight(100),
    textAlignVertical: 'top',
  },

  textInput: {
    paddingHorizontal: responsiveWidth(16),
    paddingVertical: responsiveHeight(16),
    borderWidth: 1,
    borderColor: colors.grey,
    borderRadius: responsiveWidth(16),
    marginTop: responsiveHeight(12),
    marginBottom: responsiveHeight(16),
    color: colors.black,
    fontSize: responsiveWidth(14),
  },
  title: {
    fontWeight: '600',
  },
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
  addText: {
    fontFamily: 'montserrat-semiBold',
    fontSize: responsiveWidth(24),
    marginBottom: responsiveHeight(36),
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
  },
})
export default AddTaskModal