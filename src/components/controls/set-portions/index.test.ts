import { mount, DOMWrapper } from "@vue/test-utils";
import CSetPortions from "./index.vue";

describe("Set Portions Component", () => {
  let wrapper: any = null;
  let minusButton: DOMWrapper<HTMLButtonElement>;
  let plusButton: DOMWrapper<HTMLButtonElement>;

  beforeEach(async () => {
    wrapper = mount(CSetPortions, {
      props: {
        modelValue: 0,
      },
      global: global.settings,
    });

    minusButton = wrapper.findAll("button")[0];
    plusButton = wrapper.findAll("button")[1];
  });

  it("Should emit increased portions value on plus button click", async () => {
    await plusButton.trigger("click");
    expect(wrapper.emitted()["update:modelValue"][0][0]).toEqual(1);
  });

  it("Should emit decreased portions value on minus button click", async () => {
    await minusButton.trigger("click");
    expect(wrapper.emitted()["update:modelValue"][0][0]).toEqual(0);
  });
});