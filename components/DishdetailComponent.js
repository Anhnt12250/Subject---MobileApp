import React,  {Component}  from 'react';
import { View, Text, FlatList, Modal, Button } from 'react-native';
import { Card, Image, Icon, Rating, Input } from 'react-native-elements';
import {ScrollView} from 'react-native-virtualized-view';
// import { DISHES } from '../shared/dishes';
// import { COMMENTS } from '../shared/comments';
import { baseUrl } from '../shared/baseUrl';

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

// import { postComment } from '../redux/ActionCreators';
// const mapDispatchToProps = (dispatch) => ({
//   postComment: (dishId) => dispatch(postComment(dishId))
// });

class RenderDish extends Component {
  render() {
    const dish = this.props.dish;
    if (dish != null) {
      return (
        <Card>
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
    // this.state = {
    //   dishes: DISHES,
    //   comments: COMMENTS,
    //   favorites: [],
    // };
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
        <RenderDish dish={dish}
        favorite={favorite} 
        onPressFavorite={() => this.markFavorite(dishId)}
        onPressComment={() => this.setState({showModal: true})} />

        <RenderComments comments={comments}/>
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
      </ScrollView>
      // <RenderDish dish={this.props.dish} />
      
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
