import { Graph, Addon, Shape, Vector } from "@antv/x6";
import "./shape";
import { initformData, commonEdage } from "../const/config";
import { cloneDeep } from "lodash";
export default class DagGraph {
  static init(id) {
    const container = document.querySelector(id);
    this.graph = new Graph({
      container: container,
      autoResize: container,
      // background: {
      //   color: "#F7F7FA"
      // },
      // width: 500,
      // height: 500,
      // 网格
      grid: {
        size: 10,
        visible: false,
        args: {
          color: "#a0a0a0",
          thickness: 1
        }
      },
      // 画布调整
      scroller: {
        enabled: true,
        pageVisible: true,
        pageBreak: true,
        pannable: true,
        // modifiers: "ctrl",
        autoResize: true
      },
      // 设置滚轮缩放画布
      mousewheel: true,
      snapline: true,
      history: true, // 历史
      clipboard: true, // 复制
      keyboard: true,
      // 按ctrl框选节点
      selecting: {
        multiple: true,
        enabled: true,
        rubberband: true,
        modifiers: "ctrl",
        strict: true,
        movable: true,
        showNodeSelectionBox: false,
        showEdgeSelectionBox: false
      },
      // 配置全局连线规则
      connecting: {
        anchor: "center",
        connectionPoint: "anchor",
        allowBlank: false,
        allowMulti: false,
        highlight: true,
        snap: {
          radius: 25
        },
        createEdge() {
          let newEdge = new Shape.Edge(cloneDeep(commonEdage));
          return newEdge;
        },
        validateConnection({
          sourceView,
          targetView,
          sourceMagnet,
          targetMagnet
        }) {
          if (sourceView === targetView) {
            return false;
          }
          if (!sourceMagnet) {
            return false;
          }
          // 只能连接到输入链接桩
          if (
            !targetMagnet ||
            targetMagnet.getAttribute("port-group") !== "in"
          ) {
            return false;
          }
          return true;
        },
        highlighting: {
          magnetAvailable: {
            name: "stroke",
            args: {
              padding: 4,
              attrs: {
                strokeWidth: 4,
                stroke: "#31a3ff" //rgba(223,234,255)  #e52e1a
              }
            }
          }
        }
      },
      // 节点拖拽到另一节点，形成父子节点关系
      embedding: {
        enabled: true,
        findParent({ node }) {
          const bbox = node.getBBox();
          return this.getNodes().filter((node) => {
            // 只有 data.parent 为 true 的节点才是父节点
            const data = node.getData();
            if (data && data.parent) {
              const targetBBox = node.getBBox();
              return bbox.isIntersectWithRect(targetBBox);
            }
            return false;
          });
        }
      }
    });
    // this.initStencil(stencilId);
    // this.initShape();
    this.initEvent();
    // this.initAnimate();
    return this.graph;
  }
  //  初始化自定义模型树列表
  static initStencilTree(id) {
    const stencilWrap = document.querySelector(id);
    this.dnd = new Addon.Dnd({
      target: this.graph,
      scaled: true,
      containerParent: stencilWrap
    });

    // stencilWrap.appendChild(this.dnd.container);
  }
  // 初始化加载 拖拽组件列表
  static initStencil(id) {
    const { graph } = this;
    this.stencil = new Addon.Stencil({
      title: "算法组件",
      target: this.graph,
      search(cell, keyword) {
        let text = cell.attr("label/text") || "";
        return text.includes(keyword);
      },
      getDragNode(node) {
        // let shape = node.shape;
        // let metaData = cloneDeep(commonMetadata[shape]);
        // newNode.setProp(metaData);
        let shape = node.attr("body/mapShape");
        let newNode = graph.createNode({
          shape: shape,
          data: cloneDeep(initformData[shape])
        });
        return newNode;
      },
      notFoundText: "没有找到匹配的节点",
      stencilGraphWidth: 240,
      collapsable: true,
      scaled: true,
      groups: [
        {
          name: "group_a",
          title: "基础操作",
          graphHeight: 100,
          layoutOptions: {
            columns: 1,
            marginX: 30,
            marginY: 0,
            rowHeight: 26
          }
        }
      ]
    });
    const stencilWrap = document.querySelector(id);
    stencilWrap.appendChild(this.stencil.container);
  }
  static initShape() {
    const { graph } = this;
    const a1 = graph.createNode({
      shape: "tree-cell",
      attrs: {
        body: {
          mapShape: "pipeline"
        },
        label: {
          text: "算法组件"
        }
      }
      // data: cloneDeep(pipeline)
    });
    const a2 = graph.createNode({
      shape: "tree-cell",
      attrs: {
        body: {
          mapShape: "fork"
        },
        label: {
          text: "判断节点"
        }
      }
      // data: cloneDeep(decision)
    });
    this.stencil.load([a1, a2], "group_a");
  }
  static initGraphShape(data) {
    this.graph.fromJSON(data);
  }
  static showPorts(ports, show) {
    for (let i = 0, len = ports.length; i < len; i = i + 1) {
      ports[i].style.visibility = show ? "visible" : "hidden";
    }
  }
  static initEvent() {
    const { graph } = this;
    // 选中节点/边  #31a3ff
    graph.on("cell:selected", ({ cell }) => {
      if (cell.isEdge()) {
        cell.attr("line/stroke", "#07f5f5");
        cell.attr("line/strokeWidth", 2.5);
      } else {
        // cell.attr("body/stroke", "#07f5f5");
        // cell.attr("body/strokeWidth", 2.5);
        cell.setAttrs({
          body: {
            fill: "#2cfeff",
            stroke: "#2cfeff",
            fillOpacity: "1",
            strokeOpacity: "1"
          },
          label: {
            fill: "#151B21"
          },
          path: {
            fill: "#151B21"
          },
          path2: {
            fill: "#151B21"
          }
        });
      }
    });
    // 取消选中节点/边时触发
    graph.on("cell:unselected", ({ cell }) => {
      if (cell.isEdge()) {
        cell.attr("line/stroke", "#2cfeff");
        cell.attr("line/strokeWidth", 1);
      } else {
        console.log("unselected");
        cell.setAttrs({
          body: {
            fill: "#2cfeff",
            stroke: "#2cfeff",
            fillOpacity: "0.15",
            strokeOpacity: "0.6"
          },
          label: {
            fill: "#2CFEFF"
          },
          path: {
            fill: "#2CFEFF"
          },
          path2: {
            fill: "#2CFEFF"
          }
        });
        // cell.attr("body/stroke", "#2cfeff");
        // cell.attr("body/strokeWidth", 1);
      }
    });
    // 给相应的边添加标签；
    graph.on("edge:connected", ({ isNew, edge }) => {
      if (isNew) {
        const source = edge.getSourceCell();
        const rightPorts = source.getPortsByGroup("out");
        if (rightPorts.length === 2) {
          const sourcePortId = edge.getSourcePortId();
          const portIndex = source.getPortIndex(sourcePortId);
          const label = portIndex == 1 ? "是" : "否";
          edge.setLabels(label);
        }
      }
    });
  }
  static initAnimate() {
    let { graph } = this;
    let flash = (cell) => {
      const cellView = graph.findViewByCell(cell);
      if (cellView) {
        cellView.highlight();
        setTimeout(() => cellView.unhighlight(), 350);
      }
    };
    graph.on("signal", (cell) => {
      if (cell.isEdge()) {
        const view = graph.findViewByCell(cell);
        if (view) {
          const token = Vector.create("circle", { r: 6, fill: "#feb662" });
          const target = cell.getTargetCell();
          setTimeout(() => {
            view.sendToken(token.node, 1200, () => {
              if (target) {
                graph.trigger("signal", target);
              }
            });
          }, 350);
        }
      } else {
        flash(cell);
        const edges = graph.model.getConnectedEdges(cell, {
          outgoing: true
        });
        edges.forEach((edge) => graph.trigger("signal", edge));
      }
    });
    graph.on("node:mousedown", ({ cell }) => {
      graph.trigger("signal", cell);
    });
  }
  // 销毁
  static destroy() {
    this.graph.dispose();
  }
}
