<template>
  <el-form ref="form" :model="user" :rules="rules" label-width="80px">
    <el-form-item label="旧密码" prop="oldPassword">
      <el-input v-model="user.oldPassword" placeholder="请输入旧密码" type="password" />
    </el-form-item>
    <el-form-item label="新密码" prop="newPassword">
      <el-input v-model="user.newPassword" placeholder="请输入新密码" type="password" />
    </el-form-item>
    <el-form-item label="确认密码" prop="confirmPassword">
      <el-input v-model="user.confirmPassword" placeholder="请确认密码" type="password" />
    </el-form-item>
    <el-form-item>
      <span style="color:red">{{this.pwdinfo}}</span>
    </el-form-item>
    <el-form-item>
      <el-button type="primary" size="mini" @click="submit">保存</el-button>
      <el-button type="danger" size="mini" @click="close">关闭</el-button>
    </el-form-item>
  </el-form>
</template>

<script>
import { updateUserPwd } from "@/api/system/user";

export default {
  props: {
    onClose: Function,
    onSuccess: Function,
  },
  data() {
    const equalToPassword = (rule, value, callback) => {
      if (this.user.newPassword !== value) {
        callback(new Error("两次输入的密码不一致"));
      } else {
        callback();
      }
    };
    return {
      pwdinfo: undefined,
      user: {
        oldPassword: undefined,
        newPassword: undefined,
        confirmPassword: undefined
      },
      // 表单校验
      rules: {
        oldPassword: [
          { required: true, message: "旧密码不能为空", trigger: "blur" }
        ],
        newPassword: [
          { required: true, message: "新密码不能为空", trigger: "blur" },
          { min: 6, max: 20, message: "长度在 6 到 20 个字符", trigger: "blur" }
        ],
        confirmPassword: [
          { required: true, message: "确认密码不能为空", trigger: "blur" },
          { required: true, validator: equalToPassword, trigger: "blur" }
        ]
      }
    };
  },
  created() {
    this.getConfigKey("sys.pwd.level").then(response => {
      if ("4" == response.data) {
        this.pwdinfo = "* 密码应包含大写字母、小写字母、数字、英文符号";
      } else if ("3" == response.data) {
        this.pwdinfo = "* 密码应包含大写字母、小写字母、数字、英文符号 中的三项";
      } else if ("2" == response.data) {
        this.pwdinfo = "* 密码应包含大写字母、小写字母、数字、英文符号 中的两项";
      } else if ("1" == response.data) {
        this.pwdinfo = "* 密码应包含大写字母、小写字母、数字、英文符号 中的一项";
      } else if ("0" == response.data) {
        this.pwdinfo = "";
      }
    });
  },
  methods: {
    submit() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          updateUserPwd(this.user.oldPassword, this.user.newPassword).then(
            response => {
              if (response.code == 200) {
                this.msgSuccess("修改成功");
                if (this.onSuccess) {
                  this.onSuccess();
                }
              } else {
                this.msgError(response.msg);
              }
            }
          );
        }
      });
    },
    close() {
      if (this.onClose) {
        this.onClose();
      } else {
        this.$store.dispatch("tagsView/delView", this.$route);
        this.$router.push({ path: "/index" });
      }
    }
  }
};
</script>
