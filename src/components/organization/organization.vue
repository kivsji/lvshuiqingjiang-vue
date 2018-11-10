<template>
    <Modal class="orgPage" v-model="orgModal" title="Common Modal dialog box title" @on-ok="ok" @on-cancel="cancel">
        <i-row>
            <i-col>
                <Tree :data="treeData" :render="renderContent"></Tree>
            </i-col>
            <i-col>

            </i-col>
            <i-col>

            </i-col>
        </i-row>
    </Modal>
</template>

<script>
export default {
  data() {
    return {
      orgModal: false,
      treeData: [
        {
          title: "parent 1",
          expand: true,
          children: [
            {
              title: "parent 1-1",
              expand: true,
              children: [
                {
                  title: "leaf 1-1-1"
                },
                {
                  title: "leaf 1-1-2"
                }
              ]
            },
            {
              title: "parent 1-2",
              expand: true,
              children: [
                {
                  title: "leaf 1-2-1"
                },
                {
                  title: "leaf 1-2-1"
                }
              ]
            }
          ]
        }
      ]
    };
  },
  props: {},
  methods: {
    ok() {
      this.$Message.info("Clicked ok");
    },
    cancel() {
      this.$Message.info("Clicked cancel");
    }
  }
};
</script>

<style>
.orgPage {
  width: 800px;
}
</style>
