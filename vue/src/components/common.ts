import { onMounted, ref } from "vue";

export function autoSize() {
  const elementRef = ref<SVGSVGElement | null>(null);
  const widthRef = ref<number>(0);
  const heightRef = ref<number>(0);
  onMounted(() => {
    const el = elementRef.value as SVGElement;
    const ob = new ResizeObserver(() => {
      const w = el.clientWidth;
      const h = el.clientHeight;
      widthRef.value = w;
      heightRef.value = h;
      el.setAttribute("viewBox", `0 0 1000 1000`);
      // el.setAttribute("viewBox", `-${w / 2} -${h / 2} ${w} ${h}`);
    });
    ob.observe(el);
  });
  return {
    elementRef,
    widthRef,
    heightRef,
  };
}

export function randomColor(
  colors: string[] = [
    "#03A9F4",
    "#757575",
    "#ff9a9e",
    "#fbc2eb",
    "#f6d365",
    "#d4fc79",
    "#30cfd0",
    "#a8edea",
    "#fed6e3",
    "#96fbc4",
    "#d9ded8",
    "#BC9F77",
    "#4F726C",
    "#E03C8A",
  ]
) {
  const colorMap = new Map<string | number, string>();
  let count = 0;
  return function (key: string | number) {
    if (colorMap.has(key)) {
      return colorMap.get(key);
    } else {
      const c = colors[count];
      colorMap.set(key, c);
      count++;
      if (colors.length === count) {
        count = 0;
      }
      return c;
    }
  };
}
// 获得不重复的ID
// 如果id已存在将加入指定参数和计数
export function getID() {
  const idGroup = new Set();

  return function (
    preid: string,
    props: {
      suffix?: string;
      warn?: (preid: string, nowid: string) => string;
    } = {}
  ) {
    const { suffix, warn } = props;
    let id = preid;
    let count = 0;
    while (idGroup.has(id)) {
      count++;
      id = preid + count + (suffix || "");
    }
    idGroup.add(id);
    if (id !== preid && warn) {
      console.warn(warn(preid, id));
    }
    return id;
  };
}
