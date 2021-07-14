<template>
  <div>
    <header class="base-header-title base-title-font">DAG图编辑器</header>
    <el-input
      v-model="searchValue"
      class="search-input"
      placeholder="search"
      @change="searchStencil"
    ></el-input>
    <header class="base-header-title base-title-font">基础操作</header>
    <main id="stencil-container" class="list-box">
      <div
        v-for="item in dataList"
        :key="item.value"
        class="list-item"
        @mousedown="DragStencil(item.value, $event)"
      >
        {{ item.label }}
      </div>
    </main>
  </div>
</template>

<script>
import { cloneDeep } from "lodash";
import DagGraph from "../../graph";
import { initformData, stencilList } from "../../const/config";
export default {
  name: "StencilTree",
  data() {
    return {
      searchValue: ""
    };
  },
  computed: {
    dataList() {
      let list = cloneDeep(stencilList);
      let value = this.searchValue;
      return list.filter((item) => item.label.includes(value));
    }
  },
  mounted() {
    DagGraph.initStencilTree("stencil-container");
  },
  methods: {
    // 拖拽事件
    DragStencil(shape, event) {
      const { dnd, graph } = DagGraph;
      let node = graph.createNode({
        shape: shape,
        data: cloneDeep(initformData[shape])
      });
      dnd.start(node, event);
    },
    // 搜索模型
    searchStencil() {}
  }
};
</script>

<style lang="scss" scoped>
.search-input {
  width: 196px;
  height: 32px;
  margin: 16px 24px;
}
.list-box {
  margin-left: 30px;
  margin-top: 7px;
}
.list-item {
  height: 32px;
  line-height: 32px;
  font-size: 14px;
  font-family: Source Han Sans CN;
  font-weight: 400;
  color: #b1dce1;
}
</style>
