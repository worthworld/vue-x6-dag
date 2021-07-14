<template>
  <div class="box">
    <el-form
      ref="orderForm"
      :model="orderFormData"
      :validate-on-rule-change="false"
      label-width="90px"
      @submit.native.prevent
    >
      <el-form-item label="组件标题" >
        <el-input
          v-model="orderFormData.name"
          placeholder="请输入标题"
          @input="debounceHandler"
          @keyup.native.enter="debounceHandler"
        ></el-input>
      </el-form-item>

      <el-form-item label="描述" >
        <el-input
          v-model="orderFormData.description"
          :autosize="{ minRows: 3, maxRows: 4 }"
          type="textarea"
          placeholder="请输入描述"
          @input="debounceHandler"
          @keyup.native.enter="debounceHandler"
        ></el-input>
      </el-form-item>
    </el-form>


  </div>
</template>

<script>
import { debounce,cloneDeep } from "lodash";
export default {
  name: "EditOrder",
  props: {
    formData: {
      type: Object,
      default: () => {}
    }
  },
  data() {
    return {
      mapVisible: false,
      mode: "",
      orderFormData: {
        name: "",
        description: "", 
      }
    };
  },
  computed: {
    isVisibile: {
      get() {
        return this.dialogVisibleAddOrder;
      },
      set() {}
    },
  },
  watch: {
    formData: {
      handler(val) {
        // let sourForm=this.$options.data.orderFormData;
        Object.assign(this.orderFormData, val);
      },
      deep: true,
      immediate: true
    }
  },
  mounted() {

  },
  methods: {

    // 当关闭添加命令弹窗
    onAddOrderDialgClose() {
      const data = this.$options.data();
      this.orderFormData = data.orderFormData;
      this.$emit("cancelorder");
    },
    // 添加行为
    handleAddOrder() {
      this.$refs.orderForm.validate(async (valid) => {
        if (valid) {
          this.$emit("confirmorder", cloneDeep(this.orderFormData));
        } else {
          return false;
        }
      });
    },

    handlerChange() {
      this.$emit("updateCellData", cloneDeep(this.orderFormData));
    },
    debounceHandler: debounce(function () {
      this.handlerChange();
    }, 1000),
  }
};
</script>
<style lang="scss" scoped>
::v-deep .el-form-item__label {
  color: #2cfeff;
}
</style>
