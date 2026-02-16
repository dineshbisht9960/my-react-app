import { useState } from "react";
import Counter1 from "./Counter1";
import Counter2 from "./Counter2";

export default function CounterApp() {
  const [count1, setCount1] = useState(0);
  const [count2, setCount2] = useState(0);

  return (
    <div className="main-container">
      
        <Counter1
          value={count1}
          onClick={() => setCount1(count1 + 1)}
        />

      <Counter2
        value={count2}
        onClick={() => setCount2(count2 + 1)}
      />
    </div>
  );
}
