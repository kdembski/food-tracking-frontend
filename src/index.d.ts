declare module "*.vue" {
  import type { DefineComponent } from "vue";
  const component: DefineComponent<{}, {}, any>;
  export default component;
}

declare module "font-awesome";

declare interface String {
  simplify(): string;
}

declare var global: any;
