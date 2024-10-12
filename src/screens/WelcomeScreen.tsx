import {Text, TouchableOpacity, View, StyleSheet} from "react-native";
import colors from "../../constants/colors";
import {responsiveHeight, responsiveWidth} from "../../constants/responsiveFont";

const WelcomeScreen = ({navigation}) =>{
  const handleClick = () =>{
    navigation.navigate('Login')
  }

  return(
    <View style={styles.container}>
      <Text style={[styles.text,styles.welcomeText]}>Manage your Tasks with</Text>
      <Text style={[styles.text,styles.customText]}>Owitasks</Text>
      <TouchableOpacity activeOpacity={0.8} style={styles.button} onPress={handleClick}>
        <Text style={styles.buttonText}>Let’s Start!</Text>
      </TouchableOpacity>
    </View>
  )
}
const styles = StyleSheet.create({
  button:{
    backgroundColor: colors.primary,
    alignItems:'center',
    marginVertical: responsiveHeight(36),
    borderRadius: 16,
    paddingVertical: responsiveHeight(22),
  },
  buttonText:{
    color: colors.white,
    fontWeight: '600',
    fontSize: responsiveWidth(16),
  },
  container: {
    flex:1,
    justifyContent: 'flex-end',
    marginHorizontal:responsiveWidth(24),
  },
  customText:{
    color: colors.gold,
  },
  text:{
    fontFamily:'montserrat-semiBold',
    fontSize: responsiveWidth(48),
    textTransform:'uppercase',
  },
  welcomeText:{
    color: colors.black,
  }
})
export default WelcomeScreen;