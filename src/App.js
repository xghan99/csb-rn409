import Header from "./components/Header";
import TaskManager from "./components/TaskManager";

import "./styles.css";

export default function App() {
  return (
    <div className="App">
      <Header />
      <main>
        <TaskManager />
      </main>
    </div>
  );
}
