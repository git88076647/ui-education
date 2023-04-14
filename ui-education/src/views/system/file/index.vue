<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" :inline="true" label-width="68px">
      <el-form-item label="文件名称" prop="name">
        <el-input
          v-model="queryParams.name"
          placeholder="请输入文件名称"
          clearable
        
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="文件类型" prop="contenttype">
        <el-select v-model="queryParams.contenttype" placeholder="请选择文件类型" clearable filterable >
          <el-option
            v-for="dict in contenttypeOptions"
            :key="dict.dictValue"
            :label="dict.dictLabel"
            :value="dict.dictValue"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="是否图片" prop="isimg">
        <el-select v-model="queryParams.isimg" placeholder="请选择是否图片" clearable >
          <el-option
            v-for="dict in isimgOptions"
            :key="dict.dictValue"
            :label="dict.dictLabel"
            :value="dict.dictValue"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="存储源" prop="source">
        <el-select v-model="queryParams.source" placeholder="请选择存储源" clearable >
          <el-option
            v-for="dict in sourceOptions"
            :key="dict.dictValue"
            :label="dict.dictLabel"
            :value="dict.dictValue"
          />
        </el-select>
      </el-form-item>
      
      <el-form-item label="来源ID" prop="srcId">
        <el-input
          v-model="queryParams.srcId"
          placeholder="请输入来源ID"
          clearable
        
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="来源类型" prop="srcType">
        <el-input
          v-model="queryParams.srcType"
          placeholder="请输入来源类型"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="上传时间" prop="createTime">
        <el-date-picker clearable style="width: 200px"
          v-model="queryParams.createTime"
          type="date"
          value-format="yyyy-MM-dd"
          placeholder="选择上传时间">
        </el-date-picker>
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
          v-hasPermi="['system:file:add']"
        >新增</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="success"
          icon="el-icon-edit"
          size="mini"
          :disabled="single"
          @click="handleUpdate"
          v-hasPermi="['system:file:edit']"
        >修改</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="danger"
          icon="el-icon-delete"
          size="mini"
          :disabled="multiple"
          @click="handleDelete"
          v-hasPermi="['system:file:remove']"
        >删除</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="warning"
          icon="el-icon-download"
          size="mini"
          @click="handleExport"
          v-hasPermi="['system:file:export']"
        >导出</el-button>
      </el-col>
    </el-row>

    <el-table v-loading="loading" :data="fileList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="文件编码" align="center" prop="fileId" show-overflow-tooltip/>
      <el-table-column label="文件名称" align="center" prop="name" />
      <el-table-column label="文件类型" align="center" prop="contenttype" :formatter="contenttypeFormat" />
      <el-table-column label="是否图片" align="center" prop="isimg" :formatter="isimgFormat" />
      <el-table-column label="文件大小" align="center" prop="size" />
      <el-table-column label="文件路径" align="center" prop="path" show-overflow-tooltip/>
      <el-table-column label="OSS地址" align="center" prop="url" show-overflow-tooltip>
        <template slot-scope="scope" >
          <a target="_blank" :href="getFileUrl(scope.row.url)" >{{scope.row.url}}</a>
        </template>
      </el-table-column>
      <el-table-column label="存储源" align="center" prop="source" :formatter="sourceFormat" />
      <el-table-column label="创建者名称" align="center" prop="createByName" />
      <el-table-column label="上传时间" align="center" prop="createTime" width="180">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.createTime) }}</span>
        </template>
      </el-table-column>
      <!-- <el-table-column label="来源ID" align="center" prop="srcId" />
      <el-table-column label="来源类型" align="center" prop="srcType" /> -->
      <el-table-column label="操作" fixed="right" align="center" width="180">
        <template slot-scope="scope" >
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
            v-hasPermi="['system:file:edit']"
          >修改</el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['system:file:remove']"
          >删除</el-button>
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
 
    <!-- 添加或修改文件管理对话框 -->
    <el-dialog v-dialogDrag append-to-body :title="title" :visible.sync="open" width="620px" :close-on-click-modal=false>
      <el-form ref="form" :model="form" :rules="rules" :inline="true" label-width="80px">
        <el-form-item label="文件名称" prop="name">
          <el-input v-model="form.name" placeholder="请输入文件名称" />
        </el-form-item>
        <el-form-item label="文件类型">
          <el-select v-model="form.contenttype" placeholder="请选择文件类型">
            <el-option
              v-for="dict in contenttypeOptions"
              :key="dict.dictValue"
              :label="dict.dictLabel"
              :value="dict.dictValue"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="是否图片">
          <el-select v-model="form.isimg" placeholder="请选择是否图片">
            <el-option
              v-for="dict in isimgOptions"
              :key="dict.dictValue"
              :label="dict.dictLabel"
              :value="dict.dictValue"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="文件大小" prop="size">
          <el-input v-model="form.size" placeholder="请输入文件大小" />
        </el-form-item>
        <el-form-item label="文件路径" prop="path">
          <el-input v-model="form.path" type="textarea" placeholder="请输入内容" />
        </el-form-item>
      </el-form>
        <el-form-item label="OSS地址" prop="url">
          <el-input v-model="form.url" placeholder="请输入OSS地址" />
        </el-form-item>
        <el-form-item label="存储源">
          <el-select v-model="form.source" placeholder="请选择存储源">
            <el-option
              v-for="dict in sourceOptions"
              :key="dict.dictValue"
              :label="dict.dictLabel"
              :value="dict.dictValue"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="创建者编码" prop="createByCode">
          <el-input v-model="form.createByCode" placeholder="请输入创建者编码" />
        </el-form-item>
        <el-form-item label="创建者名称" prop="createByName">
          <el-input v-model="form.createByName" placeholder="请输入创建者名称" />
        </el-form-item>
        <el-form-item label="来源ID" prop="srcId">
          <el-input v-model="form.srcId" placeholder="请输入来源ID" />
        </el-form-item>
        <el-form-item label="来源类型" prop="srcType">
          <el-input v-model="form.srcType" placeholder="请输入来源类型" />
        </el-form-item>
        <el-form-item label="版本" prop="version">
          <el-input v-model="form.version" placeholder="请输入版本" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { listFile, getFile, delFile, addFile, updateFile, exportFile } from "@/api/system/file";

export default {
  name: "File",
  data() {
    return {
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
      // 文件管理表格数据
      fileList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 文件类型字典
      contenttypeOptions: [],
      // 是否图片字典
      isimgOptions: [],
      // 存储源字典
      sourceOptions: [],
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        name: undefined,
        contenttype: undefined,
        isimg: undefined,
        source: undefined,
        createTime: undefined,
        srcId: undefined,
        srcType: undefined,
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
        name: [
          { required: true, message: "文件名称不能为空", trigger: "blur" }
        ],        contenttype: [
          { required: true, message: "文件类型不能为空", trigger: "blur" }
        ],        isimg: [
          { required: true, message: "是否图片不能为空", trigger: "blur" }
        ],        size: [
          { required: true, message: "文件大小不能为空", trigger: "blur" }
        ],        path: [
          { required: true, message: "文件路径不能为空", trigger: "blur" }
        ],        createTime: [
          { required: true, message: "上传时间不能为空", trigger: "blur" }
        ],      }
    };
  },
  created() {
    this.getList();
    this.getDicts("sys_file_type").then(response => {
      this.contenttypeOptions = response.data;
    });
    this.getDicts("sys_yes_no").then(response => {
      this.isimgOptions = response.data;
    });
    this.getDicts("sys_file_store").then(response => {
      this.sourceOptions = response.data;
    });
  },
  methods: {
    /** 查询文件管理列表 */
    getList() {
      this.loading = true;
      listFile(this.queryParams).then(response => {
        this.fileList = response.rows;
        this.total = response.total;
        this.loading = false;
      });
    },
    // 文件类型字典翻译
    contenttypeFormat(row, column) {
      return this.selectDictLabel(this.contenttypeOptions, row.contenttype);
    },
    // 是否图片字典翻译
    isimgFormat(row, column) {
      return this.selectDictLabel(this.isimgOptions, row.isimg);
    },
    // 存储源字典翻译
    sourceFormat(row, column) {
      return this.selectDictLabel(this.sourceOptions, row.source);
    },
    // 取消按钮
    cancel() {
      this.open = false;
      this.reset();
    },
    // 表单重置
    reset() {
      this.form = {
        fileId: undefined,
        name: undefined,
        contenttype: undefined,
        isimg: undefined,
        size: undefined,
        path: undefined,
        url: undefined,
        source: undefined,
        createBy: undefined,
        createByCode: undefined,
        createByName: undefined,
        createTime: undefined,
        srcId: undefined,
        srcType: undefined,
        version: undefined
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
      this.ids = selection.map(item => item.fileId)
      this.single = selection.length!=1
      this.multiple = !selection.length
    },
    /** 新增按钮操作 */
    handleAdd() {
      this.reset();
      this.open = true;
      this.title = "添加文件信息";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const fileId = row.fileId || this.ids
      getFile(fileId).then(response => {
        this.form = response.data;
        this.open = true;
        this.title = "修改文件信息";
      });
    },
    /** 提交按钮 */
    submitForm: function() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          if (this.form.fileId != undefined) {
            updateFile(this.form).then(response => {
              if (response.code === 200) {
                this.msgSuccess("修改成功");
                this.open = false;
                this.getList();
              } else {
                this.msgError(response.msg);
              }
            });
          } else {
            addFile(this.form).then(response => {
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
      const fileIds = row.fileId || this.ids;
      this.$confirm('是否确认删除文件编号为"' + fileIds + '"的数据项?', "警告", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(function() {
          return delFile(fileIds);
        }).then(() => {
          this.getList();
          this.msgSuccess("删除成功");
        }).catch(function() {});
    },
    /** 导出按钮操作 */
    handleExport() {
      const queryParams = this.queryParams;
      this.$confirm('是否确认导出所有文件数据项?', "警告", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(function() {
          return exportFile(queryParams);
        }).then(response => {
          this.download(process.env.VUE_APP_BASE_API+'/auth-api/common/download/'+response.msg);
        }).catch(function(e) {
          console.log(e);
        });
    },
    
  }
 
};
</script>