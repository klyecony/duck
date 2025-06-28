import { Bird, Butterfly, Cat, Cow, Dog, Fish, Rabbit, User } from "@phosphor-icons/react";

const USER_ICON_MAP = {
  bird: <Bird />,
  cat: <Cat />,
  dog: <Dog />,
  cow: <Cow />,
  fish: <Fish />,
  rabbit: <Rabbit />,
  butterfly: <Butterfly />,
};

const availableUserIcons = Object.keys(USER_ICON_MAP) as (keyof typeof USER_ICON_MAP)[];

const userIcon = (type: keyof typeof USER_ICON_MAP | undefined) => {
  if (!type) return <User />; // Default icon if type is undefined
  return USER_ICON_MAP[type] || <Cat />;
};

export { userIcon, availableUserIcons, USER_ICON_MAP };
