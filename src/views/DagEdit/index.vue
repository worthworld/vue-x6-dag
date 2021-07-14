<template>
  <div class="wrap">
    <aside id="dag-stencil" class="panel-left">
      <StencilTree v-if="enabled"></StencilTree>
    </aside>
    <main class="panel-center">
      <div class="tool-bar">
        <ToolBar
          v-if="enabled"
          :current-select="currentSelect"
          @saveStrategy="handleSaveDag"
        ></ToolBar>
      </div>
      <div class="x6-graph-box">
        <div id="x6-graph-container" class="x6-graph-container"></div>
      </div>
    </main>
    <aside class="panel-right">
      <!-- <el-tabs v-model="activeName" type="border-card">
          <el-tab-pane label="属性编辑" name="nodeData">
                   </el-tab-pane>
          <el-tab-pane label="设计" name="dataConfig"> </el-tab-pane>
        </el-tabs> -->
      <header class="base-header-title">属性编辑</header>
      <div v-if="enabled" class="right-content">
        <!-- 判断节点 -->
        <EditConditionForm
          v-if="currentSelect === 'fork'"
          ref="conditionForm"
          :form-data="cellData"
          @updateCellData="setNodeInfo"
        ></EditConditionForm>
        <!-- 算法组件 -->
        <EditOrderForm
          v-else-if="currentSelect === 'pipeline'"
          ref="orderForm"
          :form-data="cellData"
          @updateCellData="setNodeInfo"
        >
        </EditOrderForm>
        <div v-else class="tips-info"><i class="el-icon-info"></i>请点击节点进行编辑</div>
      </div>
    </aside>
    <ContextMenu v-if="enabled"></ContextMenu>
  </div>
</template>

<script>
import DagGraph from "./graph";
// import { commonEdage, commonPortsGroups } from "./const/config";
import ToolBar from "./components/ToolBar";
import ContextMenu from "./components/ContextMenu";
import EditConditionForm from "./components/EditConditionForm";
import EditOrderForm from "./components/EditOrderForm";
import StencilTree from "./components/StencilTree";
import {DagData} from "./const/data.js";
let graph = null;
export default {
  name: "EditorDag",
  components: {
    StencilTree,
    ToolBar,
    ContextMenu,
    EditConditionForm,
    EditOrderForm
  },
  data() {
    return {
      enabled: false,
      activeName: "nodeData",
      currentSelect: "none", // none、edge、pipeline、fork
      currentCell: null,
      cellData: {},
      graphData:null
    };
  },
  created() {},
  mounted() {
    this.initDagGraph();
  },
  beforeDestroy() {
    DagGraph.destroy();
  },
  methods: {
    // 初始化x6图编辑引擎
    initDagGraph() {
      graph = DagGraph.init("#x6-graph-container");
      this.enabled = true;
      this.initClickEvent();
             // // 装载流程图数据
      DagGraph.initGraphShape(DagData);
    },
    // 初始化开始节点
    initGraphStart() {
      graph.clearCells();
      graph.center(); // 内容居中
      graph.zoomTo(1); // 缩放比例
      const start_node = graph.createNode({
        shape: "start",
        x: 100,
        y: 300
      });
      graph.addNode(start_node);
    },
    // 初始化点击事件
    async initClickEvent() {
      graph.on("blank:click", async () => {
        if (this.currentCell !== null) {
           this.clearData();
        }
      });
      graph.on("cell:click",  ({ cell }) => {
        let isNode = cell.isNode();
                  this.clearData();
          if (isNode) {
          this.getNodeInfo(cell);

        }
    })
    },

    // 获取被选中节点的数据
    getNodeInfo(cell) {
      this.currentSelect = cell.shape;
      this.currentCell = cell;
      Object.assign(this.cellData, cell.getData());
      let nodeAttrs = cell.getAttrs();
      this.cellData.name = nodeAttrs?.label?.text;
    },
    // 清空选中节点数据
    clearData() {
      let data = this.$options.data();
      this.cellData = data.config;
      this.currentCell = null;
      this.currentSelect = "none";
      this.cellData = data.cellData;
    },
    // 设置当前选中节点的数据
    setNodeInfo(val) {
      this.cellData = val;
      if (val?.name) {
        let attr = {
          label: {
            text: this.cellData.name
          }
        };
        this.currentCell.setAttrs(attr);
      }
      let options = {
        silent: true,
        overwrite: true
      };
      this.currentCell.setData(this.cellData, options);
    },
    // 保存dag图数据
    handleSaveDag(){
      this.graphData=graph.toJSON();
    },
    backPage() {
      this.$router.go(-1);
    }
  }
};
</script>

<style lang="scss">
@import "./index.scss";
</style>
