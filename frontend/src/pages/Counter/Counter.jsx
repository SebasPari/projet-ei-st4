import { useState } from 'react';
import './Counter.css';

function Counter() {
  const [counter, setCounter] = useState(0);

  return (
    <div className="Counter-container">
      <section className="Counter-panel">
        <p className="Counter-label">Exemple React</p>
        <h1>Compteur</h1>
        <div className="Counter-value">{counter}</div>
        <button className="Counter-button" onClick={() => setCounter(counter + 1)}>
          Incrementer
        </button>
      </section>
    </div>
  );
}

export default Counter;
