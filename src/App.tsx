import './App.css';
import ContractCallVote from './components/ContractCallVote';
import { Header } from './components/Header';

function App() {
  return (
    <>
      <Header />
      <h1>Stacks Token Factory</h1>

      {/* ContractCallVote file: `./src/components/ContractCallVote.js` */}
      <ContractCallVote />

      <div>
        <a
          className="App-link-stacks"
          href="https://docs.hiro.so/stacks.js/overview"
          rel="noopener noreferrer"
          target="_blank"
        >
          Learn to build on Stacks
        </a>
      </div>
      <div>
        <a
          className="App-link-stacks"
          href="https://github.com/hirosystems/stacks.js"
          rel="noopener noreferrer"
          target="_blank"
        >
          Visit the official Stacks.js repo
        </a>
      </div>

      <div className="card">
        <p>
          Edit <code>src/App.jsx</code> and save to test HMR
        </p>
      </div>
      <p className="read-the-docs">
        Click on the Vite and React logos to learn more
      </p>
    </>
  );
}

export default App;
