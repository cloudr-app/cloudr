import { useStore } from "@/store/store"
import { SrcSet } from "@/utils"
import { defineComponent, h, PropType } from "vue"

export default defineComponent({
  name: "cloudr-image",
  props: {
    src: {
      type: Object as PropType<SrcSet>,
      required: true,
    },
  },
  setup(props) {
    const { state } = useStore()

    return () =>
      h("img", {
        ...props,
        draggable: false,
        loading: state.preferences.network.lazyLoadImages ? "lazy" : "eager",
        decoding: "async",
        src: props.src.src,
        srcset: props.src.srcset,
        sizes: props.src.sizes,
      })
  },
})
