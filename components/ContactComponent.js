import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Card, Divider, Button, Icon } from 'react-native-elements';
import * as Animatable from 'react-native-animatable';
import * as MailComposer from 'expo-mail-composer';

const composeMail =() => {
  MailComposer.composeAsync({
    recipients: ['son.tranghong@hoasen.edu.vn'],
    subject: 'From Confusion',
    body: 'Hello my friends ...'
  });
}
const ContactComponent = () => {

  return (
    <Animatable.View animation="fadeInDown" duration={2000} delay={300}>
      <Card containerStyle={styles.cardContainer}>
      
      <View style={styles.titleContainer}>
        <Text style={styles.title}>Contact Information</Text>
      </View>

      <Divider style={styles.divider} />
      
      <Text style={styles.text}>
        <Text style={styles.bold}>Address:</Text>
        121, Clear Water Bay Road{"\n"}
        Clear Water Bay, Kowloon{"\n"}
        HONG KONG
      </Text>
      
      <Text style={styles.text}>
        <Text style={styles.bold}>Tel:</Text> +852 1234 5678{"\n"}
        <Text style={styles.bold}>Fax:</Text> +852 8765 4321{"\n"}
        <Text style={styles.bold}>Email:</Text> confusion@food.net
      </Text>

      <Button title=' Compose Email' buttonStyle={{ backgroundColor: '#7cc' }}
            icon={<Icon name='envelope-o' type='font-awesome' color='white' />}
            onPress={composeMail} />
      </Card>
    </Animatable.View>
  )
}


const styles = StyleSheet.create({
  cardContainer: {
    padding: 20,
    borderRadius: 10,
  },
  titleContainer: {
    alignItems: 'center',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  divider: {
    backgroundColor: "gray",
    marginBottom: 10,
  },
  text: {
    fontSize: 16,
    marginBottom: 5,
  },
  bold: {
    fontWeight: 'bold',
  },
});

export default ContactComponent;
