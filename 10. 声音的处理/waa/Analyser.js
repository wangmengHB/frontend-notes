import React, { Component } from 'react';
import { Button, Row, Col, message } from 'antd';
import banyao from '../../media/banyao.mp3';

let audioCtx = null;
let audioNode = null;
let audioSource = null;
let analyserNode = null;
let canvasCtx= null;
let animationThread = null;
let gradient = null;

class Analyser extends Component {
  constructor() {
    super();
    this.state = {
      url: banyao,
      canplay: false,
      playing: false,
      canvasWidth: 800,
      canvasHeight: 400,
      columnWidth: 20,
      columnGap: 5,
      columnNum: 0,
      barStep: 0
    }
  }

  componentDidMount() {
    try {
      window.AudioContext = window.AudioContext || window.webkitAudioContext;
      audioCtx = new window.AudioContext();

      this.loadAudio();
    } catch (error) {
      message.error(error);
    }
    canvasCtx = this.refs.canvas.getContext('2d');
  }

  componentWillUnmount() {
    if (audioCtx) {
      analyserNode.disconnect(audioCtx.destination);
    }
    if (animationThread) {
      cancelAnimationFrame(animationThread);
    }
  }

  loadAudio() {
    const url = this.state.url;
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
    analyserNode = audioCtx.createAnalyser();
    audioSource.connect(analyserNode);
    analyserNode.connect(audioCtx.destination);
    analyserNode.fftSize = 256;
    console.log(analyserNode);
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
      });
      this.startDraw();
    });
    node.addEventListener('pause', () => {
      this.setStateData({
        playing: false
      });
      if (animationThread) {
        cancelAnimationFrame(animationThread);
      }
    });
    node.addEventListener('ended', () => {
      this.setStateData({
        playing: false
      });
      if (animationThread) {
        cancelAnimationFrame(animationThread);
      }
    });
    node.addEventListener('error', () => {
      message.error('load audio fail');
    });
  }

  startDraw() {
    gradient = canvasCtx.createLinearGradient(0, 0, 0, this.state.canvasHeight);
    gradient.addColorStop(0, '#07EEF2');
    gradient.addColorStop(1, '#F56B5C');
    this.setStateData({
      columnNum: Math.floor(this.state.canvasWidth / (this.state.columnWidth + this.state.columnGap))
    });
    this.setStateData({
      barStep: Math.floor(analyserNode.frequencyBinCount / this.state.columnNum)
    })
    if (animationThread) {
      cancelAnimationFrame(animationThread);
    }
    animationThread = requestAnimationFrame(this.drawBar.bind(this));
  }

  drawBar() {
    const maxValue = 255;
    const array = new Uint8Array(analyserNode.frequencyBinCount);
    analyserNode.getByteFrequencyData(array);
    canvasCtx.clearRect(0, 0, this.state.canvasWidth, this.state.canvasHeight);
    for (let i = 0; i < this.state.columnNum; i++) {
      const value = array[i * this.state.barStep] / maxValue * this.state.canvasHeight;
      canvasCtx.fillStyle = gradient;
      canvasCtx.fillRect(
        i * (this.state.columnWidth + this.state.columnGap) + this.state.columnGap,
        this.state.canvasHeight - value,
        this.state.columnWidth,
        this.state.canvasHeight
      );
    }
    this.animationThread = requestAnimationFrame(this.drawBar.bind(this));
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

  render() {
    return (
      <section>
        <h3>Analyser demo</h3>
        <Row>
          <Col span={1}>
            <Button type="primary" shape="circle" icon={this.state.playing ? 'pause' : 'caret-right'} onClick={() => {this.controlAudio()}}></Button>
          </Col>
          <Col span={2}>半妖</Col>
        </Row>
        <canvas ref="canvas" style={{
          display: 'block',
          backgroundColor: 'black',
          width: '800px',
          height: '400px'
          }} width={this.state.canvasWidth} height={this.state.canvasHeight}></canvas>
      </section>
    );
  }
};

export default Analyser;
