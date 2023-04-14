<template>
  <div class="app-container">
    <el-form
      :model="queryParams"
      ref="queryForm"
      :inline="true"
      label-width="68px"
      v-show="showQueryForm"
    >
      <el-form-item label="编码" prop="code">
        <el-input
          v-model="queryParams.code"
          placeholder="请输入编码"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="名字" prop="name">
        <el-input
          v-model="queryParams.name"
          placeholder="请输入名字"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="数据源" prop="datasource">
        <el-input
          v-model="queryParams.datasource"
          placeholder="请输入数据源"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="字段名JSON" prop="filednamejson">
        <el-input
          v-model="queryParams.filednamejson"
          placeholder="请输入字段显示名对照表json对象"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="脚本" prop="scripttxt">
        <el-input
          v-model="queryParams.scripttxt"
          placeholder="脚本"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="备注" prop="description">
        <el-input
          v-model="queryParams.description"
          placeholder="请输入备注"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="状态" prop="statue">
        <el-input
          v-model="queryParams.statue"
          placeholder="请输入状态"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="组织id" prop="orgId">
        <el-input
          v-model="queryParams.orgId"
          placeholder="请输入组织id"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="查询类" prop="querclass">
        <el-input
          v-model="queryParams.querclass"
          placeholder="请输入数据查询实现类"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
        <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>

    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button
          type="primary"
          icon="el-icon-plus"
          size="mini"
          @click="handleAdd"
          v-hasPermi="['rep:semantic:add']"
        >新增
        </el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="success"
          icon="el-icon-edit"
          size="mini"
          :disabled="single"
          @click="handleUpdate"
          v-hasPermi="['rep:semantic:edit']"
        >修改
        </el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="danger"
          icon="el-icon-delete"
          size="mini"
          :disabled="multiple"
          @click="handleDelete"
          v-hasPermi="['rep:semantic:remove']"
        >删除
        </el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="warning"
          icon="el-icon-download"
          size="mini"
          @click="handleExport"
          v-hasPermi="['rep:semantic:export']"
        >导出
        </el-button>
      </el-col>
      <el-col :span="1.5">
        <!-- 隐藏 显示查询面板 -->
        <el-button
          v-show="!showQueryForm"
          icon="el-icon-arrow-down"
          size="mini"
          @click="showQueryForm = !showQueryForm"
          v-hasPermi="['rep:semantic:query']"
        ></el-button>
        <el-button
          v-show="showQueryForm"
          icon="el-icon-arrow-up"
          size="mini"
          @click="showQueryForm = !showQueryForm"
          v-hasPermi="['rep:semantic:query']"
        ></el-button>
      </el-col>
    </el-row>
    <!--  列表界面-->
    <el-table v-loading="loading" :data="semanticList" @selection-change="handleSelectionChange"
              :fit="true">
      <el-table-column type="selection" width="55" align="center"/>
      <!--  <el-table-column label="表id" align="center" prop="pkSemantic"/>  -->
      <el-table-column label="编码" align="center" prop="code"/>
      <el-table-column label="名字" align="center" prop="name"/>
      <el-table-column label="数据源" align="center" prop="datasource"/>
      <el-table-column label="字段名JSON" align="left" prop="filednamejson"/>
      <el-table-column label="脚本" align="left" prop="scripttxt"/>
      <el-table-column label="备注" align="center" prop="description"/>
      <el-table-column label="状态" align="center" prop="statue"/>
      <el-table-column label="组织id" align="center" prop="orgId"/>
      <el-table-column label="查询类" align="center" prop="querclass"/>
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-view"
            @click="handleExec(scope.row)"
            v-hasPermi="['rep:semantic:exec']"
          >执行
          </el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-setting"
            @click="handleDesign(scope.row)"
            v-hasPermi="['rep:semantic:edit']"
          >设计
          </el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
            v-hasPermi="['rep:semantic:edit']"
          >修改
          </el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['rep:semantic:remove']"
          >删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination
      v-show="total>0"
      :total="total"
      :page.sync="queryParams.pageNum"
      :limit.sync="queryParams.pageSize"
      @pagination="getList"
    />

    <!-- 添加或修改语义模型对话框 -->
    <el-dialog append-to-body :title="title" :visible.sync="open" width="620px" :close-on-click-modal="false">
      <el-form ref="form" :model="form" :inline="true" :rules="rules" label-width="80px">
        <el-form-item label="编码" prop="code">
          <el-input v-model="form.code" placeholder="请输入编码"/>
        </el-form-item>
        <el-form-item label="名字" prop="name">
          <el-input v-model="form.name" placeholder="请输入名字"/>
        </el-form-item>
        <el-form-item label="数据源" prop="datasource">
          <el-input v-model="form.datasource" placeholder="请输入数据源"/>
        </el-form-item>
        <el-form-item label="字段名JSON" prop="filednamejson">
          <el-input v-model="form.filednamejson" placeholder="请输入字段显示名对照表json对象"/>
        </el-form-item>
        <el-form-item label="脚本" prop="scripttxt">
          <el-input v-model="form.scripttxt" placeholder="请输入脚本"/>
        </el-form-item>
        <el-form-item label="版本号" prop="version">
          <el-input v-model="form.version" placeholder="请输入版本号-乐观锁"/>
        </el-form-item>
        <el-form-item label="备注" prop="description">
          <el-input v-model="form.description" placeholder="请输入备注"/>
        </el-form-item>
        <el-form-item label="删除标志" prop="dr">
          <el-input v-model="form.dr" placeholder="请输入删除标志"/>
        </el-form-item>
        <el-form-item label="状态" prop="statue">
          <el-input v-model="form.statue" placeholder="请输入状态"/>
        </el-form-item>
        <el-form-item label="组织id" prop="orgId">
          <el-input v-model="form.orgId" placeholder="请输入组织id"/>
        </el-form-item>
        <el-form-item label="查询类" prop="querclass">
          <el-input v-model="form.querclass" placeholder="请输入数据查询实现类"/>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>

    <!-- 执行语义模型 展示结果的 对话框 -->
    <el-dialog append-to-body title="预览结果" :visible.sync="showExecSemanticResult" width="90%"
               :close-on-click-modal="false" >
      <el-table :data="execSemanticResult.datas" border  height="400">
        <el-table-column :label="head.showName" align="left"
                         v-for="head in execSemanticResult.allColumnNamesLabel"
                         :prop="head.name" />
      </el-table>
    </el-dialog>

    <!-- 设计模板 对话框 -->
    <el-dialog append-to-body :title="title" :visible.sync="showDesignForm"
               width="98%" :close-on-click-modal="false"
               v-loading="loadingResultMetaTable" element-loading-text="加载中...">
      <el-steps :active="designActiveSetpIndex" finish-status="success">
        <el-step title="参数定义" description="定义查询可能用到的参数列表" icon="el-icon-tickets"></el-step>
        <el-step title="脚本定义" description="编写查询SQL或脚本" icon="el-icon-s-order"></el-step>
        <el-step title="字段确认" description="确认查询结果字段" icon="el-icon-view"></el-step>
      </el-steps>

      <semparmarView :semanticId="this.selectVO.pkSemantic" :disablePkSemanticEdit="true"
                     v-if="designActiveSetpIndex==0"/>
      <el-input
        type="textarea"
        placeholder="请输入脚本内容"
        :rows="25"
        v-show="designActiveSetpIndex==1"
        v-model="selectVO.scripttxt" class="scripttxtTextarea"/>
      <el-table
        :data="resultMeta"
        border height="450"
        style="width: 95%" v-show="designActiveSetpIndex==2">
        <el-table-column
          prop="name"
          label="字段名"/>
        <el-table-column
          prop="showName"
          label="显示名">
          <template slot-scope="scope">
            <el-input v-model="scope.row.showName"></el-input>
          </template>
        </el-table-column>
        <el-table-column
          prop="javaTypeClass"
          label="类型"/>
      </el-table>


      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="designActiveSetpIndex = designActiveSetpIndex < 1
          ? designActiveSetpIndex  : --designActiveSetpIndex"
                   :disabled="designActiveSetpIndex==0">上一步
        </el-button>

        <el-button type="primary" @click="nextDesignSetp">
          {{designActiveSetpIndex > 1 ? '保存' : '下一步'}}
        </el-button>

        <el-button @click=" ()=>{
            showDesignForm = false;
            designActiveSetpIndex=0;
          }">取 消
        </el-button>
      </div>
    </el-dialog>

  </div>
</template>

<script>
  import {
    listSemantic,
    getSemantic,
    delSemantic,
    addSemantic,
    updateSemantic,
    exportSemantic,
    execSemantic,
    getSemanticResultMeta
  } from "@/api/rep/semantic";
  import semparmarView from '../semparmar/index';

  export default {
    data() {
      return {
        //是否显示执行语义模型结构数据的弹框
        showExecSemanticResult: false,
        execSemanticResult: {},
        //是否 设计弹框的 加载中
        loadingResultMetaTable: false,
        //查询结果字段描述
        resultMeta: [],
        //当前设计触发的 vo数据
        selectVO: {
          scripttxt: ''
        },
        //当前的 设计的 进度卡片索引  0开始！
        designActiveSetpIndex: 0,
        //是否显示设计界面
        showDesignForm: false,
        //是否显示搜索界面
        showQueryForm: false,
        // 遮罩层
        loading: true,
        // 选中数组
        ids: [],
        // 非单个禁用
        single: true,
        // 非多个禁用
        multiple: true,
        // 总条数
        total: 0,
        // 语义模型表格数据
        semanticList: [],
        // 弹出层标题
        title: "",
        // 是否显示弹出层
        open: false,
        // 查询参数
        queryParams: {
          pageNum: 1,
          pageSize: 10,
          code: undefined,
          name: undefined,
          datasource: undefined,
          filednamejson: undefined,
          formathtml: undefined,
          def1: undefined,
          def2: undefined,
          def3: undefined,
          def4: undefined,
          def5: undefined,
          description: undefined,
          statue: undefined,
          orgId: undefined,
          querclass: undefined,
          scripttxt: undefined
        },
        // 表单参数
        form: {},
        // 表单校验
        rules: {
          code: [{required: true, message: "编码不能为空", trigger: "blur"}],
          name: [{required: true, message: "名字不能为空", trigger: "blur"}]
        }
      };
    },
    created() {
      this.getList();
    },
    methods: {
      /** 查询语义模型列表 */
      getList() {
        this.loading = true;
        listSemantic(this.queryParams).then(response => {
          this.semanticList = response.rows;
          this.total = response.total;
          this.loading = false;
        });
      },
      // 取消按钮
      cancel() {
        this.open = false;
        this.reset();
      },
      // 表单重置
      reset() {
        this.form = {
          pkSemantic: undefined,
          code: undefined,
          name: undefined,
          datasource: undefined,
          filednamejson: undefined,
          formathtml: undefined,
          def1: undefined,
          def2: undefined,
          def3: undefined,
          def4: undefined,
          def5: undefined,
          createBy: undefined,
          createTime: undefined,
          updateBy: undefined,
          updateTime: undefined,
          version: undefined,
          description: undefined,
          dr: undefined,
          statue: undefined,
          orgId: undefined,
          querclass: undefined
        };
        this.resetForm("form");
      },
      /** 搜索按钮操作 */
      handleQuery() {
        this.queryParams.pageNum = 1;
        this.getList();
      },
      /** 重置按钮操作 */
      resetQuery() {
        this.resetForm("queryForm");
        this.handleQuery();
      },
      // 多选框选中数据
      handleSelectionChange(selection) {
        this.ids = selection.map(item => item.pkSemantic);
        this.single = selection.length != 1;
        this.multiple = !selection.length;
      },
      /** 新增按钮操作 */
      handleAdd() {
        this.reset();
        this.open = true;
        this.title = "添加语义模型";
      },
      /** 修改按钮操作 */
      handleUpdate(row) {
        this.reset();
        const pkSemantic = row.pkSemantic || this.ids;
        getSemantic(pkSemantic).then(response => {
          this.form = response.data;
          this.open = true;
          this.title = "修改语义模型";
        });
      },
      /** 设计按钮操作 */
      handleDesign(row) {
        const pkSemantic = row.pkSemantic || this.ids[0];
        //first 我要根据pk获得vo
        this.selectVO = Object.assign({}
          , this.semanticList.find(vo => vo.pkSemantic === pkSemantic));
        this.showDesignForm = true;
      },
      /** 执行查询按钮操作 */
      handleExec(row) {
        this.reset();
        const pkSemantic = row.pkSemantic || this.ids;
        //first 我要根据pk获得vo
        this.selectVO = Object.assign({}
          , this.semanticList.find(vo => vo.pkSemantic === pkSemantic));

        execSemantic(pkSemantic, {}).then(response => {
          if (response.code === 200) {
            console.log(response)
            this.execSemanticResult = response.data;
            if (this.selectVO.filednamejson) {
              //因为后端这个字段显示名映射是 存的json字符串
              this.selectVO.filednamejsonObj = JSON.parse(this.selectVO.filednamejson);
            } else {
              this.selectVO.filednamejsonObj = {};
            }
            //根据显示名称 展示table的列标题呀
            this.execSemanticResult.allColumnNamesLabel = new Array();
            this.execSemanticResult.allColumnNames.forEach(
              key => this.execSemanticResult.allColumnNamesLabel.push({
                name: key
                //根据语义模型原始保存的 显示名字段名映射取，取不到就默认db字段名
                , showName: this.selectVO.filednamejsonObj[key] ? this.selectVO.filednamejsonObj[key] : key
              })
            );

            this.showExecSemanticResult = true;
          } else {
            this.msgError(response.msg);
          }
        });
      },
      /** 提交按钮 */
      submitForm: function () {
        this.$refs["form"].validate(valid => {
          if (valid) {
            if (this.form.pkSemantic != undefined) {
              updateSemantic(this.form).then(response => {
                if (response.code === 200) {
                  this.msgSuccess("修改成功");
                  this.open = false;
                  this.getList();
                } else {
                  this.msgError(response.msg);
                }
              });
            } else {
              addSemantic(this.form).then(response => {
                if (response.code === 200) {
                  this.msgSuccess("新增成功");
                  this.open = false;
                  this.getList();
                } else {
                  this.msgError(response.msg);
                }
              });
            }
          }
        });
      },
      /** 删除按钮操作 */
      handleDelete(row) {
        const pkSemantics = row.pkSemantic || this.ids;
        this.$confirm(
          '是否确认删除语义模型编号为"' + pkSemantics + '"的数据项?',
          "警告",
          {
            confirmButtonText: "确定",
            cancelButtonText: "取消",
            type: "warning"
          }
        )
          .then(function () {
            return delSemantic(pkSemantics);
          })
          .then(() => {
            this.getList();
            this.msgSuccess("删除成功");
          })
          .catch(function () {
          });
      },
      /** 导出按钮操作 */
      handleExport() {
        const queryParams = this.queryParams;
        this.$confirm("是否确认导出所有语义模型数据项?", "警告", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        })
          .then(function () {
            return exportSemantic(queryParams);
          })
          .then(response => {
            this.download(response.msg);
          })
          .catch(function () {
          });
      },
      //设计界面 点击了下一步
      nextDesignSetp() {
        this.designActiveSetpIndex = this.designActiveSetpIndex > 2
          ? this.designActiveSetpIndex : ++this.designActiveSetpIndex;

        //当前的 步骤索引在  查看结果字段列表
        const getSemanticResultMetaIndex = 2;
        //当前的 步骤索引在  保存设计结果的页签
        const saveSemanticResultMetaIndex = 3;

        if (this.designActiveSetpIndex == getSemanticResultMetaIndex) {
          this.getSemanticResultMeta();
        }

        if (this.designActiveSetpIndex == saveSemanticResultMetaIndex) {
          this.saveSemanticResultMeta();
        }
      },
      //获得结果结构类型
      getSemanticResultMeta() {
        //显示 加载中
        this.loadingResultMetaTable = true;

        //展示脚本结果字段
        getSemanticResultMeta(this.selectVO.pkSemantic, this.selectVO.scripttxt).then(response => {
          if (response.code != 200) {
            this.msgError(response.msg);
            return;
          }
          if (!response.data || !response.data.filed2TypeMap) {
            this.msgError('没有查询到任何结果字段！');
            return;
          }

          this.resultMeta = new Array();
          if (this.selectVO.filednamejson) {
            //因为后端这个字段显示名映射是 存的json字符串
            this.selectVO.filednamejsonObj = JSON.parse(this.selectVO.filednamejson);
          } else {
            this.selectVO.filednamejsonObj = {};
          }

          for (let key in response.data.filed2TypeMap) {
            this.resultMeta.push(
              {
                name: key
                , javaTypeClass: response.data.filed2TypeMap[key]
                //根据语义模型原始保存的 显示名字段名映射取，取不到就默认db字段名
                , showName: this.selectVO.filednamejsonObj[key] ? this.selectVO.filednamejsonObj[key] : key
              }
            );
          }
        }).catch(error => {
          this.msgError('查询脚本结果字段列表发生异常');
        }).finally(() => {
          this.loadingResultMetaTable = false;
        });
      },
      //保存设计结果到数据库
      saveSemanticResultMeta() {
        //显示 加载中
        this.loadingResultMetaTable = true;

        //组装参数
        const filednamejsonMap = new Map();
        this.resultMeta.forEach(rm => filednamejsonMap.set(rm.name, rm.showName))
        //map无法json序列化，弄成对象吧
        let filednamejsonObj = Object.create(null);
        for (let [k, v] of filednamejsonMap) {
          filednamejsonObj[k] = v;
        }
        const bo = {
          pkSemantic: this.selectVO.pkSemantic,
          scripttxt: this.selectVO.scripttxt,
          filednamejson: JSON.stringify(filednamejsonObj),
          version: this.selectVO.version
        };

        //展示脚本结果字段
        updateSemantic(bo).then(response => {
          if (response.code != 200) {
            this.msgError(response.msg);
            return;
          } else {
            this.msgSuccess('保存成功');
            this.getList();
            this.showDesignForm = false;
            this.designActiveSetpIndex = 0;
          }

        }).finally(() => {
          this.loadingResultMetaTable = false;
        });
      }
    },
    components: {
      semparmarView
    }
  };
</script>


<style>
  .scripttxtTextarea {
    min-height: 90%;
    min-width: 90%;
    margin-left: 60px;
    margin-right: auto;
    margin-top: 10px;
  }
  .el-table th.gutter {
    display: table-cell !important;
  }
  .el-table colgroup.gutter {
    display: table-cell !important;
  }
  .el-table .warning-row {
    background: oldlace;
  }
  .el-table .success-row {
    background: #f0f9eb;
  }

</style>
