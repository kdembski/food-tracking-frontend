import { mount } from "@vue/test-utils";
import PlainLayout from "@/layouts/plain/index.vue";

describe("Plain Layout Component", () => {
  let wrapper: any;

  beforeEach(async () => {
    wrapper = mount(PlainLayout, { global: global.settings });
  });

  it("Should render component", async () => {
    expect(wrapper.exists()).toBe(true);
  });
});
