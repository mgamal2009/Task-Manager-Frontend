import {Text, TouchableOpacity, View, StyleSheet, TextInput, TouchableWithoutFeedback, Alert} from "react-native";
import colors from "../../constants/colors";
import {responsiveHeight, responsiveWidth} from "../../constants/responsiveFont";
import {Eye, EyeSlash, Lock1, UserTag} from "iconsax-react-native";
import {MaterialIcons} from '@expo/vector-icons';
import {useState} from "react";
import {createUser, loginUser} from "../Hooks/AuthApi";
import {useMutation} from "@tanstack/react-query";
import AsyncStorage from "@react-native-async-storage/async-storage";

const EmailAndPass = ({navigation, signUp = false, name = '', setName}) => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [privacyAccepted, setPrivacyAccepted] = useState(false)
  const [showPass, setShowPass] = useState(false)
  const {mutateAsync: useRegister} = useMutation({
    mutationFn: createUser
  });
  const {mutateAsync: useLogin} = useMutation({
    mutationFn: loginUser
  });

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  const validateForm = () => {
    if (name.length < 3) {
      Alert.alert('Validation Error', 'Name must be more than 3 characters.');
      return false;
    }
    if (!emailRegex.test(email)) {
      Alert.alert('Validation Error', 'Please enter a valid email address.');
      return false;
    }
    if (password.length < 6) {
      Alert.alert('Validation Error', 'Password must be longer than or equal 6 characters.');
      return false;
    }
    if (!privacyAccepted) {
      Alert.alert('Validation Error', 'Please accept privacy policy.');
      return false;
    }
    return true;
  };
  const onSuccess = (data) => {
    setPassword('')
    setEmail('')
    setPrivacyAccepted(false)
    AsyncStorage.setItem('token', data.token);
    AsyncStorage.setItem('userId', data.id.toString())
    AsyncStorage.setItem('userName', data.name)
    navigation.reset({
      index: 0,
      routes: [{name: 'Home'}],
    });
  }

  const handleSignUp = async () => {
    if (validateForm()) {
      try {
        await useRegister({name: name, email: email, password: password}, {
          onSuccess: (data) => {
            setName('')
            onSuccess(data)
          },
        })
      } catch (error) {
        if (error.response.data.errors) {
          const message = error.response.data.errors.map(err => {
            return Object.values(err)
          });
          Alert.alert(message.join('\n'));
        }else {
          Alert.alert(error.response.data.message);
        }
      }
    }
  }
  const handleLogin = async () => {
    if (email.length === 0 || password.length === 0) {
      Alert.alert('Validation Error', 'Please enter email and password.');
      return;
    }
    try {
      await useLogin({email: email, password: password}, {
        onSuccess: (data) => {
          onSuccess(data)
        },
      })
    } catch (error) {
      if (error.response.data.errors) {
        const message = error.response.data.errors.map(err => {
          return Object.values(err)
        });
        Alert.alert(message.join('\n'));
      }else {
        Alert.alert(error.response.data.message);
      }
    }
  }
  const backToLogin = () => {
    navigation.navigate('Login')
  }
  const backToSignUp = () => {
    navigation.navigate('SignUp')
  }

  const handlePrivacy = () => {
    setPrivacyAccepted(!privacyAccepted);
  }

  return (
    <View>
      <Text style={styles.text}>Email Address</Text>
      <View style={styles.textInputContainer}>
        <UserTag size={responsiveWidth(24)} color={colors.black} style={[styles.icon,
          {
            transform: [
              ...(styles.icon.transform || []), 
              {translateY: -responsiveWidth(24) / 2} 
            ]
          }]}/>
        <TextInput inputMode={"email"} style={styles.textInput} onChangeText={(text) => setEmail(text)}/>
      </View>
      <Text style={[styles.text]}>Password</Text>
      <View style={styles.textInputContainer}>
        <Lock1 size={responsiveWidth(24)} color={colors.black} style={[styles.icon, {
          transform: [
            ...(styles.icon.transform || []), 
            {translateY: -responsiveWidth(24) / 2} 
          ]
        }]}/>
        <TextInput secureTextEntry={!showPass} style={styles.textInput} onChangeText={(text) => setPassword(text)}/>
        {showPass ?
          <TouchableOpacity activeOpacity={0.8} onPress={() => setShowPass(!showPass)} style={[styles.invertedIcon, {
            transform: [
              ...(styles.invertedIcon.transform || []),
              {translateY: -responsiveWidth(24) / 2} 
            ]
          }]}>
            <Eye size={responsiveWidth(24)} color={colors.black}/>
          </TouchableOpacity>
          :
          <TouchableOpacity activeOpacity={0.8} onPress={() => setShowPass(!showPass)} style={[styles.invertedIcon, {
            transform: [
              ...(styles.invertedIcon.transform || []), 
              {translateY: -responsiveWidth(24) / 2} 
            ]
          }]}>
            <EyeSlash size={responsiveWidth(24)} color={colors.black}/>
          </TouchableOpacity>}
      </View>
      {signUp &&
          <View style={styles.privacyContainer}>
            {privacyAccepted ?
              <TouchableOpacity activeOpacity={0.8} onPress={handlePrivacy}>
                <MaterialIcons name={"check-box"} size={responsiveWidth(24)} color={colors.primary}/>
              </TouchableOpacity>
              :
              <TouchableOpacity activeOpacity={0.8} onPress={handlePrivacy}>
                <MaterialIcons name={"check-box-outline-blank"} size={responsiveWidth(24)} color={colors.grey}/>
              </TouchableOpacity>

            }
              <View style={styles.privacyContainer}>
                  <Text style={styles.privacy}>
                      I have read & agreed to Owitasks{' '}
                      <TouchableWithoutFeedback>
                          <Text style={styles.customPrivacy}>
                              Privacy Policy, Terms & Condition
                          </Text>
                      </TouchableWithoutFeedback>
                  </Text>
              </View>
          </View>
      }
      {signUp ?
        <TouchableOpacity activeOpacity={0.8} style={styles.button} onPress={handleSignUp}>
          <Text style={styles.buttonText}>Sign Up</Text>
        </TouchableOpacity>
        :
        <TouchableOpacity activeOpacity={0.8} style={styles.button} onPress={handleLogin}>
          <Text style={styles.buttonText}>Login</Text>
        </TouchableOpacity>
      }
      {signUp ?
        <View style={styles.changeTextContainer}>
          <Text style={[styles.changeText, styles.changeTextWeight]}>Already have an account?</Text>
          <TouchableOpacity onPress={backToLogin}>
            <Text style={[styles.customChangeText, styles.changeTextWeight]}>Log In</Text>
          </TouchableOpacity>
        </View>
        :
        <View style={styles.changeTextContainer}>
          <Text style={styles.changeText}>Don’t have an account?</Text>
          <TouchableOpacity onPress={backToSignUp}>
            <Text style={styles.customChangeText}>Sign Up</Text>
          </TouchableOpacity>
        </View>
      }

    </View>
  )
}
const styles = StyleSheet.create({
  button: {
    backgroundColor: colors.primary,
    alignItems:
      'center',
    marginVertical:
      responsiveHeight(8),
    borderRadius:
      16,
    paddingVertical:
      responsiveHeight(18)
  }
  ,
  buttonText: {
    color: colors.white,
    fontWeight:
      '600',
    fontSize:
      responsiveWidth(16),
  }
  ,
  changeTextContainer: {
    flexDirection: 'row',
    alignItems:
      'center',
    justifyContent:
      'center',
    marginTop:
      responsiveHeight(24),
  }
  ,
  changeText: {
    fontSize: responsiveWidth(16),
    color:
    colors.black,
    marginRight:
      responsiveWidth(4),
  }
  ,
  changeTextWeight: {
    fontWeight: '700',
  }
  ,
  customChangeText: {
    fontSize: responsiveWidth(16),
    color:
    colors.gold,
  }
  ,
  privacy: {
    marginLeft: responsiveWidth(8),
    fontSize:
      responsiveWidth(14),
    color:
    colors.black,
  }
  ,
  privacyContainer: {
    flexDirection: 'row',
    alignItems:
      "flex-start",
  }
  ,
  customPrivacy: {
    fontSize: responsiveWidth(14),
    color:
    colors.gold,
    marginLeft:
      responsiveWidth(8),
  }
  ,
  text: {
    fontSize: responsiveWidth(12),
    textTransform:
      'capitalize',
    color:
    colors.black,
    marginBottom:
      responsiveHeight(12),

  }
  ,
  textInput: {
    borderRadius: 16,
    borderColor:
    colors.grey,
    borderWidth:
      1,
    paddingVertical:
      responsiveHeight(16),
    paddingLeft:
      responsiveWidth(40),
    fontSize:
      responsiveWidth(16)
  }
  ,
  textInputContainer: {
    marginBottom: responsiveHeight(24),
  }
  ,
  icon: {
    position: "absolute",
    top:
      '50%',
    left:
      responsiveWidth(12),
    transform:
      [],
  }
  ,
  invertedIcon: {
    position: "absolute",
    top:
      '50%',
    right:
      responsiveWidth(12),
    transform:
      [],
  }
  ,
})
export default EmailAndPass;