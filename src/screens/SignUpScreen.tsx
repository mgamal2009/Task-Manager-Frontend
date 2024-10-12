import {Text, View, StyleSheet, TextInput} from "react-native";
import colors from "../../constants/colors";
import {responsiveHeight, responsiveWidth} from "../../constants/responsiveFont";
import EmailAndPass from "../Components/EmailAndPass";
import {User} from "iconsax-react-native";
import {useState} from "react";

const SignUpScreen = ({navigation}) =>{
  const [name, setName] = useState('')
  return(
    <View style={styles.container}>
      <Text style={[styles.text]}>Create your account!</Text>
      <Text style={styles.labelText}>Full Name</Text>
      <View style={styles.textInputContainer}>
        <User size={responsiveWidth(24)} color={colors.black} style={[styles.icon,{
          transform: [
            ...styles.icon.transform || [], // Spread existing transforms or fallback to an empty array
            { translateY: -responsiveWidth(24) / 2 } // Your new transform
          ]
        }]}/>
        <TextInput style={styles.textInput} onChangeText={(text)=> setName(text)}/>
      </View>
      <EmailAndPass navigation={navigation} signUp={true} name={name} setName={(name)=>setName(name)}/>
    </View>
  )
}
const styles = StyleSheet.create({
  container: {
    flex:1,
    marginHorizontal:responsiveWidth(24),
    marginTop: responsiveHeight(195),
  },
  text:{
    fontFamily:'montserrat-semiBold',
    fontSize: responsiveWidth(24),
    textTransform:'capitalize',
    color: colors.black,
    marginBottom: responsiveHeight(48),
  },
  labelText: {
    fontSize: responsiveWidth(12),
    textTransform: 'capitalize',
    color: colors.black,
    marginBottom: responsiveHeight(12),

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
    marginBottom: responsiveHeight(24),
  },
  icon: {
    position: "absolute",
    top: '50%',
    left: responsiveWidth(12),
    transform: [],
  },
})
export default SignUpScreen;