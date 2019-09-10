<!--
 * @Description: 
 * @Author: 施永坚（yokins）
 * @Date: 2019-08-16 14:47:05
 * @LastEditors: 施永坚（yokins）
 * @LastEditTime: 2019-09-10 15:46:28
 * @Incantation: Buddha Bless Do Not Bugs
 -->
<template>
  <div class="page mistake">
    <van-nav-bar :border="false" :z-index="1000" title="错题本" left-arrow @click-left="onClickLeft" />

    <div class="select-category">
      选择知识点分类
      <span @click="show = !show">
        <!-- 全部（{{columns.length}}） -->
        {{ active_fitler.text + (active_fitler.key === 0 ? `（${columns.length - 1}）` : '') }}
        <span
          class="iconfont icon-arrow"
        ></span>
      </span>
    </div>

    <van-list class="list" v-model="load_loading" :finished="load_finished" finished-text="没有更多了" @load="onLoad">
      <div class="task-item" v-for="(item, index) in list" :key="index" @click="to_question(item)">
        <div class="line">{{ item.title }}</div>
        <div class="line">
          <span class="time">{{ item.created_at }}</span>
          <span class="category">知识点: {{ show_kwonledges(item.question) }}</span>
          <span class="check">查看解析</span>
        </div>
      </div>
    </van-list>

    <van-popup v-model="show" position="bottom" class="mistake-popup">
      <van-picker :columns="columns" @cancel="onCancel" @confirm="onConfirm" show-toolbar />
    </van-popup>
  </div>
</template>

<script>
import { Popup, Picker, List } from 'vant'
import { setTimeout } from 'timers'
import {mapState, mapActions} from 'vuex'
export default {
  components: {
    [Popup.name]: Popup,
    [Picker.name]: Picker,
    [List.name]: List
  },
  data() {
    return {
      active_fitler: { key: 0, text: '全部' },
      show: false,
      columns: [],
      list: [],
      filter_list: [],
      page: 1,
      load_loading: false,
      load_finished: false
    }
  },
  computed: {
    ...mapState(['currentMistakeSelect']),
  },
  created() {
    console.log(this.currentMistakeSelect)
    this.active_fitler = this.currentMistakeSelect
  },
  mounted() {
    this.initData()
    this.onLoad(true)
    
  },
  methods: {
    ...mapActions(['setCurrentMistakeSelect', 'cleanCurrentMistakeSelect']),
    /**
     * @description: 上拉刷新
     * @param {type}
     * @return:
     */
    onLoad(way) {
      const _this = this
      setTimeout(() => {
        let payload = { page: _this.page }
        if (_this.active_fitler.key !== 0) {
          payload.knowledge_id = _this.active_fitler.key
        }
        _this.$api.get_mistake(payload).then(res => {
          if (way || _this.page === 1) {
            _this.list = res.problem_questions
          } else {
            _this.list = _this.list.concat(res.problem_questions)
          }
          _this.load_loading = false
          if (res.problem_questions.length < 25) {
            this.load_finished = true
          } else {
            _this.page += 1
          }
        })
      }, 500)
    },
    /**
     * @description: 初始化选项数据
     * @param {type}
     * @return:
     */
    initData() {
      const _this = this
      this.$api.acknowledges().then(res => {
        _this.columns = res.knowledges.map(item => {
          return {
            key: item.id,
            text: item.content
          }
        })
        _this.columns.unshift({
          key: 0,
          text: '全部'
        })
      })
    },
    /**
     * @description: 显示知识点
     * @param {type}
     * @return:
     */
    show_kwonledges(question) {
      let str = ''
      question.knowledges.forEach((item, index) => {
        str += item.content
        if (index !== question.knowledges.length - 1) {
          str += '、'
        }
      })
      return str
    },
    onConfirm(value) {
      this.setCurrentMistakeSelect(value)
      this.active_fitler = value
      this.show = false
    },
    onCancel() {
      this.show = false
    },
    // 查看题目详情
    to_question(item) {
      this.$router.push({
        name: 'homework_question_show',
        params: { homework_id: item.homework_id, question_id: item.id },
        query: { type: 'back' }
      })
    },
    /**
     * @description: 返回
     * @param {type}
     * @return:
     */
    onClickLeft() {
      this.$router.go(-1)
      this.cleanCurrentMistakeSelect()
    }
  },

  watch: {
    active_fitler() {
      this.page = 1
      this.list = []
      this.onLoad()
    }
  }
}
</script>

<style lang="scss">
.mistake {
  .select-category {
    background: #fff;
    border-top: 1px solid #e1e1e1;
    display: flex;
    flex-flow: row nowrap;
    align-items: center;
    justify-content: space-between;
    padding: 10px 15px;

    color: #474e60;
    font-size: 13px;
  }

  .task-item {
    background: #fff;
    margin-top: 15px;
    padding: 15px;
    .line {
      color: #474e60;
      font-size: 13px;
      &:not(:last-child) {
        margin-bottom: 15px;
      }
      &:last-child {
        display: flex;
        flex-flow: row nowrap;
        align-items: center;
        justify-content: space-between;
      }
      span {
        color: #767789;
        font-size: 11px;
      }
    }
  }
}
</style>
