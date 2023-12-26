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
