<template>
  <svg :class="svgClass" class="main-color" aria-hidden="true" :style="[baseStyles, addStyles]" @click="onClick">
    <use :xlink:href="iconName" />
  </svg>
</template>
<script>
export default {
  name: 'IconSvg',
  props: {
    iconClass: {
      type: String,
      required: true
    },
    styleObj: {
      type: Object,
      default: function() {
        return {}
      }
    },
    width: {
      type: [String, Number],
      default: '10'
    },
    height: {
      type: [String, Number],
      default: '10'
    },
    color: {
      type: String,
      default: ''
    },
    addStyles: {
      type: Object,
      default: function() {
        return {}
      }
    },
    className: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      baseStyles: {
        width: this.width + 'px',
        height: this.height + 'px',
        color: this.color
      }
    }
  },
  computed: {
    iconName() {
      return `#icon${this.iconClass}`
    },
    svgClass() {
      if (this.className) {
        return 'svg-icon ' + this.className
      } else {
        return 'svg-icon'
      }
    }
  },
  methods: {
    onClick() {
      this.$emit('Click')
    }
  }
}
</script>
<style scoped>
  .svg-icon {
    width: 1em;
    height: 1em;
    vertical-align: -0.15em;
    overflow: hidden;
  }
</style>
