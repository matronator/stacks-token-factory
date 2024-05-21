import './App.css';
import ContractCallVote from './components/ContractCallVote';
import { CreateContractForm } from './components/CreateContractForm/CreateContractForm';
import { Header } from './components/Header';

function App() {
  return (
    <>
      <Header />
      <h1 className='text-orange-500 shadow-sm display-5 stacks-text-shadow'>Stacks <strong className='font-black text-transparent bg-gradient-to-tr via-indigo-500 to-purple-500 from-purple-700 bg-clip-text no-text-shadow'>Token Factory</strong></h1>

      {/* ContractCallVote file: `./src/components/ContractCallVote.js` */}
      <ContractCallVote />

      <div className='container max-w-xl'>
        <CreateContractForm />
      </div>
    </>
  );
}

export default App;
