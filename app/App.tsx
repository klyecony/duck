import { useNavigation } from "@/lib/routing";
import Home from "@/pages/Home";
import Einkaufen from "@/pages/Einkaufen";
import Rezepte from "@/pages/Rezepte";
import "@/globals.css";

function App() {
  const { currentPage } = useNavigation();
  switch (currentPage) {
    case "/einkaufen":
      return <Einkaufen />;
    case "/rezepte":
      return <Rezepte />;
    default:
      return <Home />;
  }
}

export default App;
