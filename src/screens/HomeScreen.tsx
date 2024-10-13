import {Text, View, StyleSheet, TextInput, TouchableOpacity, ScrollView, FlatList} from "react-native";
import colors from "../../constants/colors";
import {responsiveHeight, responsiveWidth} from "../../constants/responsiveFont";
import {useEffect, useState} from "react";
import {CalendarRemove, SearchNormal1, Setting4} from "iconsax-react-native";
import {Octicons} from '@expo/vector-icons';
import {Entypo} from '@expo/vector-icons';
import FilterByModal from "../Components/FilterByModal";
import SortByModal from "../Components/SortByModal";
import AddTaskModal from "../Components/AddTaskModal";
import EditAndDeleteModal from "../Components/EditAndDeleteModal";
import DeleteTaskModal from "../Components/DeleteTaskModal";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {useMutation, useQuery} from "@tanstack/react-query";
import {getTasks} from "../Hooks/TaskApi";
import {createUser} from "../Hooks/AuthApi";
import {formatDateTime} from "../Utils/formatDateTime";


const getData = async (key) => {
  try {
    const jsonValue = await AsyncStorage.getItem(key);
    return jsonValue != null ? jsonValue : '';
  } catch (e) {
    console.error("Error retrieving data", e);
  }
};

const HomeScreen = ({navigation}) => {
  const [activeTask, setActiveTask] = useState(null); 
  const [editModal, setEditModal] = useState(false)
  const [filterByModal, setFilterByModal] = useState(false)
  const [sortByModal, setSortByModal] = useState(false)
  const [addTaskModal, setAddTaskModal] = useState(false)
  const [editTaskModal, setEditTaskModal] = useState(false)
  const [deleteTaskModal, setDeleteTaskModal] = useState(false)
  const [fullName, setFullName] = useState('');
  const [searchText, setSearchText] = useState('');
  const [sortCriteria, setSortCriteria] = useState('');
  const [filterCriteria, setFilterCriteria] = useState({
    categories: ['backend', 'frontend', 'devops', 'ui_ux'],
    priorities: ['low', 'mid', 'high']
  });
  useEffect(() => {
    const fetchFullName = async () => {
      const name = await getData('userName'); 
      setFullName(name); 
    };

    fetchFullName();
  }, []);
  const {data, error} = useQuery({
    queryKey: ['tasks'],
    queryFn: getTasks,
  });
  if (error) {
    if (error.response.data === "Invalid token") {
      navigation.reset({
        index: 0,
        routes: [{name: 'Login'}],
      });
      return <Text>Invalid token</Text>
    }
    if (data === undefined) {
      return <Text>Loading...</Text>
    }
  }

  const toggleEditModal = (item) => {
    setEditModal(!editModal);
    setActiveTask(item);
  };
  const toggleFilterByModal = () => {
    setFilterByModal(!filterByModal);
  };
  const toggleSortByModal = () => {
    setSortByModal(!sortByModal);
  };
  const toggleAddTaskModal = () => {
    setAddTaskModal(!addTaskModal);
  };
  const toggleEditTaskModal = () => {
    setEditTaskModal(!editTaskModal);
  };
  const toggleDeleteTaskModal = (item) => {
    setDeleteTaskModal(!deleteTaskModal);
    setActiveTask(item);
  };
  const handleTaskClick = (item) => {
    navigation.navigate('Task', {task: item});
  }
  const handleSortChange = (criteria) => {
    setSortCriteria(criteria);
    toggleSortByModal();
  };
  const handleFilterChange = (criteria) => {
    setFilterCriteria(criteria);
    toggleFilterByModal();
  };
  const renderItem = ({item}) => {
    return (
      <>
        <TouchableOpacity activeOpacity={0.8} onPress={() => handleTaskClick(item)} style={styles.card}>
          <View style={styles.cardHeader}>
            <View style={styles.taskDeadLine}>
              <CalendarRemove size={responsiveWidth(16)} color={colors.orange}/>
              <Text style={styles.date}>{formatDateTime(item.dueDate)}</Text>
            </View>
            <TouchableOpacity activeOpacity={0.8} onPress={() => toggleEditModal(item)}>
              <Entypo name={"dots-three-horizontal"} size={24} color={colors.darkGrey}/>
            </TouchableOpacity>
          </View>
          <Text style={styles.taskTitle}>{item.title}</Text>
          <Text style={styles.taskDescription} numberOfLines={3}>{item.description}</Text>
          <View style={styles.cardCat}>
            <View style={[styles.cat, {backgroundColor: colors[item.category.toLowerCase()] || colors.background}]}>
              <Text style={styles.text}>{item.category.toUpperCase()}</Text>
            </View>
            <View style={[styles.cat, {backgroundColor: colors[item.priority.toLowerCase()] || colors.low}]}>
              <Text style={styles.text}>{item.priority.toUpperCase()}</Text>
            </View>
          </View>
        </TouchableOpacity>
        {activeTask?.id === item.id && (
          <>
            <EditAndDeleteModal
              editModal={editModal}
              toggleEditModal={() => toggleEditModal(item)}
              toggleEditTaskModal={() => toggleEditTaskModal()}
              toggleDeleteTaskModal={() => toggleDeleteTaskModal(item)}
            />
            <AddTaskModal
              navigation={navigation}
              addTaskModal={editTaskModal}
              toggleAddTaskModal={() => toggleEditTaskModal()}
              edit={true}
              task={item}
            />
            <DeleteTaskModal
              navigation={navigation}
              deleteTaskModal={deleteTaskModal}
              toggleDeleteTaskModal={() => toggleDeleteTaskModal(item)}
              task={item}
            />
          </>
        )}
      </>
    )
  }
  const processedData = data
    ?.filter((item) =>
      item.title.toLowerCase().includes(searchText.toLowerCase())
    )
    ?.filter((task) => {
      const matchesCategory = filterCriteria.categories.length > 0 ? filterCriteria.categories.includes(task.category) : true;
      const matchesPriority = filterCriteria.priorities.length > 0 ? filterCriteria.priorities.includes(task.priority) : true;
      return matchesCategory && matchesPriority;
    })
    ?.sort((a, b) => {
      if (sortCriteria === 'title-asc') {
        return a.title.localeCompare(b.title);
      } else if (sortCriteria === 'title-desc') {
        return b.title.localeCompare(a.title);
      } else if (sortCriteria === 'dueDate') {
        return new Date(a.dueDate) - new Date(b.dueDate);
      } else if (sortCriteria === 'priority-high-low') {
        return b.priority.localeCompare(a.priority);
      } else if (sortCriteria === 'priority-low-high') {
        return a.priority.localeCompare(b.priority);
      }
      return 0;
    });

  const sortValue = () => {
    if (sortCriteria === 'title-asc') {
      return "A-Z Ascending";
    } else if (sortCriteria === 'title-desc') {
      return "Z-A Descending";
    } else if (sortCriteria === 'dueDate') {
      return "Due Date";
    } else if (sortCriteria === 'priority-high-low') {
      return "Priority - High to Low";
    } else if (sortCriteria === 'priority-low-high') {
      return "Priority - Low to High";
    } else {
      return "No Sort";
    }
  }
  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <View style={styles.welcomeTextWidth}>
          <Text style={[styles.welcomeText]}>Welcome Back!</Text>
          <Text style={styles.fullName}>{fullName.toUpperCase()}</Text>
        </View>
        <View style={styles.profileIcon}>
          <Text style={styles.profileIconChar}>{fullName.charAt(0).toUpperCase()}</Text>
        </View>
      </View>
      <View style={styles.textInputContainer}>
        <SearchNormal1 size={responsiveWidth(24)} color={colors.black} style={[styles.icon, {
          transform: [
            ...(styles.icon.transform || []), 
            {translateY: -responsiveWidth(24) / 2} 
          ]
        }]}/>
        <TextInput
          placeholder={"Search tasks"}
          style={styles.textInput}
          value={searchText}
          onChangeText={setSearchText} 
        />
      </View>
      <View style={styles.taskRow}>
        <Text style={styles.tasksNum}>
          {processedData?.length} Tasks
        </Text>
        <TouchableOpacity style={styles.addTaskButton} onPress={toggleAddTaskModal}>
          <Text style={styles.addTask}>Add new Tasks</Text>
          <Octicons name={'plus'} size={responsiveWidth(24)} color={colors.black}/>
        </TouchableOpacity>
      </View>
      <View style={styles.sortContainer}>
        <TouchableOpacity style={styles.sortButton} onPress={toggleSortByModal}>
          <Text style={styles.sortText}>{sortValue()}</Text>
          <Octicons name={'chevron-down'} size={responsiveWidth(24)} color={colors.darkGrey}/>
        </TouchableOpacity>
        <TouchableOpacity activeOpacity={0.8} style={styles.filter} onPress={toggleFilterByModal}>
          <Setting4 size={responsiveWidth(24)} color={colors.black}/>
        </TouchableOpacity>
      </View>
      <FlatList
        data={processedData}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}/>
      <FilterByModal filterByModal={filterByModal} toggleFilterByModal={() => toggleFilterByModal()}
                     onFilterChange={handleFilterChange} selectedPrioritiesInitial={filterCriteria.priorities}
                     selectedCategoriesInitial={filterCriteria.categories}/>
      <SortByModal sortByModal={sortByModal} toggleSortByModal={() => toggleSortByModal()}
                   onSortChange={handleSortChange} sortCriteria={sortCriteria}/>
      <AddTaskModal navigation={navigation} addTaskModal={addTaskModal}
                    toggleAddTaskModal={() => toggleAddTaskModal()}/>

    </View>
  )
}
const styles = StyleSheet.create({
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
    color: colors.medGrey,
    fontSize: responsiveWidth(14),
    marginBottom: responsiveHeight(24),
  },
  taskTitle: {
    fontFamily: 'montserrat-semiBold',
    fontSize: responsiveWidth(18),
    marginBottom: responsiveHeight(24),
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
  filter: {
    backgroundColor: colors.gold,
    padding: responsiveWidth(12),
    borderRadius: responsiveWidth(12),

  },
  sortContainer: {
    marginTop: responsiveHeight(12),
    flexDirection: "row",
    marginBottom: responsiveHeight(24),

  },
  sortButton: {
    flexDirection: 'row',
    alignItems: "center",
    borderRadius: responsiveWidth(16),
    borderColor: colors.grey,
    borderWidth: 1,
    paddingHorizontal: responsiveWidth(16),
    width: responsiveWidth(270),
    justifyContent: "space-between",
    marginRight: responsiveWidth(8),
  },
  sortText: {
    fontSize: responsiveWidth(14),
    fontWeight: "500",
    color: colors.darkBlue,

  },
  tasksNum: {
    fontFamily: 'montserrat-semiBold',
    fontSize: responsiveWidth(24),
    textTransform: 'capitalize',
    color: colors.black,
  },
  taskRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  addTaskButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.grey,
    paddingVertical: responsiveHeight(12),
    paddingHorizontal: responsiveWidth(16),
    borderRadius: responsiveWidth(16),
  },
  addTask: {
    fontSize: responsiveWidth(16),
    fontWeight: '600',
    marginRight: responsiveWidth(12),
    color: colors.black
  },
  textInput: {
    borderRadius: 16,
    borderColor: colors.grey,
    borderWidth: 1,
    paddingVertical: responsiveHeight(16),
    paddingLeft: responsiveWidth(40),
    fontSize: responsiveWidth(16)
  },
  textInputContainer: {
    marginBottom: responsiveHeight(32),
  },
  icon: {
    position: "absolute",
    top: '50%',
    left: responsiveWidth(12),
    transform: [],
  },
  container: {
    flex: 1,
    paddingHorizontal: responsiveWidth(24),
    marginTop: responsiveHeight(74),
  },
  welcomeTextWidth: {
    width: responsiveWidth(280),
  },
  welcomeText: {
    fontFamily: 'montserrat-semiBold',
    fontSize: responsiveWidth(18),
    textTransform: 'capitalize',
    color: colors.gold,
  },
  fullName: {
    fontFamily: 'montserrat-semiBold',
    fontSize: responsiveWidth(24),
    textTransform: 'uppercase',
    color: colors.black,
  },
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: responsiveHeight(24),

  },
  profileIcon: {
    backgroundColor: colors.primary,
    width: responsiveWidth(48),
    height: responsiveWidth(48),
    justifyContent: "center",
    alignItems: 'center',
    borderRadius: responsiveWidth(24),

  },
  profileIconChar: {
    color: colors.white,
    fontSize: responsiveWidth(24),
    textTransform: 'uppercase',

  }
})
export default HomeScreen;