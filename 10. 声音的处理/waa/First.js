import React, { Component } from 'react';
import { Button, Slider, Select, Row, Col, InputNumber, message } from 'antd';
import banyao from '../../media/banyao.mp3';
import shanhuhai from '../../media/shanhuhai.mp3';

let audioCtx = null;
let audioNode = null;
let audioSource = null;
let gainNode = null;
let biquadFilter = null;
let pannerNode = null;
let waveShaper = null;
let song = [{
  title: '半妖',
  url: banyao
}, {
  title: '珊瑚海',
  url: shanhuhai
}];

function makeDistortionCurve(amount) {
  var k = typeof amount === 'number' ? amount : 50,
    n_samples = 44100,
    curve = new Float32Array(n_samples),
    deg = Math.PI / 180,
    i = 0,
    x;
  for ( ; i < n_samples; ++i ) {
    x = i * 2 / n_samples - 1;
    curve[i] = ( 3 + k ) * x * 20 * deg / ( Math.PI + k * Math.abs(x) );
  }
  return curve;
};

class First extends Component {
  constructor() {
    super();
    this.state = {
      canplay: false,
      playing: false,
      mode: 'now',
      filterType: 'allpass'
    };
  }

  componentDidMount() {
    try {
      window.AudioContext = window.AudioContext || window.webkitAudioContext;
      audioCtx = new window.AudioContext();

      this.loadAudio();
    } catch (error) {
      message.error(error);
    }
  }

  loadAudio() {
    const url = song[1].url;
    audioNode = document.createElement('audio');
    audioNode.preload = 'metadata';
    audioNode.crossOrigin = 'Anonymous';
    audioNode.autoplay = false;
    audioNode.src = url;
    audioNode.load();

    this.bindEvent(audioNode);
  }

  loaded() {
    audioSource = audioCtx.createMediaElementSource(audioNode);
    gainNode = audioCtx.createGain();
    biquadFilter = audioCtx.createBiquadFilter();
    pannerNode = audioCtx.createStereoPanner();
    waveShaper = audioCtx.createWaveShaper();
    audioSource.connect(gainNode);
    gainNode.connect(biquadFilter);
    biquadFilter.connect(pannerNode);
    pannerNode.connect(audioCtx.destination);
    // pannerNode.connect(waveShaper);
    // waveShaper.connect(audioCtx.destination);

    biquadFilter.type = this.state.filterType;
    biquadFilter.frequency.setValueAtTime(1000, audioCtx.currentTime);

    console.log(biquadFilter);

    // waveShaper.curve = makeDistortionCurve(400);
    // waveShaper.oversample = '4x';
  }

  bindEvent(node) {
    node.addEventListener('loadedmetadata', () => {
      message.success('loaded success');
      this.loaded();
    });
    node.addEventListener('canplay', () => {
      console.log('canplay');
      this.setStateData({
        canplay: true
      })
    });
    node.addEventListener('playing', () => {
      this.setStateData({
        playing: true
      })
    });
    node.addEventListener('pause', () => {
      this.setStateData({
        playing: false
      })
    });
    node.addEventListener('ended', () => {
      this.setStateData({
        playing: false
      })
    });
    node.addEventListener('error', () => {
      message.error('load audio fail');
    });
  }

  setStateData(data) {
    const newData = Object.assign({}, this.state, data);
    this.setState(newData);
  }

  controlAudio() {
    if (!this.state.canplay) {
      return;
    }
    if (!this.state.playing) {
      audioNode.play();
    } else {
      audioNode.pause();
    }
  }

  changeVolume(vol) {
    if (gainNode) {
      switch (this.state.mode) {
        case 'now':
          gainNode.gain.setValueAtTime(vol, audioCtx.currentTime);
          break;
        case 'delay':
          gainNode.gain.setValueAtTime(vol, audioCtx.currentTime + 2);
          break;
        case 'linear':
          gainNode.gain.linearRampToValueAtTime(vol, audioCtx.currentTime + 2);
          break;
        case 'exponential':
        gainNode.gain.exponentialRampToValueAtTime(vol, audioCtx.currentTime + 3);
          break;
        default:
          break;
      }
    }
  }

  changeFilterType(val) {
    this.setStateData({ filterType: val });
    biquadFilter.type = val;
  }

  changeFilterFrequency(val) {
    biquadFilter.frequency.setValueAtTime(val, audioCtx.currentTime);
  }

  changeFilterQ(val) {
    biquadFilter.Q.setValueAtTime(val, audioCtx.currentTime);
  }

  changeFilterGain(val) {
    biquadFilter.gain.setValueAtTime(val, audioCtx.currentTime);
  }

  changeMode(val) {
    this.setStateData({ mode: val });
  }

  changePan(val) {
    pannerNode.pan.setValueAtTime(val, audioCtx.currentTime);
  }

  render() {
    return (
      <section>
        <h3>WAA demo</h3>
        <p>{song[1].title}</p>
        <Row>
          <Col span={1}>
            <Button type="primary" shape="circle" icon={this.state.playing ? 'pause' : 'caret-right'} onClick={() => {this.controlAudio()}}></Button>
          </Col>
          <Col span={2}>
            <Select value={this.state.mode} onChange={(val) => {this.changeMode(val)}}>
              <Select.Option value='now'>即刻</Select.Option>
              <Select.Option value='delay'>延时</Select.Option>
              <Select.Option value='linear'>线性</Select.Option>
              <Select.Option value='exponential'>指数</Select.Option>
            </Select>
          </Col>
          <Col span={3}>
            <Slider defaultValue={1} max={1} min={0} step={0.1} onAfterChange={(val) => this.changeVolume(val)} />
          </Col>
        </Row>
        <Row>
          <Col span={2}>双二阶滤波器</Col>
          <Col span={3}>
            <span>type</span>
            <Select value={this.state.filterType} onChange={(val) => {this.changeFilterType(val)}}>
              <Select.Option value='allpass'>allpass</Select.Option>
              <Select.Option value='lowpass'>lowpass</Select.Option>
              <Select.Option value='highpass'>highpass</Select.Option>
              <Select.Option value='bandpass'>bandpass</Select.Option>
              <Select.Option value='lowshelf'>lowshelf</Select.Option>
              <Select.Option value='highshelf'>highshelf</Select.Option>
              <Select.Option value='peaking'>peaking</Select.Option>
              <Select.Option value='notch'>notch</Select.Option>
            </Select>
          </Col>
          <Col span={3}>
            <span>frequency</span>
            <InputNumber min={100} defaultValue={1000} onChange={(val) => {this.changeFilterFrequency(val)}} />
          </Col>
          <Col span={3}>
            <span>Q</span>
            <InputNumber min={-5000} max={5000} defaultValue={1} onChange={(val) => {this.changeFilterQ(val)}} />
          </Col>
          <Col span={3}>
            <span>Gain</span>
            <InputNumber min={-200} max={200} defaultValue={0} onChange={(val) => {this.changeFilterGain(val)}} />
          </Col>
        </Row>
        <Row>
          <Col span={2}>StereoPanner</Col>
          <Col span={4}>
              <Slider defaultValue={0} max={1} min={-1} step={0.1} onAfterChange={(val) => {this.changePan(val)}} />
          </Col>
        </Row>
      </section>
    );
  }
};

export default First;
