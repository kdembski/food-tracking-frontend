import { shallowMount } from "@vue/test-utils";
import CButton from "@/components/controls/buttons/button/index.vue";

describe("Button Component", () => {
  let wrapper: any;

  beforeEach(async () => {
    wrapper = shallowMount(CButton, { global: global.settings });
  });

  it("Should add variant class based on varaint prop provided", async () => {
    expect(wrapper.classes()).toContain("button--contained");

    await wrapper.setProps({
      variant: "text",
    });
    expect(wrapper.classes()).toContain("button--text");
  });

  it("Should add color class based on color prop provided", async () => {
    expect(wrapper.classes()).toContain("button--primary");

    await wrapper.setProps({
      color: "secondary",
    });
    expect(wrapper.classes()).toContain("button--secondary");
  });

  it("Should add size class based on size prop provided", async () => {
    await wrapper.setProps({
      label: "test",
    });
    expect(wrapper.classes()).toContain("button--small");

    await wrapper.setProps({
      size: "small",
    });
    expect(wrapper.classes()).toContain("button--small");

    await wrapper.setProps({
      size: "large",
    });
    expect(wrapper.classes()).toContain("button--medium");

    window.innerWidth = 1025;
    wrapper = shallowMount(CButton, {
      props: { label: "test" },
      global: global.settings,
    });

    expect(wrapper.classes()).toContain("button--medium");

    await wrapper.setProps({
      size: "small",
    });
    expect(wrapper.classes()).toContain("button--small");

    await wrapper.setProps({
      size: "large",
    });
    expect(wrapper.classes()).toContain("button--large");
  });

  it("Should add disabled class if isDisabled is true", async () => {
    await wrapper.setProps({
      isDisabled: true,
    });
    expect(wrapper.classes()).toContain("button--disabled");
  });

  it("Should add disabled and loading class if isLoading is true", async () => {
    await wrapper.setProps({
      isLoading: true,
    });
    expect(wrapper.classes()).toContain("button--disabled");
    expect(wrapper.classes()).toContain("button--loading");
  });

  it("Should add full width class if fullWidth is true", async () => {
    await wrapper.setProps({
      fullWidth: true,
    });
    expect(wrapper.classes()).toContain("button--full-width");
  });

  it("Should add only icon class if label is not provided", async () => {
    await wrapper.setProps({
      label: "",
    });
    expect(wrapper.classes()).toContain("button--only-icon");
  });

  it("Should set loader size based on size prop", async () => {
    window.innerWidth = 1025;
    wrapper = shallowMount(CButton, {
      props: {
        isLoading: true,
      },
      global: global.settings,
    });

    const loaderStub = wrapper.findComponent("c-loader-stub");
    expect(loaderStub.props().circleWidth).toEqual(20);

    await wrapper.setProps({
      label: "test",
    });
    expect(loaderStub.props().circleWidth).toEqual(24);

    await wrapper.setProps({
      size: "small",
    });
    expect(loaderStub.props().circleWidth).toEqual(20);

    await wrapper.setProps({
      size: "large",
    });
    expect(loaderStub.props().circleWidth).toEqual(28);
  });
});
