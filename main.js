const def = {
  height: 7100, // 총 높이
  elements: { // 애니메이션이 적용될 요소들을 먼저 정리함. 
    sl1: { // ref 이름
      top: 500, // 시작점
      bottom: 1900, // 끝점
      topStyle: { // 해당 요소의 위쪽에서 시작하고자 할 때 초기화되는 스타일 
        opacity: 0,
        translateY: -60 // 기본 위치는 중앙이므로 중심에서 떨어진 거리를 뜻하게 됨.
        (기타 속성들)
      },
      bottomStyle: { // 해당 요소의 아래쪽에서 끝날 때 마무리되는 스타일
        opacity: 0,
        translateY: 60
      }
    },
    // 중략, 기타 다른 요소들
  },
  animations: {
    sl1: [ // 애니메이션을 적용할 요소. 애니메이션은 여러 개가 될 수 있기 때문에 배열로 처리함.
      {
        top: 500, // 이 애니메이션의 시작점
        bottom: 1900, // 이 애니메이션의 끝점
        easing: midSlow, // 가운데를 느려지게 하는 Easing Function
        styles: { // 적용할 스타일들
          translateY: { // 적용할 스타일
            topValue: 60, // 시작점일 때의 값
            bottomValue: -60 // 끝점일 때의 값
          }
        }
      },
      {
        top: 500, // 반복...
        bottom: 800,
        easing: ease,
        styles: {
          opacity: {
            topValue: 0,
            bottomValue: 1
          }
        }
      },
    ],
    // 중략, 애니메이션을 적용할 다른 요소들을 추가
  }
}


let enabled = new Map();
let disabled = new Map();


const applyStyle = (element, styleName, value, unit = "px") => {
  if (styleName === "translateY") {
    // eslint-disable-next-line no-param-reassign
    element.style.transform = `translateY(${value}${unit})`;
    return;
  }
  if (styleName === "translateX") {
    // eslint-disable-next-line no-param-reassign
    element.style.transform = `translateX(${value}${unit})`;
    return;
  }
  // eslint-disable-next-line no-param-reassign
  element.style[styleName] = value;
};

// .. 중략
export default = {
// .. 중략
  methods: {
    // .. 중략
    applyStyles(currentPos, refname, styles, r, unit = "px") {
      for (const style of Object.keys(styles)) {
        const { topValue, bottomValue } = styles[style];
        const calc = (bottomValue - topValue) * r + topValue;
        applyStyle(this.$refs[refname], style, calc, unit);
      }
    },
  },
};

// .. 중략
export default = {
// .. 중략
  methods: {
    // .. 중략
    applyAllAnimation(currentPos, refname) {
      const animations = def.animations[refname];
      if (!animations) return;
      for (const animation of animations) {
        const { top: a_top, bottom: a_bottom, easing, styles } = animation;
        const isIn = isAmong(currentPos, a_top, a_bottom);
        // 만약 애니메이션이 새롭게 들어갈 때 혹은 나갈때 enabled 설정
        if (isIn) {
          if (!animation.enabled) animation.enabled = true;
        } else if (!isIn && animation.enabled) {
          if (currentPos <= a_top) {
            this.applyStyles(currentPos, refname, styles, 0);
          } else if (currentPos >= a_bottom) {
            this.applyStyles(currentPos, refname, styles, 1);
          }
          // eslint-disable-next-line no-param-reassign
          animation.enabled = false;
        }

        // 애니메이션이 enabled 라면, 애니메이션 적용.
        if (animation.enabled) {
          const r = easing((currentPos - a_top) / (a_bottom - a_top));
          // eslint-disable-next-line no-param-reassign
          this.applyStyles(currentPos, refname, styles, r);
        }
      }
    },
  },
};
mounted() {
    this.init();
    // 이벤트 리스너 추가
    window.addEventListener("scroll", this.onScroll);
  },
  beforeDestroy() {
    // 이벤트 리스너 삭제
    window.removeEventListener("scroll", this.onScroll);
  },
  methods: {
    init() {
      this.initAnimation();
    },
    // 애니메이션 초기화
    initAnimation() {
      // Sticky Conainer 의 높이를 설정함.
      this.$refs["sticky-container"].style.height = `${def.height}px`;

      // disabled, enabled 를 비움.
      disabled.clear();
      enabled.clear();

      // 모든 요소를 disabled 에 넣음.
      for (const refname of Object.keys(def.elements)) {
        disabled.set(refname, def.elements[refname]);
      }

      // 각 애니메이션을 enabled == false 로 만듬.
      for (const refname of Object.keys(def.animations)) {
        for (const animation of def.animations[refname]) {
          animation.enabled = false;
        }
      }

      // 초기 스타일 적용
      disabled.forEach((obj, refname) => {
        Object.keys(obj.topStyle).forEach((styleName) => {
          const pushValue = obj.topStyle[styleName];
          this.$refs[refname].style[styleName] = pushValue;
        });
      });

      // 이미 요소의 범위 및 애니메이션의 범위에 있는 것들을 렌더링하기 위해
      // 임의로 스크롤 이벤트 핸들러를 한 번 실행시킴.
      this.onScroll();
    },
    // (중략...) 다른 메소드들
  },
  onScroll() {
      // 현재 스크롤 위치 파악
      const scrollTop = window.scrollY || window.pageYOffset;
      const currentPos = scrollTop + window.innerHeight / 2;

      // disabled 순회하며 활성화할 요소 찾기.
      disabled.forEach((obj, refname) => {
        // 만약 칸에 있다면 해당 요소 활성화
        if (
          isAmong(currentPos, obj.top, obj.bottom)
        ) {
          enabled.set(refname, obj);
          this.$refs[refname].classList.remove("disabled");
          this.$refs[refname].classList.add("enabled");
          disabled.delete(refname);
        }
      });

      // enabled 순회하면서 헤제할 요소를 체크
      enabled.forEach((obj, refname) => {
        const { top, bottom, topStyle, bottomStyle } = obj;
        // console.log(`${top}, ${bottom}, ${topStyle}, ${bottomStyle}`);
        // 범위 밖에 있다면
        if (!isAmong(currentPos, top, bottom)) {
          // 위로 나갔다면 시작하는 스타일 적용
          if (currentPos <= top) {
            Object.keys(topStyle).forEach((styleName) => {
              applyStyle(this.$refs[refname], styleName, topStyle[styleName]);
            });
          }
          // 아래로 나갔다면 끝나는 스타일적용
          else if (currentPos >= bottom) {
            Object.keys(bottomStyle).forEach((styleName) => {
              applyStyle(
                this.$refs[refname],
                styleName,
                bottomStyle[styleName]
              );
              // this.$refs[refname].style[styleName] = bottomStyle[styleName];
            });
          }

          // 리스트에서 삭제하고 disabled로 옮김.
          disabled.set(refname, obj);
          this.$refs[refname].classList.remove("enabled");
          this.$refs[refname].classList.add("disabled");
          enabled.delete(refname);
        }
        
        // enable 순회중, 범위 내부에 제대로 있다면 각 애니메이션 적용시키기.
        else {
          this.applyAllAnimation(currentPos, refname);
        }
      });
    }
