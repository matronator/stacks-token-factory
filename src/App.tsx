import './App.css';
import { CreateContractForm } from './components/CreateContractForm/CreateContractForm';
import { Header } from './components/Header';

function App() {
  return (
    <>
      <Header />
      <h1 className='display-5'><span className='text-transparent bg-gradient-to-tr from-yellow-400 to-orange-500 via-amber-400 bg-clip-text shadow-sm title-orange-text'>Stacks</span> <strong className='font-black text-white title-blue-text'>Token Factory</strong></h1>

      <div className='container max-w-xl'>
        <CreateContractForm />
      </div>
    </>
  );
}

export default App;
