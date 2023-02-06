/* eslint-disable react-native/no-inline-styles */
import React, {useRef} from 'react';
import {Text, Keyboard, ActivityIndicator, SafeAreaView, StyleSheet} from 'react-native';
import {useStoreState, useStoreActions} from 'easy-peasy';
import {STATUS, APP_STATE} from '../../Constants';
import LoadingActionContainer from '../../Components/LoadingActionContainer';
import {
  Section,
  Container,
  PasswordInputX,
  InputX,
  ButtonX,
} from '../../Components';

import {
  Button,
  TextInput,
  Portal,
  Dialog,
  Provider as PaperProvider,
  Provider,
} from "react-native-paper";

import * as firebase from "firebase";

import useAppTheme from '../../Themes/Context';
import useAuth from '../../Services/Auth';
import {showInfoToast} from '../../Lib/Toast';
import BottomPanel from '../../Components/Panel';
import useTranslation from '../../i18n';
import Fonts from '../../Themes/Fonts';

export default () => {
  const onChange = useStoreActions(actions => actions.login.onLoginInputChange);
  const setState = useStoreActions(actions => actions.login.changeAppState);
  const {t} = useTranslation();
  const {login} = useAuth();
  const {theme} = useAppTheme();

  const inputUserName = useRef();
  const inputPassword = useRef();

  const panelRef = useRef();

  const loading = status === STATUS.FETCHING;

  const onSubmit = () => {
    inputPassword.current.focus();
  };

  const {username, password, status} = useStoreState(state => ({
    username: state.login.username,
    password: state.login.password,
    status: state.login.status,
  }));

  const loginUser = () => {
    Keyboard.dismiss();

    const reg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    // if(!reg.test(username)) {
    //   showErrorToast('Please insert Correct Email format');
    //   setLoading(false);
    //   inputUserName.current.focus();
    //   return;
    // }
    // if (!username || !password) {
    //   showErrorToast('Username and password are mandatory, try again !');
    //   setLoading(false);
    //   return;
    // }


    // AsyncStorage.setItem("PUSH_TOKEN", token)

    // var params = {email: username, password: password, token: token};

    // axios.post(`${BASE_URL}/user/login`, params).then( res => {
    //   if(res.data.success) {
    //     showSuccessToast('Login success.');
    //     AsyncStorage.setItem("USER_INFO", JSON.stringify(res.data.data));
    //     setState(APP_STATE.PRIVATE);
    //   }else {
    //     console.log(res);
    //     setLoading(false);
    //     showErrorToast(res.data.message);
    //   }
    // }).catch( err => {
    //   console.log(err);
    //   setLoading(false);
    //   showErrorToast('Server Error. Please try again.');
    // });

    firebase
      .auth()
      .signInWithEmailAndPassword(username, password)
      .then((user) => {
        // AsyncStorage.setItem("USER_INFO", JSON.stringify(user));
        console.log(user.user.uid);
        setState(APP_STATE.PRIVATE);
      })
      .catch((error) => {
        alert(error.message);
        // this.setState({ loading: false });
      });
  };

  

  return (
    <Container>
      <LoadingActionContainer>
        {/* <Section>
          <Text
            style={{
              textAlign: 'center',
              fontSize: 30,
              color: theme.colors.primary,
              marginTop: 60,
              fontFamily: Fonts.type.stylish,
              marginBottom: 20,
            }}>
            {t('welcome')}
          </Text>
        </Section>
        <Section>
          <Text
            style={{
              fontSize: 20,
              textAlign: 'center',
              fontFamily: Fonts.type.italic,
              color: theme.colors.primaryText,
            }}>
            Provide any details to continue
          </Text>
        </Section>
        <Section>
          <InputX
            label="USER NAME"
            // mode="outlined"
            ref={inputUserName}
            style={{backgroundColor: '#fafafa'}}
            autoCapitalize="none"
            returnKeyType={'next'}
            onSubmitEditing={onSubmit}
            onChangeText={text =>
              onChange({
                key: 'username',
                value: text,
              })
            }
            value={username}
          />
          <PasswordInputX
            ref={inputPassword}
            value={password}
            // mode="outlined"
            style={{backgroundColor: '#fafafa'}}
            label="PASSWORD"
            returnKeyType={'go'}
            onSubmitEditing={loginUser}
            onChangeText={text =>
              onChange({
                key: 'password',
                value: text,
              })
            }
          />
        </Section>
        <Section>
          <ButtonX
            loading={loading}
            dark={true}
            color={loading ? theme.colors.accent : theme.colors.primary}
            onPress={loginUser}
            label={t('login')}
          />

          <ButtonX
            mode={'text'}
            onPress={() => panelRef.current.show()}
            label=" NEED HELP "
          />
        </Section> */}

<Portal>
          <Dialog visible={loading} dismissable={false}>
            <Dialog.Title>Logging in...</Dialog.Title>
            <Dialog.Content>
              <ActivityIndicator
                size={60}
                animating={true}
                hidesWhenStopped={true}
                color="#6200EE"
              />
            </Dialog.Content>
          </Dialog>
        </Portal>

        <SafeAreaView style={styles.container}>
          <Text style={styles.title}> Login </Text>

          <TextInput
            label="Email Address"
            mode="flat"
            placeholder="Email"
            onSubmitEditing={loginUser}
            value={username}
            onChangeText={(text) => {
              onChange({
                key: 'username',
                value: text,
              })
            }}
            style={styles.textInput}
          />
          <TextInput
            style={styles.textInput}
            placeholder="Password"
            onChangeText={(password) => {
              onChange({
                key: 'password',
                value: password,
              })
            }}
            secureTextEntry={true}
          />

          <Button
            mode="contained"
            onPress={() => {
              loginUser();
            }}
          >
            Login Now
          </Button>

          <Button
            mode="text"
            onPress={() => {
              this.props.navigation.push("Register");
            }}
            color="#000"
          >
            Create an account
          </Button>

          {/* Forgot Password Button */}
          <Button
            mode="text"
            onPress={() => {
              this.props.navigation.push("ForgotPassword");
            }}
            color="#aaa"
          >
            Forgot Password
          </Button>

        </SafeAreaView>
      </LoadingActionContainer>

      {/* <BottomPanel ref={panelRef} /> */}
    </Container>
  );
};


const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    // alignItems: "center",
    padding: 20,
  },
  textInput: {
    marginBottom: 12,
  },
  title: {
    fontSize: 30,
    textAlign: "center",
    fontWeight: "700",
    marginBottom: 20,
  },
});

