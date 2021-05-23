import TopBar from "./components/TopBar";
import Header from "./components/Header";
import TaskManager from "./components/TaskManager";

import "./styles.css";

export default function App() {
  return (
    <div className="App">
      <TopBar />
      <Header />
      <main>
        <TaskManager />
      </main>
    </div>
  );
}
