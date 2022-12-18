<template>
  <div class="calendar" v-if="month">
    <div class="cal-header">
      <h4>{{ month.yearText() }}-{{ month.monthText() }}</h4>
      <div class="ctrl">
        <button @click="renderPrevMonth">이전</button
        ><button @click="renderNextMonth">다음</button>
      </div>
    </div>
    <div class="cal-seven-days row">
      <div class="cell">일</div>
      <div class="cell">월</div>
      <div class="cell">화</div>
      <div class="cell">수</div>
      <div class="cell">목</div>
      <div class="cell">금</div>
      <div class="cell">토</div>
    </div>
    <div
      class="effect"
      ref="effectEl"
      :style="{
        width: effect.enabled ? effect.width + 'px' : '',
        height: effect.enabled ? effect.height + 'px' : '',
      }"
    >
      <transition :name="effect.name">
        <div class="cal-body" :key="month">
          <div v-for="week in month.weeks" :key="week.id" class="weekly row">
            <div
              v-for="day in week.days"
              class="cell"
              :class="{ other: day.month !== month.month }"
              :key="day.id"
              @click="showScheduleView(day)"
              @mouseover="setActive(day)"
            >
              <div class="date">{{ day.dateText() }}</div>
              <div class="content">
                <div v-for="job in filterjobs(day)" :key="job.seq" class="job">
                  {{ job.target.title }}
                </div>
              </div>
              <div v-if="activeDay === day" class="ctrl">
                <button>+</button>
              </div>
            </div>
          </div>
        </div>
      </transition>
    </div>
  </div>
</template>

<script>
import cal from "./index";
export default {
  data() {
    return {
      month: null,
      activeDay: null,
      jobs: [],
      effect: { enabled: false, width: null, height: null, name: "" },
    };
  },
  mounted() {
    const month = "2022-12";

    const jobs = [
      {
        seq: 10329,
        title: "결혼식",
        desc: "동우의 첫번째 결혼식",
        startAt: "2022-09-01T13:00:00",
        endAt: "2022-09-01T15:00:00",
        theme: "blue",
      },
      {
        seq: 12323,
        title: "결혼식",
        desc: "동우의 두번째 결혼식",
        startAt: "2022-10-08T13:00:00",
        endAt: "2022-10-08T15:00:00",
        theme: "blue",
      },
      {
        seq: 33992,
        title: "트와이스 컴백",
        desc: "트와이스 컴백 쇼",
        startAt: "2022-11-29T09:00:00",
        endAt: "2022-11-29T14:00:00",
        theme: "green",
      },
      {
        seq: 33992,
        title: "또 결혼식",
        desc: "동우의 세번째 결혼식",
        startAt: "2022-12-24T09:00:00",
        endAt: "2022-12-24T14:00:00",
        theme: "green",
      },
    ];
    this.jobs = cal.buildJobs(jobs);
    this.month = cal.buildCalendar(month);
    console.log(this.month);
    this.$nextTick().then(() => {
      const { offsetWidth, offsetHeight } = this.$refs.effectEl;
      console.log(offsetWidth, offsetHeight);
      this.effect.enabled = true;
      this.effect.width = offsetWidth;
      this.effect.height = offsetHeight;
    });
  },
  methods: {
    showScheduleView(day) {
      console.log(day);
    },
    renderPrevMonth() {
      const prevMonth = this.month.prevMonth();
      this.month = prevMonth;
      this.effect.name = "swap-prev";
    },
    renderNextMonth() {
      const nextMonth = this.month.nextMonth();
      this.month = nextMonth;
      this.effect.name = "swap-next";
    },
    filterjobs(day) {
      return this.jobs.filter((job) => job.isValid(day));
    },
    setActive(day) {
      this.activeDay = day;
    },
  },
};
</script>

<style lang="scss" scoped>
.calendar {
  height: 100%;
  display: flex;
  flex-direction: column;
  .cal-header {
    display: flex;
  }
  .cal-seven-days {
    display: flex;
  }
  .effect {
    position: relative;
    flex: 1 1 auto;
    height: 100%;
    display: flex;
    flex-direction: column;
    overflow-x: hidden;
    .cal-body {
      position: relative;
      flex: 1 1 auto;
      display: flex;
      flex-direction: column;
      &.swap-prev-enter-active,
      &.swap-prev-leave-active,
      &.swap-next-enter-active,
      &.swap-next-leave-active {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
      }
      .weekly {
        flex: 1 1 auto;
      }
      .row {
        .cell {
          border-right: 1px solid #ececec;
          border-bottom: 1px solid #ececec;
          &:first-child {
            border-left: 1px solid #ececec;
          }
        }
        &:first-child {
          .cell {
            border-top: 1px solid #ececec;
          }
        }
      }
    }
  }
  .row {
    display: flex;
    .cell {
      flex: 1 1 auto;
      font-size: 12px;
      position: relative;
      &.other {
        background-color: #fcfcfc;
        color: #aaa;
      }
      .date {
        position: absolute;
        top: 4px;
        left: 4px;
      }
      .content {
        position: absolute;
        top: 20px;
        left: 4px;
        right: 4px;
        bottom: 4px;
      }
      .ctrl {
        position: absolute;
        right: 4px;
        bottom: 4px;
      }
    }
  }
}

.swap {
  &-next {
    &-enter,
    &-enter-from {
      opacity: 0;
      transform: translateX(100px);
    }
    &-enter-active {
      transition: opacity 0.3s, transform 0.3s;
    }

    &-leave,
    &-leave-from {
    }
    &-leave-active {
      transition: opacity 0.1s, transform 0.1s;
    }
    &-leave-to {
      opacity: 0;
      transform: translateX(-50px);
    }
  }
  &-prev {
    &-enter,
    &-enter-from {
      opacity: 0;
      transform: translateX(-100px);
    }
    &-enter-active {
      transition: opacity 0.3s, transform 0.3s;
    }

    &-leave,
    &-leave-from {
      opacity: 1;
      transform: translateX(0px);
    }
    &-leave-active {
      transition: opacity 0.1s, transform 0.1s;
    }
    &-leave-to {
      opacity: 0;
      transform: translateX(50px);
    }
  }
}
</style>
