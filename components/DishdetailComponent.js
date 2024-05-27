import React,  {Component}  from 'react';
import { View, Text, FlatList, Modal, Button, PanResponder, Alert } from 'react-native';
import { Card, Image, Icon, Rating, Input } from 'react-native-elements';
import {ScrollView} from 'react-native-virtualized-view';
import { baseUrl } from '../shared/baseUrl';
import * as Animatable from 'react-native-animatable';


// redux
import { connect } from 'react-redux';
const mapStateToProps = (state) => {
  return {
    dishes: state.dishes,
    comments: state.comments,
    favorites: state.favorites
  }
};

import { postFavorite } from '../redux/ActionCreators';
import { postComment } from '../redux/ActionCreators';
const mapDispatchToProps = (dispatch) => ({
  postFavorite: (dishId) => dispatch(postFavorite(dishId)),
  postComment: (dishId, rating, author, comment) => dispatch(postComment(dishId, rating, author, comment))
});


class RenderDish extends Component {
  render() {
    // gesture
    const recognizeDrag = ({ moveX, moveY, dx, dy }) => {
      if (dx < -200) return 1; // right to left
      return 0;
    };

    const recognizeComment = ({moveX, moveY, dx, dy}) => {
      if(dx > 200)
        return 2; // left to right
      return 0;
    }

    const panResponder = PanResponder.create({
      onStartShouldSetPanResponder: (e, gestureState) => { return true; },
      onPanResponderEnd: (e, gestureState) => {
        if (recognizeDrag(gestureState) === 1) {
          Alert.alert(
            'Add Favorite',
            'Are you sure you wish to add ' + dish.name + ' to favorite?',
            [
              { text: 'Cancel', onPress: () => { /* nothing */ } },
              { text: 'OK', onPress: () => { this.props.favorite ? alert('Already favorite') : this.props.onPressFavorite() } },
            ]
          );
        }
        else if(recognizeComment(gestureState) === 2){
          this.props.onPressComment();
        }
        return true;
      }
    });

    // render
    const dish = this.props.dish;
    if (dish != null) {
      return (
        <Card {...panResponder.panHandlers}>
          <Image source={{ uri: baseUrl + dish.image }} style={{ width: '100%', height: 100, flexGrow: 1, alignItems: 'center', justifyContent: 'center' }}>
            <Card.FeaturedTitle>{dish.name}</Card.FeaturedTitle>
          </Image>
          <Text style={{ margin: 20 }}>{dish.description}</Text>
          <View style={{ flexDirection: 'row', justifyContent: 'center'}}> 
            <Icon raised reverse type='font-awesome' color='#f50'
            name={this.props.favorite ? 'heart' : 'heart-o'}
            onPress={() => this.props.favorite ? alert('Already favorite') : this.props.onPressFavorite()}/>
            <Icon raised reverse type='font-awesome' color='#7cc' 
            name={this.props.comment ? 'pencil': 'pencil'}
            onPress={() => this.props.onPressComment()} />
          </View>
        </Card>
      );
    }
    return (<View />);
  }
}

class RenderComments extends Component {
  render() {
    const comments = this.props.comments;
    return (
      <Card>
        <Card.Title>Comments</Card.Title>
        <Card.Divider />
        <FlatList data={comments}
          renderItem={({ item, index }) => this.renderCommentItem(item, index)}
          keyExtractor={(item) => item.id.toString()} />
      </Card>
    );
  }
  renderCommentItem(item, index) {
    return (
      <View key={index} style={{ margin: 10 }}>
        <Text style={{ fontSize: 14 }}>{item.comment}</Text>
        <Rating startingValue={item.rating} imageSize={16} readonly style={{ flexDirection : 'row'}} />
        {/* <Text style={{ fontSize: 12 }}>{item.rating} Stars</Text> */}
        <Text style={{ fontSize: 12 }}>{'-- ' + item.author + ', ' + item.date} </Text>
      </View>
    );
  };
}


class Dishdetail extends Component {
  constructor(props){
    super(props);
    this.state = {
      showModal: false,
      rating: 5,
      author: '',
      comment: ''
    };
    
  }

  render() {
    const dishId = parseInt(this.props.route.params.dishId);
    const dish = this.props.dishes.dishes[dishId];
    const comments = this.props.comments.comments.filter((cmt) => cmt.dishId === dishId);
    const favorite = this.props.favorites.some((el) => el === dishId);

    let inputAuthor = ''
    const setAuthor = (text) => {
      inputAuthor = text;
    }

    let inputComment = ''
    const setComment = (text) => {
      inputComment = text;
    }
    
    return (
      <ScrollView>
        <Animatable.View animation="fadeInDown" duration={2000} delay={300}>
          <RenderDish dish={dish}
          favorite={favorite} 
          onPressFavorite={() => this.markFavorite(dishId)}
          onPressComment={() => this.setState({showModal: true})} />
        </Animatable.View>

        <Animatable.View animation="fadeInDown" duration={2000} delay={300}>
          <RenderComments comments={comments}/>
        </Animatable.View>

        <Animatable.View animation="fadeInDown" duration={2000} delay={300}>
          <Modal visible={this.state.showModal}
            onRequestClose={() => this.setState({ showModal: false })}>
            <View style={{ justifyContent: 'center', margin: 20 }}>
              <Rating startingValue={this.state.rating} showRating={true}
                onFinishRating={(value) => this.setState({ rating: value })} />
              <View style={{ height: 20 }} />
              <Input placeholder='Author' leftIcon={{ name: 'user-o', type: 'font-awesome' }}
                onChangeText={(text) => setAuthor(text)} />
              <Input placeholder='Comment' leftIcon={{ name: 'comment-o', type: 'font-awesome' }}
                onChangeText={(text) => setComment(text)} />

              <View style={{ justifyContent: 'center' }}>
                <Button title='SUBMIT' color='#7cc' 
                  onPress={() => { this.submitComment(dishId, inputAuthor, inputComment); this.setState({ showModal: false }); }} />
                <View style={{ marginVertical: 10 }} />
                <Button title='CANCEL' color='#ccc'
                  onPress={() => { this.setState({ showModal: false }); }} />
              </View>
            </View>
          </Modal>
        </Animatable.View>
      </ScrollView>
    );
  }

  markFavorite(dishId){
    this.props.postFavorite(dishId);
  }

  submitComment(dishId, inputAuthor, inputComment){
    this.setState({ ...this.state, author: inputAuthor, comment: inputComment });
    this.props.postComment(dishId, this.state.rating, inputAuthor, inputComment);
  }

}
export default connect(mapStateToProps, mapDispatchToProps)(Dishdetail);
