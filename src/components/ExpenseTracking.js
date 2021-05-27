import TopBar from "./subcomponents/TopBar";
import Header from "./subcomponents/Header";
import TaskManager from "./subcomponents/TaskManager";

function ExpenseTracking() {
  return (
    <div className="App">
      <TopBar />
      <main>
        <TaskManager />
      </main>
    </div>
  );
}

export default ExpenseTracking;
