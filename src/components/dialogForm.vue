<template>
  <el-dialog v-model="dialogFormVisible" header="商品详情" width="800" @close="cancelNewVal">
    <el-form :model="form" class="form">
      <el-form-item label="品名">
        <el-input v-model="form.title" />
      </el-form-item>
      <el-form-item label="价格">
        <el-input v-model="form.price" />
      </el-form-item>
      <el-form-item label="优惠价">
        <el-switch v-model="form.discount_price_mark" active-text="有优惠价" inactive-text="无优惠价"></el-switch>
        <el-input v-model="form.discount_price" :disabled="!form.discount_price_mark" />
      </el-form-item>
      <el-form-item label="库存">
        <el-input-number v-model="form.amount" :min="0" :precision="0" />
      </el-form-item>
      <el-form-item label="类别">
        <el-switch v-model="form.product_type" active-text="虚拟商品" inactive-text="实体商品" disabled />
      </el-form-item>
      <el-form-item label="分区">
        <el-select v-model="form.section" placeholder="请选择商品分区" clearable>
          <el-option label="Zone one" value="0" />
          <el-option label="Zone two" value="1" />
          <el-option label="Zone three" value="2" />
          <el-option label="Zone four" value="3" />
          <el-option label="其它" value="4" />
        </el-select>
      </el-form-item>
      <el-form-item label="缩略图">
        <tableImage :imgUrl='form.out_url'></tableImage>
      </el-form-item>
      <el-form-item label="详情图">
        <tableImage v-for="(item, i) in form.inner_url" :imgUrl="form.inner_url[i]"></tableImage>
      </el-form-item>
    </el-form>
    <template #footer>
      <div class="dialog-footer">
        <el-button @click="cancelNewVal">取消</el-button>
        <el-button type="primary" @click="commitNewVal">确认</el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script>
import { ElMessage } from 'element-plus'
import tableImage from "@/components/tableImage.vue";
import axios from 'axios'
import { server, port } from "@/utils/config.js";

export default {
  data() {
    return {
      form: {
        title: '',
        price: '',
        amount: 0,
        section: '',
        out_url: '',
        product_type: false,
        discount_price: '',
        detail: '',
        inner_url: [],
        discount_price_mark: false
      },
      dialogFormVisible: false,
    }
  },
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    outForm: {
      type: Object,
      default: null
    }
  },
  watch: {
    visible: {
      deep: true,
      handler(newVal, oldVal) {
        if (newVal) {
          this.dialogFormVisible = newVal
          this.form = this.outForm
        } else {
          this.form = {
            title: '',
            price: '',
            amount: 0,
            section: '',
            out_url: '',
            product_type: false,
            discount_price: '',
            detail: '',
            inner_url: [],
            discount_price_mark: false
          }
        }
      }
    }
  },
  methods: {
    commitNewVal() {
      this.form.inner_url = JSON.stringify(this.form.inner_url)
      if (this.form.product_type) {
        this.form.product_type = 1
      } else {
        this.form.product_type = 0
      }
      if (this.form.discount_price_mark) {
        this.form.discount_price_mark = 1
      } else {
        this.form.discount_price_mark = 0
      }
      axios({
        method: 'PUT',
        url: `http://${server}:${port}/api/product/${this.outForm.id}`,
        data: this.form
      }).then(res => {
        if (res.data.msg == 'success') {
          ElMessage({
            message: '修改成功',
            type: 'success'
          })
          this.cancelNewVal()
        } else {
          ElMessage({
            message: '修改失败',
            type: 'error'
          })
        }
      })
    },
    cancelNewVal() {
      this.dialogFormVisible = false
      this.$emit('recover', false)
    }
  },
  components: {
    tableImage
  }
}
</script>

<style lang="scss">
.form {
  width: '80%'
}
</style>