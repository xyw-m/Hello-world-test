<template>
  <div>
    <el-button @click="back">back</el-button>
  </div>
</template>

<script>
export default {
  methods: {
    back() {
      this.$router.push({
        path: '/',
      });
    },
  },
};
</script>
