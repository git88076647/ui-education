<template>
 <div>
  <div class="app-container" v-show="designVisible">
  
      <el-form :model="queryParams" ref="queryForm" :inline="true" label-width="68px">
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
      <el-form-item label="格式设计json" prop="formatjson">
        <el-input
          v-model="queryParams.formatjson"
          placeholder="请输入格式设计json"
          clearable

          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="格式生成html" prop="formathtml">
        <el-input
          v-model="queryParams.formathtml"
          placeholder="请输入格式生成html"
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
          v-hasPermi="['rep:template:add']"
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
          v-hasPermi="['rep:template:edit']"
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
          v-hasPermi="['rep:template:remove']"
        >删除
        </el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="warning"
          icon="el-icon-download"
          size="mini"
          @click="handleExport"
          v-hasPermi="['rep:template:export']"
        >导出
        </el-button>
      </el-col>
    </el-row>

    <el-table v-loading="loading" :data="templateList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center"/>
      <el-table-column label="编码" align="center" prop="code"/>
      <el-table-column label="名字" align="center" prop="name"/>
      <el-table-column label="格式设计json" align="center" prop="formatjson"/>
      <el-table-column label="格式生成html" align="center" prop="formathtml"/>
      <el-table-column label="备注" align="center" prop="description"/>
      <el-table-column label="状态" align="center" prop="statue"/>
      <el-table-column label="组织id" align="center" prop="orgId"/>
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-view"
            @click="handleExec(scope.row)"
            v-hasPermi="['rep:template:exec']"
          >执行
          </el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-setting"
            @click="handleDesign(scope.row)"
            v-hasPermi="['rep:template:edit']"
          >设计
          </el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
            v-hasPermi="['rep:template:edit']"
          >修改
          </el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['rep:template:remove']"
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

    <!-- 添加或修改报表模板对话框 -->
    <el-dialog append-to-body :title="title" :visible.sync="open" width="620px" :close-on-click-modal=false>
      <el-form ref="form" :model="form" :inline="true" :rules="rules" label-width="80px">
        <el-form-item label="编码" prop="code">
          <el-input v-model="form.code" placeholder="请输入编码"/>
        </el-form-item>
        <el-form-item label="名字" prop="name">
          <el-input v-model="form.name" placeholder="请输入名字"/>
        </el-form-item>
        <el-form-item label="格式设计json" prop="formatjson">
          <el-input v-model="form.formatjson" placeholder="请输入格式设计json"/>
        </el-form-item>
        <el-form-item label="格式生成html" prop="formathtml">
          <el-input v-model="form.formathtml" placeholder="请输入格式生成html"/>
        </el-form-item>
        <el-form-item label="版本号-乐观锁" prop="version">
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
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>



    <!--选择语义模型 对话框 -->
    <el-dialog append-to-body :title="title" :visible.sync="showDesignForm"  width="70%" :close-on-click-modal="false"   element-loading-text="加载中...">
     <el-col :span="1.5">
        <el-button
          type="primary"
          icon="el-icon-plus"
          size="mini"
          @click="handleSemanticAdd"
        >新增
        </el-button>
      </el-col>
      
      <el-table  :data="semanticlist"  border height="450" style="width: 100%" @selection-change="handleSemanticSelectionChange">
        <el-table-column label="关联id" align="center" prop="pkTemplateSemantic"/>
        <el-table-column label="报表id" align="center" prop="pkTemplate"/>
        <el-table-column label="语义模型id" align="center" prop="pkSemantic"/>
        <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
           <el-button
              size="mini"
              type="text"
              icon="el-icon-delete"
              @click="handleSemanticDelete(scope.row)"
              v-hasPermi="['rep:semantic:remove']"
            >删除
          </el-button>
           </template>
        </el-table-column>
        
      </el-table>
      <div slot="footer" class="dialog-footer">
       <el-button type="primary" @click="confirmDesign">
         设计报表
        </el-button>
        <el-button @click=" ()=>{showDesignForm = false; }">取 消
        </el-button>
      </div>
    </el-dialog>
  </div>

  <!-- 选择语义模型弹框 -->
    <el-dialog append-to-body :title="title" :visible.sync="semanticOpen" width="620px" :close-on-click-modal=false>
     <el-autocomplete
        v-model="semanticCode" :fetch-suggestions="querySearchAsync" placeholder="请输入语义编码" @select="handleSelect"
      >
      </el-autocomplete>
        <div slot="footer" class="dialog-footer">
          <el-button type="primary" @click="comfirmTemplateSemantic">确 定</el-button>
          <el-button @click="cancelTemplateSemantic">取 消</el-button>
        </div>
    </el-dialog>
       <!-- 格式设计-->
     <div class="container" v-show="!designVisible">
        <div class="left-board">
          <el-scrollbar class="left-scrollbar">
            <div class="components-list">
              <div v-for="(item, listIndex) in leftComponents" :key="listIndex">
                <div class="components-title">
                  <svg-icon icon-class="component" />
                  {{ item.title }}
                </div>
                <draggable
                  class="components-draggable"
                  :list="item.list"
                  :group="{ name: 'componentsGroup', pull: 'clone', put: false }"
                  :clone="cloneComponent"
                  draggable=".components-item"
                  :sort="false"
                  @end="onEnd"
                >
                  <div
                    v-for="(element, index) in item.list"
                    :key="index"
                    class="components-item"
                    @click="addComponent(element)"
                  >
                    <div class="components-body">
                      {{ element.__config__.label }}
                    </div>
                  </div>
                </draggable>
              </div>

            </div>
          </el-scrollbar>
        </div>
         <div class="center-board">
              <div class="action-bar">
                  <el-button icon="el-icon-video-play" type="text" @click="returnList">
                    返回
                  </el-button>
                  <el-button icon="el-icon-video-play" type="text" @click="saveDesign">
                    保存设计
                  </el-button>
                  <el-button class="delete-btn" icon="el-icon-delete" type="text" @click="empty">
                    清空
                  </el-button>
            </div>
            <el-scrollbar class="center-scrollbar">
                    <el-row class="center-board-row" :gutter="formConf.gutter">
                      <el-form
                        :size="formConf.size"
                        :label-position="formConf.labelPosition"
                        :disabled="formConf.disabled"
                        :label-width="formConf.labelWidth + 'px'"
                      >
                        <draggable class="drawing-board" :list="drawingList" :animation="340" group="componentsGroup">
                          <draggable-item
                            v-for="(element, index) in drawingList"
                            :key="element.renderKey"
                            :drawing-list="drawingList"
                            :element="element"
                            :index="index"
                            :active-id="activeId"
                            :form-conf="formConf"
                            @activeItem="activeFormItem"
                            @copyItem="drawingItemCopy"
                            @deleteItem="drawingItemDelete"
                          />
                        </draggable>
                        <div v-show="!drawingList.length" class="empty-info">
                          从左侧拖入或点选组件进行设计
                        
                        </div>
                      </el-form>
                    </el-row>
            </el-scrollbar>
        </div>
            <right-panel
              :active-data="activeData"
              :form-conf="formConf"
              :show-field="!!drawingList.length"
              @tag-change="tagChange"
            />

            <form-drawer
              :visible.sync="drawerVisible"
              :form-data="formData"
              size="100%"
              :generate-conf="generateConf"
            />
            <input id="copyNode" type="hidden">
     </div>

  

 </div>


</template>

<script>
  import {
    listTemplate,
    getTemplate,
    delTemplate,
    addTemplate,
    updateTemplate,
    exportTemplate
  } from "@/api/rep/template";
  //导入语义模型api
  import {
    listSemantic,
    getSemanticResultMetas
  } from "@/api/rep/semantic";
  //导入语义模型关联关系
   import {
    listtemplatesemantic,
    addtemplatesemantic,
    deltemplatesemantic,
  } from "@/api/rep/templateSemantic";

import draggable from 'vuedraggable'
import { debounce } from 'throttle-debounce'
import { saveAs } from 'file-saver'
import beautifier from 'beautifier'
import ClipboardJS from 'clipboard'
import render from '@/components/render/render'
import FormDrawer from './FormDrawer'
import JsonDrawer from './JsonDrawer'
import RightPanel from './RightPanel'
import {
  inputComponents, selectComponents, layoutComponents, formConf,exportDefaultComponents,defaultSemanticlist
} from '@/components/generator/config'
import {
  exportDefault, beautifierConf, isNumberStr, titleCase
} from '@/utils/index'
import {
  makeUpHtml, vueTemplate, vueScript, cssStyle
} from '@/components/generator/html'
import { makeUpJs } from '@/components/generator/js'
import { makeUpCss } from '@/components/generator/css'
import drawingDefalut from '@/components/generator/drawingDefalut'
import CodeTypeDialog from './CodeTypeDialog'
import DraggableItem from './DraggableItem'
import {
  getDrawingList, saveDrawingList, getIdGlobal, saveIdGlobal, getFormConf
} from '@/utils/db'

const emptyActiveData = { style: {}, autosize: {} }
let oldActiveId
let tempActiveData
const drawingListInDB = getDrawingList()
const formConfInDB = getFormConf()
const idGlobal = getIdGlobal()

  export default {
            components: {
              draggable,
              render,
              FormDrawer,
              JsonDrawer,
              RightPanel,
              CodeTypeDialog,
              DraggableItem
            },
    data() {
      return {
        //当前设计这些操作针对的 记录
        selectVO: {},
        // 遮罩层
        loading: true,
        //设计页面
        designVisible: true,
        showDesignForm: false,
        //语义模型数据
        semanticlist :[],
        // 选中数组
        ids: [],
        // 非单个禁用
        single: true,
        // 非多个禁用
        multiple: true,
        // 总条数
        total: 0,
        // 报表模板表格数据
        templateList: [],
        // 弹出层标题
        title: "",
        // 是否显示弹出层
        open: false,
        //语义模型弹框
        semanticOpen:false,
        //语义模型选中数组
        semanticIds: [],
        formData: {},
        generateConf: null,
        curSelentSemantic:"",
        // 查询参数
        queryParams: {
          pageNum: 1,
          pageSize: 10,
          code: undefined,
          name: undefined,
          formatjson: undefined,
          formathtml: undefined,
          description: undefined,
          statue: undefined,
          orgId: undefined
        },
        // 表单参数
        form: {},
        drawerVisible: false,
        // 表单校验
        rules: {
          code: [
            {required: true, message: "编码不能为空", trigger: "blur"}
          ], name: [
            {required: true, message: "名字不能为空", trigger: "blur"}
          ],
        },
        semanticCode:'',
        formConf,
        drawingList: drawingDefalut,
        drawingData: {},
        activeData: drawingDefalut[0],
        activeId: drawingDefalut[0].formId,
        layoutComponents,
        inputComponents,
        leftComponents: [
          {
            title: '布局',
            list: layoutComponents
          }
          
        ]
      };
    },
    created() {
      this.getList();
    },
    methods: {
      /** 查询报表模板列表 */
      getList() {
        this.loading = true;
        listTemplate(this.queryParams).then(response => {
          this.templateList = response.rows;
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
          pkTemplate: undefined,
          code: undefined,
          name: undefined,
          formatjson: undefined,
          formathtml: undefined,
          createBy: undefined,
          createTime: undefined,
          updateBy: undefined,
          updateTime: undefined,
          version: undefined,
          description: undefined,
          dr: undefined,
          statue: undefined,
          orgId: undefined
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
        this.ids = selection.map(item => item.pkTemplate)
        this.single = selection.length != 1
        this.multiple = !selection.length
      },
      /** 新增按钮操作 */
      handleAdd() {
        this.reset();
        this.open = true;
        this.title = "添加报表模板";
      },
      /** 修改按钮操作 */
      handleUpdate(row) {
        this.reset();
        const pkTemplate = row.pkTemplate || this.ids
        getTemplate(pkTemplate).then(response => {
          this.form = response.data;
          this.open = true;
          this.title = "修改报表模板";
        });
      },
      /** 提交按钮 */
      submitForm: function () {
        this.$refs["form"].validate(valid => {
          if (valid) {
            if (this.form.pkTemplate != undefined) {
              console.log(JSON.stringify(this.form))
              updateTemplate(this.form).then(response => {
                if (response.code === 200) {
                  this.msgSuccess("修改成功");
                  this.open = false;
                  this.getList();
                } else {
                  this.msgError(response.msg);
                }
              });
            } else {
              addTemplate(this.form).then(response => {
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
        const pkTemplates = row.pkTemplate || this.ids;
        this.$confirm('是否确认删除报表模板编号为"' + pkTemplates + '"的数据项?', "警告", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(function () {
          return delTemplate(pkTemplates);
        }).then(() => {
          this.getList();
          this.msgSuccess("删除成功");
        }).catch(function () {
        });
      },
      /** 导出按钮操作 */
      handleExport() {
        const queryParams = this.queryParams;
        this.$confirm('是否确认导出所有报表模板数据项?', "警告", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(function () {
          return exportTemplate(queryParams);
        }).then(response => {
          this.download(response.msg);
        }).catch(function () {
        });
      },
      /** 设计按钮操作 */
      handleDesign(row) {
        //报表pk值
        const pkTemplate = row.pkTemplate || this.ids[0];
   
        this.selectVO = Object.assign({}, this.templateList.find(vo => vo.pkTemplate === pkTemplate));
       
         var queryParamJson ={ "pkTemplate" : pkTemplate}
         this.listtemplatesemantic(queryParamJson);
          this.showDesignForm = true;
      },
      listtemplatesemantic(json){
            listtemplatesemantic(json).then(response => {
              var queryResult = response.rows;
              this.semanticlist = queryResult;
               console.log("this.semanticlist")
              console.log(this.semanticlist)
          });
      },
      onEnd(obj) {
      if (obj.from !== obj.to) {
        this.activeData = tempActiveData
        this.activeId = this.idGlobal
      }
    },
    empty() {
      this.$confirm('确定要清空所有组件吗？', '提示', { type: 'warning' }).then(
        () => {
          this.drawingList = []
          this.idGlobal = 100
        }
      )
    },
     drawingItemCopy(item, parent) {
      let clone = JSON.parse(JSON.stringify(item))
      clone = this.createIdAndKey(clone)
      parent.push(clone)
      this.activeFormItem(clone)
    },
     tagChange(newTag) {
      newTag = this.cloneComponent(newTag)
      const config = newTag.__config__
      newTag.__vModel__ = this.activeData.__vModel__
      config.formId = this.activeId
      config.span = this.activeData.__config__.span
      this.activeData.__config__.tag = config.tag
      this.activeData.__config__.tagIcon = config.tagIcon
      this.activeData.__config__.document = config.document
      if (typeof this.activeData.__config__.defaultValue === typeof config.defaultValue) {
        config.defaultValue = this.activeData.__config__.defaultValue
      }
      Object.keys(newTag).forEach(key => {
        if (this.activeData[key] !== undefined) {
          newTag[key] = this.activeData[key]
        }
      })
      console.log(newTag)
      this.activeData = newTag
      this.updateDrawingList(newTag, this.drawingList)
    },
    activeFormItem(element) {
      this.activeData = element
      this.activeId = element.__config__.formId
    },
      //设计报表
      confirmDesign(){
        
        if(this.semanticlist.length>0){
                 var jsonArray =  new Array(); 
                
                this.semanticlist.forEach(function(value,index,array){
                    jsonArray.push(value.pkSemantic)
          　　  });

            getSemanticResultMetas(jsonArray).then(response => {
                if(response.code==200){
                  //
                   for (var key in response.data) {
                    
                    var field =  response.data[key];
                    var leftItemtComponent = {};
                    var leftItemtArray = new Array();
                    leftItemtComponent.title = key;
                    
                        //封装字段 
                        for (var key in  field.data.filed2TypeMap) {
                              var filed2Type = key;
                              var filed2TypeValue = field.data.filed2TypeMap[key];
                              var filedShowNames  = field.data.filedShowNames[key];
                              var inputJson = {
                                        __config__: {
                                          label: filedShowNames,
                                          labelWidth: null,
                                          changeTag: true,
                                          tag: 'el-input',
                                          value:'ces',
                                          defaultValue: filed2Type,
                                          layout: 'colFormItem',
                                          span: '3',
                                          document: 'https://element.eleme.cn/#/zh-CN/component/input',
                                        },
                                        // 组件的插槽属性
                                        __vModel__: filed2Type,
                                        // 其余的为可直接写在组件标签上的属性
                                        placeholder: '',
                                        style: { width: '100%' },
                                        clearable: false,
                                        maxlength: null,
                                        'show-word-limit': false,
                                        readonly: false,
                                        disabled: false
                                }
                              leftItemtArray.push(inputJson);   
                        }
                        leftItemtComponent.list = leftItemtArray;
                      
                      this.leftComponents.push(leftItemtComponent);
                   }
            
                    this.showDesignForm = false;
                    this.designVisible = false;
                }
              
          });
          
             



        }else{
              this.msgError("请关联一个语义模型");
        }

      },
      returnList(){
        this.designVisible = true;
      },
      /** 执行查询按钮操作 */
      handleExec(row) {


      }, 
      //语义模型框
      handleSemanticAdd(){
        this.semanticOpen = true;
      },
      //语义异步检索
      querySearchAsync(queryString, cb) {
          var restaurants = this.restaurants;
          var queryParamJson = {
              "code":queryString
          }
          listSemantic(queryParamJson).then(response => {
              var queryResult = response.rows;
              console.log(queryResult);
              var results = queryString ? queryResult.filter(this.createStateFilter(queryString)) : queryResult;
                for (var i = 0; i < results.length; i++) { 
                    results[i].value = results[i].name;
                }
                clearTimeout(this.timeout);
                  this.timeout = setTimeout(() => {
                    cb(results);
                  }, 1000 * Math.random());

          });
      },
       //语义模型框选择多选设计表
       handleSemanticSelectionChange(selection) {
            console.log(selection);
             console.log("selection")
            this.semanticIds = selection.map(item => item.pkSemantic);
             console.log(this.semanticIds);
      },
      handleSemanticDelete(row){
          const pkTemplateSemantic = row.pkTemplateSemantic || this.ids;

          this.$confirm(
            '是否确认删除语义关联关系编号为"' + pkTemplateSemantic + '"的数据项?',
            "警告",
            {
              confirmButtonText: "确定",
              cancelButtonText: "取消",
              type: "warning"
            }
          )
            .then(function () {
              return deltemplatesemantic(pkTemplateSemantic);
            })
            .then(() => {

              var queryParamJson ={ "pkTemplate" : this.selectVO.pkTemplate}
              this.listtemplatesemantic(queryParamJson);
              this.msgSuccess("删除成功");
            })
            .catch(function () {
            });
      },
      //语义关联模型框取消按钮
      cancelTemplateSemantic(){
        this.semanticOpen = false;
      },
      //语义关联模型保存
      comfirmTemplateSemantic(){
           var savedataJson = {
               "pkTemplate" :this.selectVO.pkTemplate,
               "pkSemantic" :this.curSelentSemantic
          }
          //保存
          addtemplatesemantic(savedataJson).then(response => {
                 if (response.code === 200) {
                      this.msgSuccess("新增成功");
                      this.semanticOpen = false;
                        var queryParamJson ={ "pkTemplate" : this.selectVO.pkTemplate}
                         this.listtemplatesemantic(queryParamJson);
                   
                } else {
                     this.msgError(response.msg);
                }
                this.curSelentSemantic = "";

          });


      },
      handleSelect(item) {
              //当前语义模型pk
              this.curSelentSemantic = item.pkSemantic;
      
      },
       createStateFilter(queryString) {
        return (semanticCode) => {
         console.log(semanticCode.code)
          return (semanticCode.code.toLowerCase().indexOf(queryString.toLowerCase()) === 0);
        };
      },
      /** 保存设计 */
      saveDesign(){
          var json = {
              "pkTemplate" :this.selectVO.pkTemplate,
               "version"   :this.selectVO.version,
               "formatjson":JSON.stringify(this.drawingList)
          }
           console.log(json);
          updateTemplate(json).then(response => {
              if (response.code === 200) {
                this.msgSuccess("修改成功");
               
              } else {
                this.msgError(response.msg);
              }
            });
      },
      drawingItemDelete(index, parent) {
          parent.splice(index, 1)
          this.$nextTick(() => {
            const len = this.drawingList.length
            if (len) {
              this.activeFormItem(this.drawingList[len - 1])
            }
          })
      },

      cloneComponent(origin) {
          const clone = JSON.parse(JSON.stringify(origin))
          const config = clone.__config__
          config.formId = ++this.idGlobal
          config.span = formConf.span
          config.renderKey = +new Date() // 改变renderKey后可以实现强制更新组件
          if (config.layout === 'colFormItem') {
            clone.__vModel__ = `field${this.idGlobal}`
            clone.placeholder !== undefined && (clone.placeholder += config.label)
          } else if (config.layout === 'rowFormItem') {
            config.componentName = `row${this.idGlobal}`
            config.gutter = this.formConf.gutter
          }
          tempActiveData = clone
          return tempActiveData
        },
      
    }
  };
</script>

<style lang='scss'>
//没设置域，导致全局css受影响
// $selectedColor: #f6f7ff;
// $lighterBlue: #409EFF;

// //没设置域，导致全局css受影响
// // .el-input__inner{
// //    border:1px dashed;
// //    padding:0px;
// // }
// .drawing-row-item {
//     position: relative;
//     cursor: move;
//     box-sizing: border-box;
//     border: 1px dashed #ccc;
//     border-radius: 3px;
// }
// .drawing-board .active-from-item>.el-form-item {
    
// }


// .drawing-item .el-form-item {
//      padding: 0px 0px !important;
// }



// .container {
//   position: relative;
//   width: 100%;
//   height: 100%;
// }

// .components-list {
//   padding: 8px;
//   box-sizing: border-box;
//   height: 100%;
//   .components-item {
//     display: inline-block;
//     width: 48%;
//     margin: 1%;
//     transition: transform 0ms !important;
//   }
// }
// .components-draggable{
//   padding-bottom: 20px;
// }
// .components-title{
//   font-size: 14px;
//   color: #222;
//   margin: 6px 2px;
//   .svg-icon{
//     color: #666;
//     font-size: 18px;
//   }
// }

// .components-body {
//   padding: 8px 10px;
//   background: $selectedColor;
//   font-size: 12px;
//   cursor: move;
//   border: 1px dashed $selectedColor;
//   border-radius: 3px;
//   .svg-icon{
//     color: #777;
//     font-size: 15px;
//   }
//   &:hover {
//     border: 1px dashed #787be8;
//     color: #787be8;
//     .svg-icon {
//       color: #787be8;
//     }
//   }
// }

// .left-board {
//   width: 260px;
//   position: absolute;
//   left: 0;
//   top: 0;
//   height: 100vh;
// }
// .left-scrollbar{
//   height: calc(100vh - 42px);
//   overflow: hidden;
// }
// .center-scrollbar {
//   height: calc(100vh - 42px);
//   overflow: hidden;
//   border-left: 1px solid #f1e8e8;
//   border-right: 1px solid #f1e8e8;
//   box-sizing: border-box;
// }
// .center-board {
//   height: 100vh;
//   width: auto;
//   margin: 0 350px 0 260px;
//   box-sizing: border-box;
// }
// .empty-info{
//   position: absolute;
//   top: 46%;
//   left: 0;
//   right: 0;
//   text-align: center;
//   font-size: 18px;
//   color: #ccb1ea;
//   letter-spacing: 4px;
// }
// .action-bar{
//   position: relative;
//   height: 42px;
//   text-align: right;
//   padding: 0 15px;
//   box-sizing: border-box;;
//   border: 1px solid #f1e8e8;
//   border-top: none;
//   border-left: none;
//   .delete-btn{
//     color: #F56C6C;
//   }
// }
// .logo-wrapper{
//   position: relative;
//   height: 42px;
//   background: #fff;
//   border-bottom: 1px solid #f1e8e8;
//   box-sizing: border-box;
// }
// .logo{
//   position: absolute;
//   left: 12px;
//   top: 6px;
//   line-height: 30px;
//   color: #00afff;
//   font-weight: 600;
//   font-size: 17px;
//   white-space: nowrap;
//   > img{
//     width: 30px;
//     height: 30px;
//     vertical-align: top;
//   }
//   .github{
//     display: inline-block;
//     vertical-align: sub;
//     margin-left: 15px;
//     > img{
//       height: 22px;
//     }
//   }
// }

// .center-board-row {
//   padding: 12px 12px 15px 12px;
//   box-sizing: border-box;
//   & > .el-form {
//     // 69 = 12+15+42
//     height: calc(100vh - 69px);
//   }
// }
// .drawing-board {
//   height: 100%;
//   position: relative;
//   .components-body {
//     padding: 0;
//     margin: 0;
//     font-size: 0;
//   }
//   .sortable-ghost {
//     position: relative;
//     display: block;
//     overflow: hidden;
//     &::before {
//       content: " ";
//       position: absolute;
//       left: 0;
//       right: 0;
//       top: 0;
//       height: 3px;
//       background: rgb(89, 89, 223);
//       z-index: 2;
//     }
//   }
//   .components-item.sortable-ghost {
//     width: 100%;
//     height: 60px;
//     background-color: $selectedColor;
//   }
//   .active-from-item {
//     & > .el-form-item{
//       background: $selectedColor;
//       border-radius: 6px;
//     }
//     & > .drawing-item-copy, & > .drawing-item-delete{
//       display: initial;
//     }
//     & > .component-name{
//       color: $lighterBlue;
//     }
//   }
//   .el-form-item{
//     margin-bottom: 15px;
//   }
// }
// .drawing-item{
//   position: relative;
//   cursor: move;
//   &.unfocus-bordered:not(.active-from-item) > div:first-child {
//     border: 1px dashed #ccc;
//   }
//   .el-form-item{
//     padding: 12px 10px;
//   }
// }
// .drawing-row-item{
//   position: relative;
//   cursor: move;
//   box-sizing: border-box;
//   border: 1px dashed #ccc;
//   border-radius: 3px;
//   padding: 0 2px;
//   margin-bottom: 15px;
//   .drawing-row-item {
//     margin-bottom: 2px;
//   }
//   .el-col{
//     margin-top: 22px;
//   }
//   .el-form-item{
//     margin-bottom: 0;
//   }
//   .drag-wrapper{
//     min-height: 80px;
//   }
//   &.active-from-item{
//     border: 1px dashed $lighterBlue;
//   }
//   .component-name{
//     position: absolute;
//     top: 0;
//     left: 0;
//     font-size: 12px;
//     color: #bbb;
//     display: inline-block;
//     padding: 0 6px;
//   }
// }
// .drawing-item, .drawing-row-item{
//   &:hover {
//     & > .el-form-item{
//       background: $selectedColor;
//       border-radius: 6px;
//     }
//     & > .drawing-item-copy, & > .drawing-item-delete{
//       display: initial;
//     }
//   }
//   & > .drawing-item-copy, & > .drawing-item-delete{
//     display: none;
//     position: absolute;
//     top: -10px;
//     width: 22px;
//     height: 22px;
//     line-height: 22px;
//     text-align: center;
//     border-radius: 50%;
//     font-size: 12px;
//     border: 1px solid;
//     cursor: pointer;
//     z-index: 1;
//   }
//   & > .drawing-item-copy{
//     right: 56px;
//     border-color: $lighterBlue;
//     color: $lighterBlue;
//     background: #fff;
//     &:hover{
//       background: $lighterBlue;
//       color: #fff;
//     }
//   }
//   & > .drawing-item-delete{
//     right: 24px;
//     border-color: #F56C6C;
//     color: #F56C6C;
//     background: #fff;
//     &:hover{
//       background: #F56C6C;
//       color: #fff;
//     }
//   }
// }

</style>
