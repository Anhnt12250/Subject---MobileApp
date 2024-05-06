import React, { Component } from 'react';
import { Text, FlatList, StyleSheet } from 'react-native';
import { Card, ListItem, Avatar } from 'react-native-elements';
import { ScrollView } from 'react-native-virtualized-view';
import { baseUrl } from '../shared/baseUrl';
import Loading from './Loading';


const History = () => {
  return (
    <Card>
        <Card.Title >
          Our History
        </Card.Title>
        <Card.Divider/>
        <Text style={styles.fontBold}>
          Started in 2010, Ristorante con Fusion quickly established itself as a culinary icon par excellence in Hong Kong. With its unique brand of world fusion cuisine that can be found nowhere else, it enjoys patronage from the A-list clientele in Hong Kong.  Featuring four of the best three-star Michelin chefs in the world, you never know what will arrive on your plate the next time you visit us.
        </Text>
        <Text style={styles.fontBold}>
          The restaurant traces its humble beginnings to The Frying Pan, a successful chain started by our CEO, Mr. Peter Pan, that featured for the first time the world's best cuisines in a pan.
        </Text>
    </Card>
  );
}

// class RenderLeaderItem extends Component {
//   render() {
//     const leaders = this.props.leaders;
//     if (leaders != null) {
//       return (
//         <Card>
//           <Card.Title>Coperate Leadership</Card.Title>
//           <Card.Divider/>
//           {leaders.map((leader) => (
//             <ListItem key={leader.id} >
//               <Avatar rounded source={leader.image}/>
//               <ListItem.Content>
//                 <ListItem.Title style={styles.leaderName}>{leader.name}</ListItem.Title>
//                 <ListItem.Subtitle style={{color:'gray'}}>{leader.description}</ListItem.Subtitle>
//               </ListItem.Content>
//             </ListItem>
//           ))}
//         </Card>
//       );
//     } 
//     return <View />;
//   }
// }

//Nếu sài ScrollView của react-native thì sẽ bị lỗi do dùng FlatList lồng trong ScrollView, nên ta dùng ScrollView từ react-native-virtualized-view
class RenderLeaderItem extends Component {
  render() {
    if (this.props.isLoading) {
      return (
        <Card>
          <Card.Title>Corporate Leadership</Card.Title>
          <Card.Divider />
          <Loading />
        </Card>
      );
    } else if (this.props.errMess) {
      return (
        <Card>
          <Card.Title>Corporate Leadership</Card.Title>
          <Card.Divider />
          <Text>{this.props.errMess}</Text>
        </Card>
      );
    } else {
      return (
        <Card>
          <Card.Title>Corporate Leadership</Card.Title>
          <Card.Divider />
          <FlatList data={this.props.leaders}
            renderItem={({ item, index }) => this.renderLeaderItem(item, index)}
            keyExtractor={(item) => item.id.toString()} />
        </Card>
      );
    }
  }
  renderLeaderItem(item, index) {
    return (
      <ListItem key={index}>
        <Avatar rounded source={{ uri: baseUrl + item.image }} />
        <ListItem.Content>
          <ListItem.Title style={styles.leaderName}>{item.name}</ListItem.Title>
          <ListItem.Subtitle style={{color:'gray'}}>{item.description}</ListItem.Subtitle>
        </ListItem.Content>
      </ListItem>
    );
  }
}

// redux
import { connect } from 'react-redux';
const mapStateToProps = (state) => {
  return {
    leaders: state.leaders
  }
};

class About extends Component {
  constructor(props) {
    super(props);
  }
  render() {
    return (
      <ScrollView>
        <History />
        <RenderLeaderItem leaders={this.props.leaders.leaders} isLoading={this.props.leaders.isLoading} errMess={this.props.leaders.errMess} />
      </ScrollView>
    )
  }
}

const styles = StyleSheet.create({
  fontBold: {
    fontWeight: '600',
    margin: 10
  },
  leaderName: {
    fontWeight: 'bold', 
    marginBottom: 5
  }
});

export default connect(mapStateToProps)(About);