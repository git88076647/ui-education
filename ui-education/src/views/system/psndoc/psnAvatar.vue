<template>
  <div>
    <img v-bind:src="options.img" @click="editCropper()" title="点击上传头像" class="img-circle img-lg" />
    <el-dialog v-dialogDrag append-to-body :title="title" :visible.sync="open" width="800px" :modal="false">
      <el-row>
        <el-col :xs="24" :md="12" :style="{height: '350px'}">
          <vue-cropper
            ref="cropper"
            :img="options.img"
            :info="true"
            :autoCrop="options.autoCrop"
            :autoCropWidth="options.autoCropWidth"
            :autoCropHeight="options.autoCropHeight"
            :fixedBox="options.fixedBox"
            :high="options.high"
            :outputType="options.outputType"
            @realTime="realTime"
          />
        </el-col>
        <el-col :xs="24" :md="12" :style="{height: '350px'}">
          <div class="avatar-upload-preview">
            <img :src="previews.url" :style="previews.img" />
          </div>
        </el-col>
      </el-row>
      <br />
      <el-row>
        <el-col :lg="2" :md="2">
          <el-upload
            :show-file-list="false"
            :before-upload="beforeUpload"
            :http-request="uploadFile"
            action="#"
          >
            <el-button size="small">
              选择照片
              <i class="el-icon-upload el-icon--right"></i>
            </el-button>
          </el-upload>
        </el-col>
        <el-col :lg="{span: 1, offset: 2}" :md="2">
          <el-button icon="el-icon-plus" size="small" @click="changeScale(1)"></el-button>
        </el-col>
        <el-col :lg="{span: 1, offset: 1}" :md="2">
          <el-button icon="el-icon-minus" size="small" @click="changeScale(-1)"></el-button>
        </el-col>
        <el-col :lg="{span: 1, offset: 1}" :md="2">
          <el-button icon="el-icon-refresh-left" size="small" @click="rotateLeft()"></el-button>
        </el-col>
        <el-col :lg="{span: 1, offset: 1}" :md="2">
          <el-button icon="el-icon-refresh-right" size="small" @click="rotateRight()"></el-button>
        </el-col>
        <el-col :lg="{span: 2, offset: 6}" :md="2">
          <el-button type="primary" size="small" @click="uploadImg()">上 传</el-button>
        </el-col>
      </el-row>
    </el-dialog>
  </div>
</template>

<script>
import store from "@/store";
import { VueCropper } from "vue-cropper";
import { uploadFile } from "@/api/system/file";
import defaultPsnImg from "@/assets/image/psn.jpg";
import {getFileUrl} from '@/utils/czyl'

export default {
  name: "psndocAvatar",
  components: { VueCropper },
  props: {
    avatarUrl: {
      type: String
    },
    disabled: {
      type: Boolean,
      default: false
    }
  },
  data() {
    let imgurl = getFileUrl(this.avatarUrl, defaultPsnImg);
    // console.log(imgurl);
    return {
      // 是否显示弹出层
      open: false,
      // 弹出层标题
      title: "修改照片",
      //是否需要重载
      needRefresh: false,
      fileName: '头像.jpg',
      options: {
        img: imgurl,
        autoCrop: true, // 是否默认生成截图框
        outputType: 'png',//输出文件类型 jpeg || png || webp
        autoCropWidth: 200, // 默认生成截图框宽度
        autoCropHeight: 200, // 默认生成截图框高度
        high: false, //是否按照设备的dpr 输出等比例图片
        fixedBox: true // 固定截图框大小 不允许改变
      },
      previews: {}
    };
  },
  watch: {
    //监听prop传的value，如果父级有变化了，将子组件的myValue也跟着变，达到父变子变的效果
    avatarUrl: {
      handler(newValue, oldValue) {
        let imgurl = getFileUrl(newValue, defaultPsnImg);
        // console.log('newValue:'+newValue);
        // console.log('imgurl:'+imgurl);
        // console.log('img:'+this.options.img);
        if (imgurl != this.options.img) {
          // console.log('头像发生变化');
          this.options.img = imgurl;
          this.needRefresh = true;
        }
      }
    }
  },
  methods: {
    
    uploadFile() {
      //选中后上传空实现
    },
    // 编辑头像
    editCropper() {
      if (this.disabled) {
        return;
      }
      this.open = true;
      if (this.needRefresh) {
        this.needRefresh = false;
        this.refresh();
      }
    },
    refresh() {
      // console.log("刷新组件");
      try {
        this.$refs.cropper.refresh();
      } catch (e1) {}
    },
    // 向左旋转
    rotateLeft() {
      this.$refs.cropper.rotateLeft();
    },
    // 向右旋转
    rotateRight() {
      this.$refs.cropper.rotateRight();
    },
    // 图片缩放
    changeScale(num) {
      num = num || 1;
      this.$refs.cropper.changeScale(num);
    },
    // 上传预处理
    beforeUpload(file) {
      console.log(file);
      if (file.type.indexOf("image/") == -1) {
        this.msgError("文件格式错误，请上传图片类型,如：JPG，PNG后缀的文件。");
      } else {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => {
          this.fileName = file.name;
          this.options.img = reader.result;
        };
      }
    },
    // 上传图片
    uploadImg() {
      this.$refs.cropper.getCropBlob(data => {
        let formData = new FormData();
        formData.append("file", data);
        formData.append("fileName", this.fileName);
        uploadFile(formData).then(response => {
          if (response.code == 200) {
            this.open = false;
            this.options.img = getFileUrl(response.url, defaultPsnImg);
            //回写地址到表单
            this.$emit("change", this.options.img);
            this.msgSuccess("修改成功");
          } else {
            this.msgError(response.msg);
          }
          this.$refs.cropper.clearCrop();
        });
      });
    },
    getImgUrl() {
      return this.options.img;
    },
    // 实时预览
    realTime(data) {
      this.previews = data;
    }
  }
};
</script>