<template>
  <div>
    <router-link :to="{name: 'admin:goods:index'}">123333</router-link>
  </div>
</template>

<script>
  export default {
    name: "goods-create-success",
    data: function () {
      return {
        index: 3,
      }
    },
    created: function () {
      this.$store.state.admin.index.progress.index = this.index;
      this.$store.state.admin.index.progress.label = this.$store.state.admin.index.progress.valueLabel[this.$store.state.admin.index.progress.index - 1].name;
      this.$store.state.admin.index.progress.variant = this.$store.state.admin.index.progress.valueLabel[this.$store.state.admin.index.progress.index-1].variant;
      this.$store.state.admin.index.progress.progressValue = 100 / (this.$store.state.admin.index.progress.maxIndex - 1) * this.$store.state.admin.index.progress.index

    },
    mounted: function () {
      this.$store.state.admin.index.progress.index = this.index;
      this.$store.state.admin.index.progress.label = this.$store.state.admin.index.progress.valueLabel[this.$store.state.admin.index.progress.index - 1].name;
      this.$store.state.admin.index.progress.variant = this.$store.state.admin.index.progress.valueLabel[this.$store.state.admin.index.progress.index-1].variant;
      this.$store.state.admin.index.progress.progressValue = 100 / (this.$store.state.admin.index.progress.maxIndex - 1) * this.$store.state.admin.index.progress.index

    },
  }
</script>

<style scoped>

</style>
