import { Image, TouchableHighlight } from 'react-native';
import Voice from '@react-native-voice/voice';

export default class VoiceRecog {
  state = {
    recognized: '',
    pitch: '',
    error: '',
    end: '',
    started: '',
    results: [],
    partialResults: [],
  };

  constructor(props) {
    Voice.onSpeechStart = this.onSpeechStart;
    Voice.onSpeechResults = this.onSpeechResults;
    Voice.onSpeechPartialResults = this.onSpeechPartialResults;
  }

  componentWillUnmount() {
    Voice.destroy().then(Voice.removeAllListeners);
  }

  onSpeechResults = (e) => {
    console.log('onSpeechResults: ', e);
    this.state.results = e.value;
  };

  onSpeechPartialResults = (e) => {
    console.log('onSpeechPartialResults: ', e);
    this.state.partialResults = e.value;
  };

  startRecognizing = async () => {
    this.state = {
      recognized: '',
      pitch: '',
      error: '',
      end: '',
      started: '',
      results: [],
      partialResults: [],
    };

    try {
      await Voice.start('en-US');
    } catch (e) {
      console.error(e);
    }
  };

  stopRecognizing = async () => {
    try {
      await Voice.stop();
    } catch (e) {
      console.error(e);
    }
  };

  _destroyRecognizer = async () => {
    try {
      await Voice.destroy();
    } catch (e) {
      console.error(e);
    }
    this.state = {
      recognized: '',
      pitch: '',
      error: '',
      end: '',
      started: '',
      results: [],
      partialResults: [],
    };
  };

//   render() {
//     return (
//         <TouchableHighlight onPress={this.startRecognizing}>
//           <Image source={require('./assets/like_alert.png')} />
//         </TouchableHighlight>
//     );
//   }
}