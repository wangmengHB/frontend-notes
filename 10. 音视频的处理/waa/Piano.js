import React, { Component } from 'react';
import { Button, Select, InputNumber, message } from 'antd';
import waveformsUrl from '../../img/waveforms.webp';

// 发出的声音频率数据，表现为音调的高低
const arrFrequency = [196.00, 220.00, 246.94, 261.63, 293.66, 329.63, 349.23, 392.00, 440.00, 493.88, 523.25, 587.33, 659.25, 698.46, 783.99, 880.00, 987.77, 1046.50];
let audioCtx = null;
// let oscillator = null;
// let gainNode = null;

class Piano extends Component {
  constructor() {
    super();
    this.state = {
      type: 'sine',
      detune: 0
    };
  }

  componentDidMount() {
    try {
      window.AudioContext = window.AudioContext || window.webkitAudioContext;
      audioCtx = new window.AudioContext();

      // gainNode.gain.setValueAtTime(0, audioCtx.currentTime);
      //
    } catch (error) {
      message.error(error);
    }
  }

  playNote(index) {
    const frequency = arrFrequency[index + 9];
    const oscillator = audioCtx.createOscillator();
    const gainNode = audioCtx.createGain();

    console.log(oscillator);
    oscillator.connect(gainNode);
    gainNode.connect(audioCtx.destination);
    // 指定音调的类型，sine|square|triangle|sawtooth
    oscillator.type = this.state.type;
    // 设置当前播放声音的频率，default 440Hz
    oscillator.frequency.value = frequency;
    // detune, default 0
    oscillator.detune.value = this.state.detune;
    oscillator.start(audioCtx.currentTime);

    gainNode.gain.setValueAtTime(0, audioCtx.currentTime);
    gainNode.gain.linearRampToValueAtTime(1, audioCtx.currentTime + 0.01);

    gainNode.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 1);
    gainNode.gain.setValueAtTime(0, audioCtx.currentTime + 2);
    oscillator.stop(audioCtx.currentTime + 2);
  }

  changeType(val) {
    const data = Object.assign({}, this.state);
    data.type = val;
    this.setState(data);
  }

  changeDetune(val) {
    const data = Object.assign({}, this.state);
    data.detune = val;
    this.setState(data);
  }

  render() {
    return (
      <section style={{width: '100%'}}>
        <h3>Piano demo</h3>
        <Button.Group>
          <Button onClick={() => {this.playNote(-1)}}>中A</Button>
          <Button onClick={() => {this.playNote(0)}}>中B</Button>
          <Button onClick={() => {this.playNote(1)}}>中C</Button>
          <Button onClick={() => {this.playNote(2)}}>中D</Button>
          <Button onClick={() => {this.playNote(3)}}>中E</Button>
          <Button onClick={() => {this.playNote(4)}}>中F</Button>
          <Button onClick={() => {this.playNote(5)}}>中G</Button>
          <Button onClick={() => {this.playNote(6)}}>A</Button>
          <Button onClick={() => {this.playNote(7)}}>B</Button>
          <Button onClick={() => {this.playNote(8)}}>C</Button>
        </Button.Group>
        <div style={{margin: '20px'}}>
          <span>波形</span>
          <Select value={this.state.type} onChange={(val) => {this.changeType(val)}}>
            <Select.Option value="sine">正弦</Select.Option>
            <Select.Option value="square">方形</Select.Option>
            <Select.Option value="sawtooth">锯齿</Select.Option>
            <Select.Option value="triangle">三角</Select.Option>
            {/* <Select.Option value="custom">custom</Select.Option> */}
          </Select>
        </div>
        <div style={{margin: '20px'}}>
          <span>音高</span>
          <InputNumber min={-1000} max={153600} value={this.state.detune} onChange={(val) => {this.changeDetune(val)}} />
        </div>
        <div style={{width: '50%', margin: '20px'}}>
          <img style={{width: '100%'}} src={waveformsUrl} alt=""/>
          <a href="https://codepen.io/gregh/pen/LxJEaj" target="_blank">CodePen demo 1</a>
          <a href="https://codepen.io/gregh/pen/RKVNgB" target="_blank">CodePen demo 2</a>
        </div>
      </section>
    );
  }
};

export default Piano;
