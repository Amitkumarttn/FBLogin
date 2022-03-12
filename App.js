import {StyleSheet, Text, View, Button} from 'react-native';
import React, {useState} from 'react';
import {
  AccessToken,
  AuthenticationToken,
  LoginButton,
  LoginManager, GraphRequest, GraphRequestManager, Settings
} from 'react-native-fbsdk-next';

// Settings.setAppID('416109166945941');

const App = () => {
  const [fbUserInfo, setFbUserInfo] = useState({});
  // Settings.setAppID('416109166945941');
  const facebookLogin = resCallback => {
    LoginManager.logOut(); // if user already login then logout
    return LoginManager.logInWithPermissions(['public_profile', 'email']).then(
      result => {
        // console.log('FB result ==>>', result);
        if (
          result.declinedPermissions &&
          result.declinedPermissions.includes('email')
        ) {
          resCallback({message: 'Email is required'});
        }
        if (result.isCancelled) {
          // Login cancelled
        } else {
          const infoRequest = new GraphRequest(
            '/me?fields=email,name,picture',
            null,
            resCallback,
          );
          new GraphRequestManager().addRequest(infoRequest).start();
        }
      },
      function (error) {
        console.log('FBLogin fail with error =>', error);
      },
    );
  };

  const onFBLogin = async () => {
    try {
      await facebookLogin(responseInfoCallBack);
    } catch (error) {
      console.log(error);
    }
  };
  const responseInfoCallBack = async (error, result) => {
    if (error) {
      console.log('Error', error);
      return;
    } else {
      const userData = result;
      if (userData && Object.keys(userData).length) {
        setFbUserInfo(userData);
        console.log('FACEBOOK DATA', userData);
        // navigation.navigate('HomePage');
      }
    }
  };
  return (
    <View style={styles.container}>
      <Button title="press" onPress={() => onFBLogin()} />
    </View>
  );
};

export default App;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
