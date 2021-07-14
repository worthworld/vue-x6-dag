<template>
  <div v-show="isShow" id="x6-menu-wrap" class="x6-menu-wrap">
    <div class="x6-menu">
      <div v-show="type == 'node'" class="x6-menu-item">
        <el-button icon="el-icon-document-copy" @click="copyNode"
          >复制</el-button
        >
      </div>
      <div class="x6-menu-item">
        <el-button icon="el-icon-delete" @click="deleteCell">删除</el-button>
      </div>
    </div>
  </div>
</template>

<script>
import DagGraph from "../../graph";
let graph = null;
export default {
  name: "ContextMenu",
  data() {
    return {
      type: "blank",
      isShow: false
    };
  },
  mounted() {
    if (DagGraph["graph"]) {
      graph = DagGraph["graph"];
      this.initEvent();
    }
  },
  beforeDestroy() {
    graph = null;
  },
  methods: {
    initEvent() {
      graph.on("cell:contextmenu", ({ e, cell }) => {
        let shape = cell.shape;
        if (shape == "start") return;
        this.isShow = true;
        graph.resetSelection(cell);
        const elem = document.querySelector(".x6-menu-wrap");
        elem.style.top = e.clientY + 25 + "px";
        elem.style.left = e.clientX + 25 + "px";
        this.type = cell.isNode() ? "node" : "edge";
      });
      graph.on("blank:click", () => {
        this.isShow = false;
        this.type = "blabk";
      });
    },
    copyNode() {
      const cells = graph.getSelectedCells();
      if (cells.length) {
        graph.copy(cells);
      }
      graph.paste({ offset: 32 });
      graph.cleanSelection();
      this.cancelShow();
    },
    // 删除边或节点和边
    deleteCell() {
      let cell = graph.getSelectedCells();
      graph.removeCells(cell);
      this.cancelShow();
    },
    cancelShow() {
      this.isShow = false;
    }
  }
};
</script>

<style lang="scss" scoped>
$back-ground-color: #183d42;
.x6-menu-wrap {
  position: absolute;
  z-index: 999;
  border: 1px solid rgba(44, 254, 255, 0.6);
  .x6-menu {
    position: relative;
    display: inline-block;
    min-width: 82px;
    min-height: 32px;
    margin: 0;
    padding: 4px 0;
    background-color: $back-ground-color;
    outline: 0;
    cursor: pointer;
    .x6-mune-item {
      width: 100%;
      padding: 0 10px;
    }
  }
}
::v-deep .x6-menu {
  .el-button {
    width: 100%;
    border: none;
    text-align: left;
    color: #2cfeff;
    background-color: $back-ground-color;
    &:hover {
      color: #2cfeff;
    }
  }
}
</style>
