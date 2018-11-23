<template>
	<div class="loader f0">
        <div class="line-scale-party">
          	<div :style="reStyle1"></div>
          	<div :style="reStyle2"></div>
          	<div :style="reStyle3"></div>
          	<div :style="reStyle4"></div>
        </div>
    </div>

</template>
<script>
export default {
  // ['#FFB800','#2196f3','#E13928','#FFB800']
  // ['#2196f3','#FFB800','#E13928','#2196f3']
  props: {
    reStyle: {
      type: Object,
      default: function() {
        return {};
      }
    },
    bgArray: {
      type: Array,
      default: function() {
        return ["#000", "#000", "#000", "#000"];
      }
    }
  },
  data() {
    return {};
  },
  computed: {
    reStyle1() {
      return Object.assign(
        _.cloneDeep(this.reStyle),
        this.forceBg(this.bgArray[0])
      );
    },
    reStyle2() {
      return Object.assign(
        _.cloneDeep(this.reStyle),
        this.forceBg(this.bgArray[1])
      );
    },
    reStyle3() {
      return Object.assign(
        _.cloneDeep(this.reStyle),
        this.forceBg(this.bgArray[2])
      );
    },
    reStyle4() {
      return Object.assign(
        _.cloneDeep(this.reStyle),
        this.forceBg(this.bgArray[3])
      );
    }
  },
  methods: {
    forceBg(color) {
      return {
        backgroundColor: color
      };
    }
  },
  mounted() {}
};
</script>
<style scoped>
.loader {
  display: inline-block;
}
@-webkit-keyframes line-scale-party {
  0% {
    -webkit-transform: scale(1);
    transform: scale(1);
  }

  50% {
    -webkit-transform: scale(0.5);
    transform: scale(0.5);
  }

  100% {
    -webkit-transform: scale(1);
    transform: scale(1);
  }
}

@keyframes line-scale-party {
  0% {
    -webkit-transform: scale(1);
    transform: scale(1);
  }

  50% {
    -webkit-transform: scale(0.5);
    transform: scale(0.5);
  }

  100% {
    -webkit-transform: scale(1);
    transform: scale(1);
  }
}

.line-scale-party > div:nth-child(1) {
  -webkit-animation-delay: 0.77s;
  animation-delay: 0.77s;
  -webkit-animation-duration: 1.26s;
  animation-duration: 1.26s;
}
.line-scale-party > div:nth-child(2) {
  -webkit-animation-delay: 0.29s;
  animation-delay: 0.29s;
  -webkit-animation-: 0.43s;
  animation-duration: 0.43s;
}
.line-scale-party > div:nth-child(3) {
  -webkit-animation-delay: 0.28s;
  animation-delay: 0.28s;
  -webkit-animation-duration: 1.01s;
  animation-duration: 1.01s;
}
.line-scale-party > div:nth-child(4) {
  -webkit-animation-delay: 0.74s;
  animation-delay: 0.74s;
  -webkit-animation-duration: 0.73s;
  animation-duration: 0.73s;
}
.line-scale-party > div {
  background-color: #000;
  width: 3px;
  height: 15px;
  border-radius: 1.5px;
  margin: 2px;
  -webkit-animation-fill-mode: both;
  animation-fill-mode: both;
  display: inline-block;
  -webkit-animation-name: line-scale-party;
  animation-name: line-scale-party;
  -webkit-animation-iteration-count: infinite;
  animation-iteration-count: infinite;
  -webkit-animation-delay: 0;
  animation-delay: 0;
}
</style>
