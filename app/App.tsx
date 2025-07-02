import { TreeEvergreenIcon } from "@phosphor-icons/react";
import { useRouter } from "@/components/Router";
import { ROUTES } from "@/config/routing";

const App = () => {
  const { route } = useRouter();
  return ROUTES[route] || <TreeEvergreenIcon />;
};

export default App;
