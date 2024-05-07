import './App.css';
import ContractCallVote from './components/ContractCallVote';
import { CreateContractForm } from './components/CreateContractForm/CreateContractForm';
import { Header } from './components/Header';

function App() {
  return (
    <>
      <Header />
      <h1>Stacks Token Factory</h1>

      {/* ContractCallVote file: `./src/components/ContractCallVote.js` */}
      <ContractCallVote />

      <div className='container max-w-xl'>
        <CreateContractForm />
      </div>
    </>
  );
}

export default App;
