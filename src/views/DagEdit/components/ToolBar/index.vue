<template>
  <div class="bar">
    <div class="bar-item icon-list">
      <el-tooltip
        class="item"
        effect="dark"
        content="初始化"
        placement="bottom"
      >
        <el-button
          name="init"
          class=""
          size="small"
          icon="el-icon-document-add"
          @click="handleClick"
        >
        </el-button>
      </el-tooltip>
      <!-- <el-tooltip
        class="item"
        effect="dark"
        content="清除 (Cmd + D)"
        placement="bottom"
      >
        <el-button
          name="delete"
          class="el-icon-delete"
          size="small"
          icon="delete"
          @click="handleClick"
        >
        </el-button>
      </el-tooltip> -->
      <el-tooltip
        class="item"
        effect="dark"
        content="撤销 (Cmd + Z)"
        placement="bottom"
      >
        <el-button
          :disabled="!isCanUse.canUndo"
          name="undo"
          class="el-icon-refresh-left"
          size="small"
          icon="undo"
          @click="handleClick"
        >
        </el-button>
      </el-tooltip>

      <el-tooltip
        class="item"
        effect="dark"
        content="重做 (Cmd + Shift + Z)"
        placement="bottom"
      >
        <el-button
          :disabled="!isCanUse.canRedo"
          name="redo"
          class="el-icon-refresh-right"
          size="small"
          icon="redo"
          @click="handleClick"
        >
        </el-button>
      </el-tooltip>

      <el-tooltip
        class="item"
        effect="dark"
        content="复制 (Cmd + C)"
        placement="bottom"
      >
        <el-button
          :disabled="!isCanUse.canCopy"
          name="copy"
          class="el-icon-document-copy"
          size="small"
          icon="copy"
          @click="handleClick"
        >
        </el-button>
      </el-tooltip>

      <el-tooltip
        class="item"
        effect="dark"
        content="剪切 (Cmd + X)"
        placement="bottom"
      >
        <el-button
          :disabled="!isCanUse.canCut"
          name="cut"
          class="el-icon-scissors"
          size="small"
          icon="scissor"
          @click="handleClick"
        >
        </el-button>
      </el-tooltip>

      <el-tooltip
        class="item"
        effect="dark"
        content="粘贴 (Cmd + V)"
        placement="bottom"
      >
        <el-button
          :disabled="!isCanUse.canPaste"
          name="paste"
          class="el-icon-copy-document"
          size="small"
          @click="handleClick"
        >
        </el-button>
      </el-tooltip>

      <el-tooltip
        class="item"
        effect="dark"
        content="保存PNG (Cmd + S)"
        placement="bottom"
      >
        <el-button
          name="savePNG"
          class="el-icon-download"
          size="small"
          icon="download"
          @click="handleClick"
        >
        </el-button>
      </el-tooltip>

      <el-tooltip
        class="item"
        effect="dark"
        content="打印 (Cmd + P)"
        placement="bottom"
      >
        <el-button
          name="print"
          class="el-icon-printer"
          size="small"
          @click="handleClick"
        >
        </el-button>
      </el-tooltip>
    </div>
    <div class="bar-item btn-list">
      <el-button class="btn-save" type="primary" plain @click="handleSave"
        >保 存</el-button>
      <!-- <el-button class="btn-cancel" type="primary" plain @click="handleBack"
        >取消</el-button
      > -->
    </div>
  </div>
</template>

<script>
import DagGraph from "../../graph";
import { DataUri } from "@antv/x6";
let graph = null;
export default {
  name: "ToolBar",
  components: {},
  props: {
    currentSelect: {
      type: String,
      default: "none"
    }
  },
  data() {
    return {
      isCanUse: {
        canUndo: "",
        canRedo: "",
        canCopy: "",
        canCut: "",
        canPaste: ""
      },
    };
  },
  watch: {
    currentSelect(val) {
      let bol = val !== "none";
      this.isCanUse.canCopy = bol;
      this.isCanUse.canCut = bol;
      if (!bol) {
        this.isCanUse.canPaste = bol;
      }
    }
  },
  mounted() {
    setTimeout(() => {
      graph = DagGraph?.graph;
      this.initEvent();
    }, 200);
  },
  methods: {
    initEvent() {
      const { history } = graph;
      history.on("change", () => {
        this.isCanUse.canUndo = history.canUndo();
        this.isCanUse.canRedo = history.canRedo();
      });
      graph.bindKey("ctrl+z", () => {
        if (history.canUndo()) {
          history.undo();
        }
        return false;
      });
      graph.bindKey("ctrl+shift+z", () => {
        if (history.canRedo()) {
          history.redo();
        }
        return false;
      });
      graph.bindKey("ctrl+d", () => {
        graph.clearCells();
        return false;
      });
      graph.bindKey("ctrl+s", () => {
        graph.toPNG((datauri) => {
          DataUri.downloadDataUri(datauri, "chart.png");
        });
        return false;
      });
      graph.bindKey("ctrl+p", () => {
        graph.printPreview();
        return false;
      });
      graph.bindKey("ctrl+c", this.copy);
      graph.bindKey("ctrl+v", this.paste);
      graph.bindKey("ctrl+x", this.cut);
    },
    copy() {
      const cells = graph.getSelectedCells();
      if (cells.length) {
        graph.copy(cells);
        this.isCanUse.canPaste = true;
      }
      return false;
    },
    cut() {
      const cells = graph.getSelectedCells();
      if (cells.length) {
        graph.cut(cells);
        this.isCanUse.canPaste = true;
      }
      return false;
    },
    paste() {
      if (!graph.isClipboardEmpty()) {
        const cells = graph.paste({ offset: 32 });
        graph.cleanSelection();
        graph.select(cells);
      }
      return false;
    },
    handleClick(event) {
      const name = event.currentTarget.name;
      switch (name) {
        case "init":
          this.initGraph();
          break;
        case "undo":
          graph.history.undo();
          break;
        case "redo":
          graph.history.redo();
          break;
        case "delete":
          graph.clearCells();
          break;
        case "savePNG":
          graph.toPNG(
            (dataUri) => {
              // 下载
              DataUri.downloadDataUri(dataUri, "chartx.png");
            },
            {
              backgroundColor: "white",
              padding: {
                top: 20,
                right: 30,
                bottom: 40,
                left: 50
              },
              quality: 1
            }
          );
          break;
        case "print":
          graph.printPreview();
          break;
        case "copy":
          this.copy();
          break;
        case "cut":
          this.cut();
          break;
        case "paste":
          this.paste();
          break;
        default:
          break;
      }
    },
    initGraph() {
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
    handleBack() {
      this.$emit("backTo");
    },
    handleSave() {
      this.$emit("saveStrategy");
    }
  }
};
</script>

<style lang="scss" scoped>
@import "./index.scss";
</style>
