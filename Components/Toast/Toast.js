import React, { Component } from 'react';
import {
  Text,
  View,
  Animated
} from 'react-native';
import styles from './styles';

export default class ToastIOS extends Component {

  constructor(props) {
    super(props);
    this.show = this.show.bind(this);
    this.hide = this.hide.bind(this);
    this.state = {
      height: 0, duration: 0, autoHide: true, text: '', bgColor: '', color: '', fontSize: 0, inProgress: false, isVisible: false, animation: new Animated.Value(0)
    };
  }

  static _ref = null;

  // Here we get the context of the app from App.js
  static setRef(ref = {}) {
    this._ref = ref;
  }

  // Here we recive the args from any components and pass it as a ref on this componets
  static show({ text, duration = 2000, bgColor = '#000000', color = '#FFFFFF', fontSize = 15}) {
    this._ref.show(text, duration, bgColor, color, fontSize);
  }

  // Here we hide the toast
  static hide() {
    this._ref.hide();
  }

  // Here we setState as async handler for update the crruent state each components is using
  _setState = reducer => new Promise((resolve) => this.setState(reducer, () => resolve()));

  async show(text, duration, bgColor, color, fontSize) {
    const { inProgress, isVisible } = this.state;

    // Here we first hide the toast if there crruent one showing
    if (inProgress || isVisible) {
      await this.hide();
    }

    // Here we set the state accrodingly for eact components
    await this._setState((prevState) => ({
      ...prevState,
      height: prevState.height,
      inProgress: true,
      text, duration, bgColor, color, fontSize
    }));

    // Here we start the animation
    await this.onAnimateionChangeing({ toValue: 1 });
    await this._setState((prevState) => ({
      ...prevState,
      isVisible: true,
      inProgress: false
    }));

    // Here we first clear the previous timeout
    this.clearTimer();

    const { autoHide } = this.state;

    // Here we start the timer for authide the toast
    if (autoHide) {
      this.startTimer();
    }
  }

  // Here we hide the toast
  async hide() {
    await this._setState((prevState) => ({
      ...prevState,
      inProgress: true
    }));
    await this.onAnimateionChangeing({ toValue: 0 });
    this.clearTimer();
    await this._setState((prevState) => ({
      ...prevState,
      isVisible: false,
      inProgress: false
    }));
  }

  onAnimateionChangeing = ({ toValue }) => {
    const { animation } = this.state;
    return new Promise((resolve) => {
      Animated.spring(animation, {
        toValue,
        velocity: 3,
        tension: 2,
        friction: 8,
        useNativeDriver: true
      }).start(() => resolve());
    });
  }

  startTimer = () => {
    const { duration } = this.state;
    this.timer = setTimeout(() => this.hide(), duration);
  }

  clearTimer() {
    clearTimeout(this.timer);
    this.timer = null;
  }

  // Here we set the tost layout height
  setLayout = e => this.setState({ height: e.nativeEvent.layout.height });

  getStyle() {
    const { height, animation } = this.state;
    const offset = 5;
    const outputRange = [height, offset];;

    const translateY = animation.interpolate({
      inputRange: [0, 1],
      outputRange
    });

    return [
      styles.subView,
      {
        transform: [{ translateY }]
      }
    ];
  }

  render() {
    const { text, bgColor, color, fontSize } = this.state;
    return (
      <Animated.View
        onLayout={this.setLayout}
        style={[this.getStyle(), { backgroundColor: bgColor }]}
      >
        <View style={styles.container}>
          <Text style={[styles.messageText, { color, fontSize }]}>{text}</Text>
        </View>
      </Animated.View>
    );
  }
}
