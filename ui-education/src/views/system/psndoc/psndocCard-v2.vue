
<template>
  <div class="app-container">
    <el-form
      ref="form"
      :inline="true"
      :model="form"
      :rules="rules"
      label-width="80px"
      :disabled="cardDisabled"
    >
      <el-form-item label="组织" prop="orgId">
        <el-cascader
          v-model="form.orgId"
          placeholder="请选择组织"
          :options="orgOptions"
          :show-all-levels="false"
          :props="{ checkStrictly: true,emitPath:false }"
          filterable
          clearable
        ></el-cascader>
      </el-form-item>

      <el-form-item label="部门" prop="deptId">
        <el-cascader
          v-model="form.deptId"
          placeholder="请选择部门"
          :options="deptOptions"
          :show-all-levels="false"
          :props="{ checkStrictly: true,emitPath:false }"
          filterable
          clearable
        ></el-cascader>
      </el-form-item>

      <el-form-item label="兼职部门1" prop="deptId1">
        <!-- <treeselect class='el-select--medium' v-model="form.deptId1" :options="deptOptions" placeholder="请输入兼职部门1"  :disabled="cardDisabled"/> -->
        <el-cascader
          v-model="form.deptId1"
          placeholder="请选择兼职部门1"
          :options="deptOptions"
          :show-all-levels="false"
          :props="{ checkStrictly: true,emitPath:false }"
          filterable
          clearable
        ></el-cascader>
      </el-form-item>

      <el-form-item label="兼职部门2" prop="deptId2">
        <el-cascader
          v-model="form.deptId2"
          placeholder="请选择兼职部门2"
          :options="deptOptions"
          :show-all-levels="false"
          :props="{ checkStrictly: true,emitPath:false }"
          filterable
          clearable
        ></el-cascader>
      </el-form-item>

      <el-form-item label="兼职部门3" prop="deptId3">
        <el-cascader
          v-model="form.deptId3"
          placeholder="请选择兼职部门3"
          :options="deptOptions"
          :show-all-levels="false"
          :props="{ checkStrictly: true,emitPath:false }"
          filterable
          clearable
        ></el-cascader>
      </el-form-item>

      <el-form-item label="人员工号" prop="psnCode">
        <el-input v-model="form.psnCode" placeholder="请输入人员工号" />
      </el-form-item>

      <el-form-item label="人员姓名" prop="psnName">
        <el-input v-model="form.psnName" placeholder="请输入人员姓名" />
      </el-form-item>

      <el-form-item label="电子邮箱" prop="email">
        <el-input v-model="form.email" placeholder="请输入电子邮箱" />
      </el-form-item>

      <el-form-item label="手机号码" prop="phonenumber">
        <el-input v-model="form.phonenumber" placeholder="请输入手机号码" />
      </el-form-item>

      <el-form-item label="家庭电话" prop="homephone">
        <el-input v-model="form.homephone" placeholder="请输入家庭电话" />
      </el-form-item>

      <el-form-item label="用户性别">
        <el-select v-model="form.sex" placeholder="请选择用户性别">
          <el-option
            v-for="dict in sexOptions"
            :key="dict.dictValue"
            :label="dict.dictLabel"
            :value="dict.dictValue"
          ></el-option>
        </el-select>
      </el-form-item>

      <el-form-item label="地址" prop="address">
        <el-input v-model="form.address" placeholder="请输入地址" />
      </el-form-item>

      <el-form-item label="人员状态">
        <el-select v-model="form.status" placeholder="请选择人员状态">
          <el-option
            v-for="dict in statusOptions"
            :key="dict.dictValue"
            :label="dict.dictLabel"
            :value="dict.dictValue"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="头像">
        <psnAvatar :avatarUrl="form.avatar" @change="onPsnAvatarChange" :disabled="cardDisabled" />
      </el-form-item>
      <el-input v-model="form.avatar" placeholder="头像地址" v-show="false" />
    </el-form>
    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button type="primary" size="mini" @click="addLine" v-if="!cardDisabled">增行</el-button>
        <el-button type="primary" size="mini" @click="submitForm" v-if="!cardDisabled">保存</el-button>
        <el-button size="mini" @click="cancel">取消</el-button>
      </el-col>
    </el-row>
    <el-tabs v-model="activeName">
      <el-tab-pane label="任职记录" name="jobs">
        <el-table :data="form.psnJobs">
          <el-table-column type="selection" width="55" align="center" fixed="left" />
          <el-table-column label="组织" align="center" prop="orgIdName">
            <template slot-scope="scope">
              <span v-if="cardDisabled">{{scope.row.orgIdName}}</span>
              <el-cascader
                v-if="!cardDisabled"
                v-model="scope.row.orgId"
                placeholder="请选择组织"
                :options="orgOptions"
                :show-all-levels="false"
                :props="{ checkStrictly: true,emitPath:false }"
                filterable
                clearable
              ></el-cascader>
            </template>
          </el-table-column>
          <el-table-column label="部门" align="center" prop="deptIdName">
            <template slot-scope="scope">
              <span v-if="cardDisabled">{{scope.row.deptIdName}}</span>
              <el-cascader
                v-if="!cardDisabled"
                v-model="scope.row.deptId"
                placeholder="请选择部门"
                :options="deptLine(scope.row.orgId)"
                :show-all-levels="false"
                :props="{ checkStrictly: true,emitPath:false }"
                @visible-change="deptLine(scope.row.orgId)"
                filterable
                clearable
              ></el-cascader>
            </template>
          </el-table-column>
          <el-table-column label="岗位" align="center" prop="postIdName" />
          <el-table-column label="生效日期" align="center" prop="effecttime" width="120">
            <template slot-scope="scope">
              <span>{{ parseTime(scope.row.effecttime) }}</span>
            </template>
          </el-table-column>
          <el-table-column label="失效日期" align="center" prop="invalidtime" width="120">
            <template slot-scope="scope">
              <span>{{ parseTime(scope.row.invalidtime) }}</span>
            </template>
          </el-table-column>
          <el-table-column prop="status" label="状态" :formatter="statusFormat" width="60"></el-table-column>
          <el-table-column prop="mainjob" label="是否主职" :formatter="mainJobFormat" width="80"></el-table-column>
        </el-table>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import { getPsndoc, addPsndoc, updatePsndoc } from "@/api/system/psndoc";
import { treeselect as orgTreeselect } from "@/api/system/org";
import { treeselect as deptTreeselect } from "@/api/system/dept";
import psnAvatar from "./psnAvatar";

export default {
  name: "PsndocCard",
  components: { psnAvatar },
  data() {
    return {
      // 遮罩层
      loading: true,
      /** 主键 */
      id: undefined,
      /** 新增时的组织主键 */
      orgId: undefined,
      /** 新增时的部门主键 */
      deptId: undefined,
      //选中tabs
      activeName: "jobs",
      // 用户性别字典
      sexOptions: [],
      // 人员状态字典
      statusOptions: [],
      // 是否主职字典
      mainJobOptions: [],
      // 所属组织
      orgOptions: [],
      // 部门
      deptOptions: [],
      //行部门
      deptLineOptions: {},
      //选中部门
      selectDeptId: undefined,
      // 树查询部门名称
      deptName: undefined,
      //卡片不可编辑
      cardDisabled: false,

      // 表单参数
      form: {},

      // 表单参数
      oldform: {},

      // 表单校验
      rules: {
        orgId: [{ required: true, message: "组织不能为空", trigger: "blur" }],
        deptId: [{ required: true, message: "部门不能为空", trigger: "blur" }],
        psnCode: [
          { required: true, message: "人员工号不能为空", trigger: "blur" }
        ],
        psnName: [
          { required: true, message: "人员姓名不能为空", trigger: "blur" }
        ]
      }
    };
  },

  watch: {
    "form.orgId": {
      handler(newValue, oldValue) {
        this.refreshDeptTree();
      },
      deep: true
    }
  },
  beforeCreate() {},
  activated() {},
  created() {
    this.id = this.$route.params && this.$route.params.id;
    this.orgId = this.$route.query && this.$route.query.orgId;
    this.deptId = this.$route.query && this.$route.query.deptId;
    this.cardDisabled =
      this.$route.query && "true" == this.$route.query.cardDisabled;


    this.getDicts("sys_user_sex").then(response => {
      this.sexOptions = response.data;
    });
    this.getDicts("psn_status").then(response => {
      this.statusOptions = response.data;
    });
    this.getDicts("sys_yes_no").then(response => {
      this.mainJobOptions = response.data;
    });
    orgTreeselect().then(response => {
      this.orgOptions = response.data;
    });
    deptTreeselect(this.orgId).then(response => {
      this.deptOptions = response.data;
    });
  },
  mounted() {
    if (this.id && this.id != "") {
      getPsndoc(this.id).then(response => {
        this.form = response.data;
        this.oldform = JSON.parse(JSON.stringify(response.data));
        this.form.psnJobs.forEach(v => {
          console.log(v);
          this.deptLine(v.orgId);
        });
       
      });
    }

  },
  methods: {
    // 刷新部门树
    refreshDeptTree() {
      if (!this.form.orgId || this.form.orgId == "") {
        this.deptOptions = [];
      } else {
        deptTreeselect(this.form.orgId).then(response => {
          this.deptOptions = response.data;
        });
      }
    },
    onPsnAvatarChange(arg) {
      // console.log(arg);
      this.form.avatar = arg;
    },

    // 用户性别字典翻译
    sexFormat(row, column) {
      return this.selectDictLabel(this.sexOptions, row.sex);
    },
    // 人员状态字典翻译
    statusFormat(row, column) {
      return this.selectDictLabel(this.statusOptions, row.status);
    },
    // 是否主职字典翻译
    mainJobFormat(row, column) {
      return this.selectDictLabel(this.mainJobOptions, row.mainjob);
    },
    // 取消按钮
    cancel() {
      this.$store.dispatch("tagsView/delView", this.$route);
      this.$router.push({ path: "/system/psndoc" });
    },
    // 表单重置
    reset() {
      this.form = {
        psnId: undefined,
        orgId: this.orgId,
        deptId: this.deptId,
        deptId1: undefined,
        deptId2: undefined,
        deptId3: undefined,
        psnCode: undefined,
        psnName: undefined,
        email: undefined,
        phonenumber: undefined,
        homephone: undefined,
        sex: undefined,
        avatar: undefined,
        status: "0",
        address: undefined,
        createBy: undefined,
        createTime: undefined,
        updateBy: undefined,
        updateTime: undefined,
        remark: undefined,
        psnJobs: undefined
      };
      this.resetForm("form");
    },

    /** 新增按钮操作 */
    handleAdd() {
      if (!this.orgId || this.orgId == "") {
        this.msgError("请先选择组织");
        return;
      }
      this.reset();
      this.cardDisabled = false;
    },
    /** 增行 */
    addLine() {
      this.form.psnJobs.push({});
    },
    /** 行部门 */
    deptLine(orgId) {
      console.log("hang orgId:" + orgId);
      if (!orgId || orgId == "") {
        return [];
      } else if (this.deptLineOptions.hasOwnProperty(orgId)) {
        return this.deptLineOptions[orgId];
      } else {
        this.deptLineOptions[orgId] = [];
        let a = deptTreeselect(orgId).then(response => {
          this.deptLineOptions[orgId] = response.data;
          
        });
        console.log(a);
        return this.deptLineOptions[orgId];
      }
    },

    /** 提交按钮 */
    submitForm: function() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          if (this.form.psnId != undefined) {
            let submitData = JSON.parse(JSON.stringify(this.form));

            submitData.psnJobs = this.mergeEntity(
              this.form.psnJobs,
              this.oldform.psnJobs,
              "psnId"
            );
            console.log(submitData);
            // updatePsndoc(submitData).then(response => {
            //   if (response.code == 200) {
            //     this.msgSuccess("修改成功");
            //     cancel();
            //   } else {
            //     this.msgError(response.msg);
            //   }
            // });
          } else {
            addPsndoc(this.form).then(response => {
              if (response.code == 200) {
                this.msgSuccess("新增成功");
                cancel();
              } else {
                this.msgError(response.msg);
              }
            });
          }
        }
      });
    }
  }
};
</script>