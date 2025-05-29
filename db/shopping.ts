import { _base } from "./__base";

export const cart = {
  ..._base,
};

export const cart_links = {
  cartCreator: {
    forward: { on: "cart", has: "one", label: "createdBy" },
    reverse: { on: "$users", has: "many", label: "carts" },
  },
  cartSCD: {
    forward: { on: "cart", has: "many", label: "scd" },
    reverse: { on: "cart", has: "one", label: "origin" },
  },
} as any;
