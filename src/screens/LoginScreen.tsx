import {Text, View, StyleSheet} from "react-native";
import colors from "../../constants/colors";
import {responsiveHeight, responsiveWidth} from "../../constants/responsiveFont";
import EmailAndPass from "../Components/EmailAndPass";

const LoginScreen = ({navigation}) =>{
  return(
    <View style={styles.container}>
      <Text style={[styles.text]}>Welcome Back!</Text>
      <EmailAndPass navigation={navigation}/>
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
  }
})
export default LoginScreen;