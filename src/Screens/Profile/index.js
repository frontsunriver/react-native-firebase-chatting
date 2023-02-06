/* eslint-disable react-native/no-inline-styles */
import React, { useEffect, useState, useRef } from 'react';
import { View, Text, StyleSheet, Image, TextInput, ScrollView } from 'react-native';
import LoadingActionContainer from '../../Components/LoadingActionContainer';
import { Container } from '../../Components';
import NavigationStyles from '../../Styles/NavigationStyles';
import KeyboardSpacer from 'react-native-keyboard-spacer';
import useAppTheme from '../../Themes/Context';
import { Colors, FAB } from "react-native-paper";
import * as firebase from "firebase";

const MainScreen = (props) => {
  const { groupName, group_id, createdAt } = props.route.params;
  const { email, uid } = firebase.auth().currentUser;
  const [scrollView, setScrollView] = useState(null);
  const scrollViewRef = useRef();

  const { theme } = useAppTheme();

  const [messageList, setMessageList] = useState(null);
  const [userMessage, setUserMessage] = useState(null);
  const [offset, setOffset] = useState(0);
  useEffect(() => {
    const interval = setInterval(() => {
      getMessage();
    }, 5000);
    return () => clearInterval(interval);
  }, [])

  const getMessage = () => {

    firebase
      .database()
      .ref("messages/" + group_id + "/")
      .once("value")
      .then((snapshot) => {
        const data = snapshot.val();

        let dataArray = new Array();
        for (const key in data) {
          dataArray.push(data[key]);
          // const element = object[key];
          // console.log(data[key]["group_name"]); // key["group_name"]
        }
        setMessageList(dataArray);
      }).catch((error) => {

      });
  }

  const sendMessage = (userMessage, group_id, uid) => {
    // var message = this.state.userMessage;
    if (userMessage == null) {
      return;
    }
    const dateNow = Date.now();
    let messagRef = firebase.database().ref("messages/").push();
    let messageKey = messagRef.key;
    let messageData = {};
    messageData["/messages/" + group_id + "/" + messageKey + "/"] = {
      message_id: messageKey,
      message: userMessage,
      group_id: group_id,
      created_at: dateNow,
      user_id: uid,
      sender: true,
      receiver: false
    };

    firebase
      .database()
      .ref()
      .update(messageData)
      .then(() => {
        getMessage();
        // Successfully executed
        // Hide the dialog box
        // Hide the show loader
      })
      .catch((error) => {
        // alert(error.message);
      });
    setUserMessage(null);
  }

  useEffect(() => {
    showMessageDetail();
  }, [messageList]);

  const showMessageDetail = () => {
    if (messageList != null) {
      return (
        messageList.map((item, index) => {
          return <MessageBubble key={index} direction={item.user_id == uid ? 'right' : 'left'} text={item.message} />
        })
      )
    } else {
      return <></>
    }
  }

  const autoBottomScrollView = () => {
    const y = offset + 10000;
    scrollViewRef.current.scrollTo({x: 0, y, animated: true});
    setOffset(y);
  }

  return (
    <LoadingActionContainer fixed>
      <Container
        style={{
          justifyContent: 'center',
          flex: 1
        }}>
        <View style={styles.container}>
          <View style={styles.topBar}>
            <View style={styles.topBarSection}>
              <Image
                source={require("../../Assets/image/team.png")}
                style={styles.groupImage}
              />
              <View>
                <Text style={styles.groupTitle}>{groupName}</Text>
                <Text style={styles.groupDate}>{createdAt}</Text>
              </View>
            </View>
          </View>
          <View style={styles.messages}>
            <ScrollView ref={scrollViewRef} onContentSizeChange={() => autoBottomScrollView()}>
              {showMessageDetail()}
            </ScrollView>
          </View>
          

          <View style={styles.messageBox}>
            <TextInput
              style={styles.messageInput}
              keyboardType="default"
              placeholder="Type a message"
              multiline={true}
              value={userMessage}
              onChangeText={(userMessage) => setUserMessage(userMessage)}
            />
            <FAB
              style={styles.fab}
              icon="send"
              onPress={() => sendMessage(userMessage, group_id, uid)}
            />
          </View>
          {/* <KeyboardSpacer /> */}
        </View>
      </Container>
    </LoadingActionContainer>
  );
};

MainScreen.navigationOptions = ({ navigation, screenProps }) => {
  const { theme } = screenProps;
  return {
    headerStyle: [
      NavigationStyles.header_statusBar,
      { backgroundColor: theme.colors.header },
    ],
    headerTitle: 'Profile',
    headerTintColor: theme.colors.headerTitle,
    headerTitleStyle: [
      NavigationStyles.headerTitle,
      { color: theme.colors.headerTitle },
    ],
  };
};

function MessageBubble(props) {

  console.log(props);
  //These spacers make the message bubble stay to the left or the right, depending on who is speaking, even if the message is multiple lines.
  var leftSpacer = props.direction === 'left' ? null : <View style={{ maxWidth: 150, minWidth: 100 }} />;
  var rightSpacer = props.direction === 'left' ? <View style={{ maxWidth: 150, minWidth: 100 }} /> : null;

  var bubbleStyles = props.direction === 'left' ? [styles.messageBubble, styles.messageBubbleLeft] : [styles.messageBubble, styles.messageBubbleRight];

  var bubbleTextStyle = props.direction === 'left' ? styles.messageBubbleTextLeft : styles.messageBubbleTextRight;

  return (
    <View style={{ justifyContent: 'space-between', flexDirection: 'row' }}>
      {leftSpacer}
      <View style={bubbleStyles}>
        <Text style={bubbleTextStyle}>
          {props.text}
        </Text>
      </View>
      {rightSpacer}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // justifyContent: "center",
    // alignItems: "center",
  },
  topBar: {
    height: 100,
    backgroundColor: Colors.deepPurple800,
    justifyContent: "center",
  },
  topBarSection: {
    marginTop: 20,
    flexDirection: "row",
    alignItems: "center",
  },
  groupTitle: {
    color: Colors.white,
    fontSize: 20,
    fontWeight: "700",
    marginLeft: 20,
  },
  groupDate: {
    color: Colors.white,
    fontSize: 14,
    fontWeight: "400",
    marginLeft: 20,
    marginTop: 2,
  },
  groupImage: {
    width: 50,
    height: 50,
    marginLeft: 20,
    borderRadius: 30,
    backgroundColor: Colors.deepPurple300,
  },
  messageBox: {
    position: "absolute",
    bottom: 0,
    backgroundColor: Colors.grey300,
    width: "100%",
    paddingHorizontal: 10,
    paddingVertical: 10,
  },
  messageInput: {
    width: "80%",
    fontSize: 14,
    backgroundColor: Colors.white,
    paddingVertical: 12,
    color: Colors.black,
    borderRadius: 8,
    paddingHorizontal: 12,
    borderWidth: 2,
    borderColor: Colors.deepPurple300,
  },
  fab: {
    position: "absolute",
    margin: 16,
    right: 0,
    bottom: 0,
  },

  outer: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'space-between',
    backgroundColor: 'white'
  },

  messages: {
    flex: 1,
    marginBottom: 80,
  },

  //InputBar

  inputBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 5,
    paddingVertical: 3,
  },

  textBox: {
    borderRadius: 5,
    borderWidth: 1,
    borderColor: 'gray',
    flex: 1,
    fontSize: 16,
    paddingHorizontal: 10
  },

  sendButton: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingLeft: 15,
    marginLeft: 5,
    paddingRight: 15,
    borderRadius: 5,
    backgroundColor: '#66db30'
  },

  //MessageBubble

  messageBubble: {
    borderRadius: 5,
    marginTop: 8,
    marginRight: 10,
    marginLeft: 10,
    paddingHorizontal: 10,
    paddingVertical: 5,
    flexDirection: 'row',
    flex: 1
  },

  messageBubbleLeft: {
    backgroundColor: '#d5d8d4',
  },

  messageBubbleTextLeft: {
    color: 'black'
  },

  messageBubbleRight: {
    backgroundColor: '#115ab9',
    textAlign: 'right',
  },

  messageBubbleTextRight: {
    textAlign: 'right',
    color: 'white'
  },
});

export default MainScreen;
