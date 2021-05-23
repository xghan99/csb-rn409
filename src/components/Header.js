import { useState } from "react";
import TaskManager from "./TaskManager";

function Header() {
  return (
    <header>
      <h1>Expense Tracking</h1>
      <div
        style={{
          display: "flex",
          flexFlow: "row nowrap",
          justifyContent: "center"
        }}
      >
        <OverviewBox />
      </div>
    </header>
  );
}

function OverviewBox() {
  const [name, setName] = useState("John Doe");

  return (
    <div className="HeaderBox">
      <h2>Overview</h2>
      <p>
        Welcome back,{" "}
        <strong
          role="button"
          onClick={() => {
            const newName = prompt("What is your name?", name);
            setName(newName);
          }}
        >
          {name || "<set a name>"}
        </strong>
        !
      </p>
      <p></p>
    </div>
  );
}

export default Header;
