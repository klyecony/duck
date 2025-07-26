import { MagicWandIcon, SignOutIcon } from "@phosphor-icons/react";
import { Divider } from "@heroui/react";
import { ProfileForm } from "@/components/user/ProfileForm";
import { type USER_ICON_MAP, userIcon } from "@/components/ui/config/icon";
import { useModalStack } from "@/components/ui/StackedModal";
import { db } from "@/db";
import { Button, Card } from "@heroui/react";
import { PlanetIcon } from "@phosphor-icons/react";
import { cn } from "@heroui/theme";
import { useRouter } from "@/components/Router";
import { BlueprintIcon, BowlFoodIcon, CraneTowerIcon, DatabaseIcon } from "@phosphor-icons/react";
import type { Route } from "@/config/routing";
import Cta from "./shopping/cta/Cta";

const Navigation = () => {
  const { route, setRoute } = useRouter();
  const { add } = useModalStack();
  const { user } = db.useAuth();

  const { data, isLoading } = db.useQuery({
    profiles: {
      $: {
        where: { id: user?.id || "" },
      },
    },
  });

  const NAVIGATION_ELEMENTS = {
    "/einkaufen": {
      icon: <BowlFoodIcon />,
      isDisabled: false,
    },
    "/rezepte": {
      icon: <DatabaseIcon />,
      isDisabled: false,
    },
    "/comingSoon": {
      icon: <BlueprintIcon />,
      isDisabled: true,
    },
    "/test": {
      icon: <CraneTowerIcon />,
      isDisabled: false,
    },
  };

  const profile = data?.profiles[0];

  return (
    <>
      {/* <Image
        src="/logo.svg"
        alt="Duck Logo"
        width={1024}
        height={1024}
        className={cn(
          "-translate-y-[110px] -rotate-[36deg] pointer-events-none absolute top-0 right-0 h-72 w-72 scale-x-[-1] overflow-hidden opacity-20 transition delay-1000 duration-300 ease-in-out",
          user ? "translate-x-[180px] " : "translate-x-[400px]",
        )}
      /> */}
      <div
        className={cn(
          "absolute h-full p-1.5 transition duration-300 ease-in-out",
          route !== "/" || user ? "opacity-100" : "pointer-events-none opacity-0",
        )}
      >
        <Card
          shadow="sm"
          className={cn(
            "absolute top-1.5 left-1.5 z-50 w-[200%] flex-row justify-end gap-1 p-1",
            route === "/" ? "-translate-x-[calc(100%+45px)]" : "-translate-x-[calc(100%-48px)]",
          )}
        >
          <Divider orientation="vertical" className="h-10" />
          <Button
            isDisabled={isLoading}
            isIconOnly
            radius="md"
            variant="flat"
            color="secondary"
            onPress={() => setRoute("/")}
          >
            <PlanetIcon />
          </Button>
        </Card>
        <Card
          shadow="sm"
          className={cn(
            "z-50 flex h-full w-full flex-col items-center justify-between gap-1 p-1 pt-[50px] transition duration-300",
            route === "/" ? "" : "-translate-x-[calc(60px)]",
          )}
        >
          <div className="flex grow flex-col items-center justify-center gap-1">
            <div className=" flex h-[172px] flex-col items-center justify-end gap-1">
              <Button
                isIconOnly
                radius="md"
                variant="light"
                color="secondary"
                isLoading={isLoading}
                onPress={() => add(<ProfileForm />)}
              >
                {userIcon(profile?.icon as keyof typeof USER_ICON_MAP)}
              </Button>
            </div>
            <Divider orientation="horizontal" />
            <div className="flex flex-col items-center justify-center gap-1">
              {Object.entries(NAVIGATION_ELEMENTS).map(([id, element]) => (
                <Button
                  key={id}
                  radius="md"
                  variant="light"
                  color="primary"
                  isIconOnly
                  isDisabled={element.isDisabled}
                  onPress={() => setRoute(id as Route)}
                >
                  {element.icon}
                </Button>
              ))}
            </div>
          </div>
          <Divider
            orientation="horizontal"
            className={cn(
              "w-full transition duration-300",
              route === "/" ? "opacity-0" : "opacity-100",
            )}
          />
          <Button
            isDisabled={isLoading}
            isIconOnly
            radius="md"
            variant="light"
            color="danger"
            onPress={() => db.auth.signOut()}
          >
            <SignOutIcon />
          </Button>
        </Card>
        <Card
          shadow="sm"
          className={cn(
            "absolute bottom-1.5 left-1.5 z-50 w-[200%] flex-row justify-end gap-1 p-1",
            route === "/"
              ? "-translate-x-[calc(100%+45px)]"
              : "-translate-x-[calc(100%-48px)] delay-75",
          )}
        >
          <Divider orientation="vertical" className="h-10" />
          <Button color="primary" radius="md" isIconOnly onPress={() => add(<Cta />)}>
            <MagicWandIcon />
          </Button>
        </Card>
      </div>
    </>
  );
};

export { Navigation };
