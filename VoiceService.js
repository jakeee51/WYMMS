import Voice from '@react-native-voice/voice';
import { sendBleCommand } from './BleService'; 


const prp = () => {
  var xhr = new XMLHttpRequest();
  xhr.onreadystatechange = function() {
      if (xhr.readyState == XMLHttpRequest.DONE) {
          console.log("PRP:", xhr.responseText);
      }
  }
  xhr.open("POST", "http://jakeee51.pythonanywhere.com/prp", true);
  xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
  xhr.send("deed=done");
  return xhr.responseText;
};

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
    console.log("onSpeechResults: ");
    this.state.results = e.value;
    for (let i = 0; i < e.value.length; i++) {
      if (e.value[i].toLowerCase().includes("will you marry me") || e.value[i].toLowerCase().includes("code beta test")) {
        sendBleCommand("ROBO", "RED"); prp();
        console.log("ACTIVATE OP RED"); break;
      }
      if (e.value[i].toLowerCase().includes("code beta reset")) {
        sendBleCommand("ROBO", "RECALL");
        break;
      }
    }
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

  destroyRecognizer = async () => {
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
}