<template>
  <div class="app-container">
    <el-row>
      <el-col :span="24" class="card-box">
        <el-card>
          <div slot="header">
            <span>基本信息</span>
            <el-tooltip
              v-for="item in keyList"
              :key="item.value"
              :content="item.value"
              placement="top"
            >
              <span
                :class="`tag${currentCacheKey === item.value ? ' active' : ''}`"
                @click="() => handleChangeCacheKey(item)"
              >
                {{ item.label }}
              </span>
            </el-tooltip>
          </div>
          <div class="el-table el-table--enable-row-hover el-table--medium">
            <table cellspacing="0" style="width: 100%">
              <tbody>
                <tr>
                  <td><div class="cell">Redis版本</div></td>
                  <td>
                    <div class="cell" v-if="currentCache.info">
                      {{ currentCache.info.redis_version }}
                    </div>
                  </td>
                  <td><div class="cell">运行模式</div></td>
                  <td>
                    <div class="cell" v-if="currentCache.info">
                      {{ currentCache.info.redis_mode == 'standalone' ? '单机' : '集群' }}
                    </div>
                  </td>
                  <td><div class="cell">端口</div></td>
                  <td>
                    <div class="cell" v-if="currentCache.info">
                      {{ currentCache.info.tcp_port }}
                    </div>
                  </td>
                  <td><div class="cell">客户端数</div></td>
                  <td>
                    <div class="cell" v-if="currentCache.info">
                      {{ currentCache.info.connected_clients }}
                    </div>
                  </td>
                </tr>
                <tr>
                  <td><div class="cell">运行时间(天)</div></td>
                  <td>
                    <div class="cell" v-if="currentCache.info">
                      {{ currentCache.info.uptime_in_days }}
                    </div>
                  </td>
                  <td><div class="cell">使用内存</div></td>
                  <td>
                    <div class="cell" v-if="currentCache.info">
                      {{ currentCache.info.used_memory_human }}
                    </div>
                  </td>
                  <td><div class="cell">使用CPU</div></td>
                  <td>
                    <div class="cell" v-if="currentCache.info">
                      {{ parseFloat(currentCache.info.used_cpu_user_children).toFixed(2) }}
                    </div>
                  </td>
                  <td><div class="cell">内存配置</div></td>
                  <td>
                    <div class="cell" v-if="currentCache.info">
                      {{ currentCache.info.maxmemory_human }}
                    </div>
                  </td>
                </tr>
                <tr>
                  <td><div class="cell">AOF是否开启</div></td>
                  <td>
                    <div class="cell" v-if="currentCache.info">
                      {{ currentCache.info.aof_enabled == '0' ? '否' : '是' }}
                    </div>
                  </td>
                  <td><div class="cell">RDB是否成功</div></td>
                  <td>
                    <div class="cell" v-if="currentCache.info">
                      {{ currentCache.info.rdb_last_bgsave_status }}
                    </div>
                  </td>
                  <td><div class="cell">Key数量</div></td>
                  <td>
                    <div class="cell" v-if="currentCache.dbSize">{{ currentCache.dbSize }}</div>
                  </td>
                  <td><div class="cell">网络入口/出口</div></td>
                  <td>
                    <div class="cell" v-if="currentCache.info">
                      {{ currentCache.info.instantaneous_input_kbps }}kps/{{
                        currentCache.info.instantaneous_output_kbps
                      }}kps
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </el-card>
      </el-col>

      <el-col :span="12" class="card-box">
        <el-card>
          <div slot="header"><span>命令统计</span></div>
          <div class="el-table el-table--enable-row-hover el-table--medium">
            <div ref="commandstats" style="height: 420px" />
          </div>
        </el-card>
      </el-col>

      <el-col :span="12" class="card-box">
        <el-card>
          <div slot="header">
            <span>内存信息</span>
          </div>
          <div class="el-table el-table--enable-row-hover el-table--medium">
            <div ref="usedmemory" style="height: 420px" />
          </div>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import { getCache } from '@/api/monitor/cache';
import * as echarts from 'echarts';

export default {
  name: 'Server',
  data() {
    return {
      // 加载层信息
      loading: [],
      // 统计命令信息
      commandstats: null,
      // 使用内存
      usedmemory: null,
      // cache信息
      cache: {},
      // 集群模式下服务器节点
      keyList: [],
      // 当前展示的 cache 键值
      currentCacheKey: '',
      // 当前展示的 cache 信息
      currentCache: {},
    };
  },
  created() {
    this.getList();
    this.openLoading();
  },
  methods: {
    /** 切换查看内容 */
    handleChangeCacheKey(item) {
      const key = item.value;
      this.currentCacheKey = key;
      this.updateCurrentCache(key);
    },
    /** 更新缓存内容 */
    updateCurrentCache(key) {
      this.currentCache = {
        commandStats: this.cache.commandStatsCluster[key],
        dbSize: this.cache.dbSize,
        info: this.cache.infoCluster[key],
      };
      this.updateEchart();
    },
    /** 初始化 echart */
    initEchart() {
      console.log(echarts);
      this.commandstats = echarts.init(this.$refs.commandstats, 'macarons');
      this.usedmemory = echarts.init(this.$refs.usedmemory, 'macarons');
    },
    /** 更新 echart */
    updateEchart() {
      this.commandstats.setOption({
        tooltip: {
          trigger: 'item',
          formatter: '{a} <br/>{b} : {c} ({d}%)',
        },
        series: [
          {
            name: '命令',
            type: 'pie',
            roseType: 'radius',
            radius: [15, 95],
            center: ['50%', '38%'],
            data: this.currentCache.commandStats,
            animationEasing: 'cubicInOut',
            animationDuration: 1000,
          },
        ],
      });
      this.usedmemory.setOption({
        tooltip: {
          formatter: '{b} <br/>{a} : ' + this.currentCache.info.used_memory_human,
        },
        series: [
          {
            name: '峰值',
            type: 'gauge',
            min: 0,
            max: 1000,
            detail: {
              formatter: this.currentCache.info.used_memory_human,
            },
            data: [
              {
                value: parseFloat(this.currentCache.info.used_memory_human),
                name: '内存消耗',
              },
            ],
          },
        ],
      });
    },
    /** 查缓存询信息 */
    getList() {
      getCache().then(response => {
        this.cache = response.data;
        this.loading.close();
        this.initEchart();

        if (
          Object.prototype.hasOwnProperty.call(response.data, 'commandStatsCluster') &&
          Object.prototype.hasOwnProperty.call(response.data, 'infoCluster')
        ) {
          // 设置集群
          this.keyList = Object.keys(response.data.commandStatsCluster)
            .sort()
            .map((value, index) => {
              return { label: `服务器${index + 1}`, value };
            });
          const defaultKey = this.keyList[0].value;
          this.currentCacheKey = defaultKey;
          this.updateCurrentCache(defaultKey);
        } else {
          // 非集群模式
          this.currentCache = response.data;
          this.updateEchart();
        }
      });
    },
    // 打开加载层
    openLoading() {
      this.loading = this.$loading({
        lock: true,
        text: '拼命读取中',
        spinner: 'el-icon-loading',
        background: 'rgba(0, 0, 0, 0.7)',
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.tag {
  display: inline-block;
  padding: 2px 8px;
  border-radius: 2px;
  background-color: #d9d9d9;
  margin-left: 8px;
  user-select: none;
  cursor: pointer;

  &.active {
    background-color: #1890ff;
    color: aliceblue;
  }
}
</style>
