import './App.css';
import { Button } from './components/Button';
import ContractCallVote from './components/ContractCallVote';
import { Header } from './components/Header';

function App() {
  return (
    <>
      <Header />
      <h1>Stacks Token Factory</h1>

      {/* ContractCallVote file: `./src/components/ContractCallVote.js` */}
      <ContractCallVote />

      <div className='flex items-center justify-around py-10 mx-auto text-center' style={{maxWidth: '480px'}}>
        <Button as="a" href="#">default</Button>
        <Button as="a" href="#" variant='primary'>primary</Button>
        <Button as="a" href="#" variant='secondary'>secondary</Button>
      </div>

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
