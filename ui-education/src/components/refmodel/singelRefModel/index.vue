<!--
  单表 参照 默认组件 。
  author air Email:209308343@qq.com
  date 2020年4月15日11:35:47
 -->

<template>
  <div class="ref-model-main">
    <el-autocomplete
      v-model="queryParam.text"
      :placeholder="inputPlaceholder"
      clearable :trigger-on-focus="false"
      :fetch-suggestions="handleInputElQuery" @select="handleInputElQuerySelect">
      <i slot="suffix" class="el-icon-search" @click="showQueryFormDialog=!showQueryFormDialog"></i>
    </el-autocomplete>

    <!-- 详细选择 对话框 -->
    <el-dialog :title="queryFormTitle" :visible.sync="showQueryFormDialog"
               width="70%" :close-on-click-modal="false"
               append-to-body
      >
      <el-form ref="refModelQueryForm" :inline="true" label-width="68px">
        <el-form-item :label="formInputLabel" prop="text">
          <el-input
            v-model="queryParam.text"
            :placeholder="inputPlaceholder"
            clearable
          />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" icon="el-icon-search" size="mini"
                     @click="handleQueryDatas">{{formQueryBtnText}}
          </el-button>
        </el-form-item>
      </el-form>

      <el-table :data="dataList" border @row-dblclick="handleQueryTableRowClick" min-height="60%"
                v-loading="tabelLoading" :element-loading-text="tabelLoadingText"
                empty-text="没有数据" :stripe="true">
        <el-table-column label="选择" width="55">
          <template slot-scope="scope">
            <el-radio v-model="queryTableSelectIndex"
                      :label="scope.row"><i></i></el-radio>
          </template>
        </el-table-column>
        <el-table-column v-for="head in tableHeaders" :label="head.label"
                         :align="head.align ? head.align : 'center'" :prop="head.key"
                         v-if="!head.hide"/>
      </el-table>
      <pagination
        v-show="queryParam.total > 0"
        :total="queryParam.total"
        :page.sync="queryParam.pageNum"
        :limit.sync="queryParam.pageSize"
        @pagination="handleQueryDatas"
      />
      <span slot="footer" class="dialog-footer">
        <el-button @click="showQueryFormDialog = false">取 消</el-button>
        <el-button type="primary" @click="handleQueryTableOkBtn">确 定</el-button>
      </span>
    </el-dialog>

  </div>
</template>

<script>
  import {toTreeBO, findObj, findObjValue, notEmpty, isEmpty, notNull, isNull} from "@/utils/ObjectUtil";
  import request from '@/utils/request';

  export default {
    name: "singelRefModel",
    props: {
      /** 属性数据 */
      value: undefined,
      /** 参照最终需要值的 属性名 也就是 value要赋值 对象的哪个字段 */
      idField: undefined,
      /** 输入框选择了后 要显示的 属性名 <br>
       *  支持 数组和可填充字符串  ： <br>
       *   如果是可填充字符串   那么就填充。 比如 ： 编码=${code}|名字=${name}
       *  如果是数组 因为是拼接属性值显示出来 <br>
       * */
      showField: undefined,
      /** 输入框选择了后 要显示的 属性名如果输数组 那么他的拼接间隔符是啥 <br>
       * 支持数组
       * */
      showFieldSplit: {
        type: String,
        default: '-'
      },
      /** 输入框的 Placeholder */
      inputPlaceholder: {
        type: String,
        default: '请输入搜索内容'
      },
      /** 弹出表格的左上角搜索框 标签名字  */
      formInputLabel: {
        type: String,
        default: ''
      },
      /** 弹出弹框的标题  */
      queryFormTitle: {
        type: String,
        default: '参照选择'
      },
      /** 弹出弹框table的加载中提示语句  */
      tabelLoadingText: {
        type: String,
        default: '正在搜索...'
      },
      /** 弹出弹框搜索按钮显示的名字 */
      formQueryBtnText: {
        type: String,
        default: '搜索'
      },
      /** 远程查询接口 描述 <br/>
       *  url 地址 <br/>
       *  method  请求方法   (默认post) <br/>
       *  urlpar url固定参数   <br/>
       *  bodypar 请求body固定参数    <br/>
       *
       *  注意：  <br/>
       *  如果 父类没有重写 请求前参数事件， 那么标准规范后端是 POST地址， 接受3个JSON参数： <br/>
       *  text 搜索字符串  <br/>
       *  pageNum 页码 （如果分页 才会传） <br/>
       *  pageSize 页大小  （如果分页 才会传）<br/>
       *  needPage 是否需要分页 false 不需要分页 默认是true <br/>
       *
       *  如果用标准规范后端，后端接口必须返回 com.czyl.framework.web.page.TableDataInfo 对象
       * */
      urlInfo: {
        type: Object,
        default: undefined
      },
      /** 是否支持分页，默认true */
      needPage: {
        type: Boolean,
        default: true
      },
      /** 表格的表头描述 <br/>
       * 参数:<br/>
       *  label            表头名字    （必须）      <br/>
       *  key         属性名字    （必须）         <br/>
       *  align        对齐方式   (默认居中center)  <br/>
       *  hide      是否隐藏此列  （默认 false 不隐藏）  <br/>
       **/
      tableHeaders: undefined,


      /** 查询数据 <br/>
       * 参数:<br/>
       *  str            输入的字符串           <br/>
       *  pageNum         页码              <br/>
       *  pageSize           页大小              <br/>
       *  el         组件实例                    <br/>
       *  datas         当前的数据列表                      <br/>
       *  nowDate        当前选择的数据          <br/>
       *  needPage        是否需要分页           <br/>
       *  return 请返回 promise 结果： {data: 数据, total: 总数}
       **/
      onQueryDatas: Function,
      /** 事件  */
      /** 查询远程数据之前 事件回调，可以这里做 参数二次封装等 <br/>
       * 参数:<br/>
       *  urlInfo         请求参数等描述对象                  <br/>
       *  str         输入的查询字符串                      <br/>
       *  pageNum         页码              <br/>
       *  pageSize           页大小              <br/>
       *  datas        当前的数据列表           <br/>
       *  nowDate        当前选择的数据          <br/>
       *   el         组件实例                    <br/>
       *    needPage        是否需要分页           <br/>
       *   return  如果返回的是 null 或 undifind 或 boolean值 就取消查询， 如果返回的 是 对象 认为是 基于urlInfo的参数对象
       **/
      handlerOnBeforQueryDatas: Function,
      /** 当选择的内容发生改变 <br/>
       * 参数:<br/>
       *  el         组件实例                    <br/>
       *  datas         当前的数据列表                      <br/>
       *  nowDate        当前选择的数据          <br/>
       **/
      handlerOnChange: Function,
      /** 点了放大镜，如果返回不是promise 而是null 或 undifind 或 boolean值 不调用后续的处理 <br/>
       * 参数:<br/>
       *  el         组件实例                    <br/>
       *  datas         当前的数据列表                      <br/>
       *  nowDate        当前选择的数据          <br/>
       **/
      handlerOnShowTable: Function,
      /** 点了清空 <br/>
       * 参数:<br/>
       *  el         组件实例                    <br/>
       *  datas         当前的数据列表                      <br/>
       *  nowDate        当前选择的数据          <br/>
       **/
      handlerOnClear: Function,
      /** 输入框 键入内容事件  <br/>
       * 参数:<br/>
       * str    当前输入的字符串       <br/>
       *  el         组件实例                    <br/>
       *  datas         当前的数据列表                      <br/>
       *  nowDate        当前选择的数据          <br/>
       **/
      handlerOnInput: Function,
      /** 当table弹框的行被双击，如果返回不是promise 而是null 或 undifind 或 boolean值 不会执行后续逻辑 <br/>
       * 参数:<br/>
       * row   被双击行的数据   <br/>
       * cell  被双击的列    <br/>
       * event 双击事件对象  <br/>
       *  el         组件实例                    <br/>
       *  datas         当前的数据列表                      <br/>
       *  nowDate        当前选择的数据          <br/>
       **/
      handleOnQueryTableRowClick: Function
    },
    data() {
      return {
        /** 弹框 选择的行 */
        queryTableSelectIndex: -1,
        //查询 计量单位的 输入的
        queryParam: {
          text: undefined,
          pageNum: 1,
          pageSize: 10,
          total: 0
        },
        //显示 单位档案的 弹窗
        showQueryFormDialog: false,
        //当前的查询出的数据列表
        dataList: [],
        //当前选择的数据
        nowData: undefined,
        //表格 加载中动画
        tabelLoading: false
      }
    },
    created() {

    },
    methods: {
      /**  执行查询    */
      doQueryDatas() {
        //最优先 父类如果重写了 查询函数
        if (typeof this.onQueryDatas === 'function'
          || this.onQueryDatas instanceof Function) {
          let re = this.onQueryDatas(this.queryParam.text, this.queryParam.pageNum
            , this.queryParam.pageSize, this, this.dataList, this.nowData, this.needPage);
          if (!re
            || re instanceof Boolean
            || typeof re === 'boolean') {
            return;
          }

          return re.then(res => {
            this.dataList = res.data;
            this.queryParam.total = res.total;
          });
        }

        //其次 才是 配置了标准查询规范的
        if (!this.urlInfo) {
          //啥也没配置，查询不了 直接终止
          this.msgInfo('没有查询到任何数据');
          return;
        }

        let remoteInfo = {
          ...this.urlInfo,
          bodypar: {
            text: this.queryParam.text,
            pageNum: this.queryParam.pageNum,
            pageSize: this.queryParam.pageSize,
            needPage: this.needPage,
          },
          urlpar: {
            pageNum: this.queryParam.pageNum,
            pageSize: this.queryParam.pageSize,
            needPage: this.needPage
          }
        };
        //如果父类 传了 请求参数前置处理监听器，就执行一下子
        if (typeof this.handlerOnBeforQueryDatas === 'function'
          || this.handlerOnBeforQueryDatas instanceof Function) {
          remoteInfo = this.handlerOnBeforQueryDatas(remoteInfo, this.queryParam.text
            , this.queryParam.pageNum
            , this.queryParam.pageSize, this.dataList
            , this.nowData, this, this.needPage);
        }

        if (!remoteInfo
          || remoteInfo instanceof Boolean
          || typeof remoteInfo === 'boolean') {
          return;
        }

        return request({
          url: remoteInfo.url,
          method: remoteInfo.method ? remoteInfo.method : 'post',
          params: remoteInfo.urlpar,
          data: remoteInfo.bodypar
        }).then(response => {
          return {
            data: response.rows,
            total: response.total
          };
        })
      },
      /**
       * 弹出框的查询
       */
      handleQueryDatas() {
        this.tabelLoading = true;

        let qre = this.doQueryDatas();
        if (!qre
          || qre instanceof Boolean
          || typeof qre === 'boolean') {
          this.tabelLoading = false;
          return;
        }

        qre.then(re => {
          this.dataList = re.data;
          this.queryParam.total = re.total;
          this.tabelLoading = false;
        });
      },
      /**  输入框的 输入建议查询 */
      handleInputElQuery(str, cb) {
        let qre = this.doQueryDatas();
        if (!qre
          || qre instanceof Boolean
          || typeof qre === 'boolean') {
          return;
        } else {
          qre.then(re => {
            this.dataList = re.data;
            this.queryParam.total = re.total;

            if (isEmpty(this.dataList)) {
              return;
            }
            //处理自动完成需要的字段
            this.dataList.forEach(row => {
              row.value = this.buildeInputShowText(row);
            });

            clearTimeout(this.timeout);
            this.timeout = setTimeout(() => {
              cb(this.dataList);
            }, 3000 * Math.random());
          });
        }
      },
      /** 弹框 表格 行 双击 */
      handleQueryTableRowClick(row, cell, event) {
        this.nowData = row;
        this.queryTableSelectIndex = row;
        this.showQueryFormDialog = false;
      },
      /** 点击了 弹框的 确定 */
      handleQueryTableOkBtn() {
        if(!this.queryTableSelectIndex){
          return ;
        }

        this.nowData = this.queryTableSelectIndex;
        this.showQueryFormDialog = false;
      },
      /** 根据props配置 来组装显示的字符串 */
      buildeInputShowText(newv, oldv){
        let text = '';
        if (this.showField instanceof String
          || typeof this.showField === 'string') {
          //可填充字符串
          text = this.showField;
          //解析变量
          // 变量语法 正则匹配
          const PATTERN_SQL_PARMAR = /\${[^}]+}/g;
          let els = text.match(PATTERN_SQL_PARMAR);
          if(Array.isArray(els)){
            for (let i = 0; i < els.length; i++) {
              while(text.indexOf(els[i]) > -1){
                text = text.replace(els[i]
                  , newv[els[i].substr(2 , els[i].length-3)]);
              }
            }
          }
        } else if (Array.isArray(this.showField)) {
          for (let i = 0; i < this.showField.length; i++) {
            if (i != 0) {
              text += this.showFieldSplit;
            }

            text += newv[this.showField[i]];
          }
        } else {
          text = JSON.stringify(newv);
        }

        return text;
      },
      /**输入框的 输入建议后 选择了某个 建议 */
      handleInputElQuerySelect(data){
        this.queryTableSelectIndex = data;
        this.nowData = data;
      }
    },
    watch: {
      nowData(newv, oldv) {
        this.$emit("input", this.idField ? newv[this.idField] : newv);
        this.queryParam.text = this.buildeInputShowText(newv, oldv);
      }
    }

  }
</script>

<style >
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
