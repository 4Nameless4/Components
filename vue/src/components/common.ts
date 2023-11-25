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
      el.setAttribute("viewBox", `-${w / 2} -${h / 2} ${w} ${h}`);
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

export type t_zoompan = {
  scale: number;
  x: number;
  y: number;
};

// 获取给定Element的transform值（translate与scale）
export function getTransform(el: Element): t_zoompan {
  const transform = el.getAttribute("transform");
  if (!transform)
    return {
      scale: 1,
      x: 0,
      y: 0,
    };
  const translate = (transform.match(/translate\([^)]+\)/) || "")[0];
  const scale = (transform.match(/scale\([^)]+\)/) || "")[0];

  const t = [...translate.matchAll(/[-.\d]+/g)];
  const s = [...scale.matchAll(/[-.\d]+/g)];

  return {
    scale: Number(s[0]) || 1,
    x: Number(t[0]) || 0,
    y: Number(t[1]) || 0,
  };
}

// 根据屏幕坐标获取SVG中transform之前的坐标的位置信息
// clientPos: zoom 的屏幕坐标
export function getSVGPosition(
  clientPos: [number, number],
  svgEl: SVGSVGElement,
  transform: t_zoompan
) {
  const SVGRect = svgEl.getBoundingClientRect();
  const viewbox = [
    svgEl.viewBox.baseVal.x,
    svgEl.viewBox.baseVal.y,
    svgEl.viewBox.baseVal.width,
    svgEl.viewBox.baseVal.height,
  ];
  // zoom center 在屏幕坐标系下，需要缩放的中心点相对于svg左上角的偏移量
  const centerClientPos = [clientPos[0] - SVGRect.x, clientPos[1] - SVGRect.y];

  // svg的viewbox与实际的width、height的比例
  // 为了换算出 缩放中心点（屏幕坐标系）在 svg 未缩放平移时对应的(svg坐标系)坐标
  const rw = viewbox[2] / SVGRect.width;
  const rh = viewbox[3] / SVGRect.height;
  const svgAutoSizeRatio = Math.max(rw, rh);

  // 补偿 svg viewbox和svg 实际大小不一致时 svg的自适应造成的位移
  const autosizeOffsetPX = (SVGRect.width - SVGRect.height) / 2;
  const isWidth = rw === svgAutoSizeRatio;
  const autosizeOffset = [
    autosizeOffsetPX * svgAutoSizeRatio * Number(!isWidth),
    autosizeOffsetPX * svgAutoSizeRatio * Number(isWidth),
  ];

  // zoom 中心坐标（SVG坐标系，未transform时的坐标）
  const centerPos = [
    // 加号前算出的只是长度
    centerClientPos[0] * svgAutoSizeRatio + viewbox[0] - autosizeOffset[0],
    centerClientPos[1] * svgAutoSizeRatio + viewbox[1] - autosizeOffset[1],
  ];

  // 补偿 svg translate的值（要求transform时translate在scale前面）
  // transform时 translate(-30 120) scale(1.2) 是指 先平移 在缩放，缩放的值不包含之前平移的（因为已经平移过了）
  // zoom 中心坐标（SVG坐标系，transform后的坐标）
  const centerOriginPos = [
    (centerPos[0] - transform.x) / transform.scale,
    (centerPos[1] - transform.y) / transform.scale,
  ];

  return centerOriginPos as [number, number];
}

export function zoom(props: {
  scaleOffset: number;
  svg: SVGSVGElement;
  transformEL: Element;
  clientPos: [number, number]
  scaleRange?: [number, number];
}) {
  const { scaleOffset, transformEL, scaleRange = [0, Infinity], clientPos, svg } = props;

  const { scale: oldScale, x, y } = getTransform(transformEL);

  const originPosition = getSVGPosition(clientPos, svg, {
    scale: oldScale,
    x,
    y,
  });

  const newScale = Math.max(
    Math.min(scaleOffset + oldScale, scaleRange[1]),
    Math.max(scaleRange[0], 0)
  );
  const _scaleOffset = newScale - oldScale;
  // 需要把scale 放大的坐标在已有的位移情况下给补偿回来，所以 [现有平移位置 - 原位置的坐标 * 放大的偏移值]
  // 原位置的坐标 * 放大的偏移值 才能得到scale之后放大的量，因为 transform 中translate 在 scale前面，translate没有被scale
  const translateX = x - originPosition[0] * _scaleOffset;
  const translateY = y - originPosition[1] * _scaleOffset;

  return {
    scale: newScale,
    x: translateX,
    y: translateY,
  };
}
