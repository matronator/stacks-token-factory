import './App.css';
import { CreateContractForm } from './components/CreateContractForm/CreateContractForm';
import { Logo, TopNav } from './components/Header';

function App() {
  return (
    <>
      <TopNav />
      <Logo />

      <div className='container max-w-xl'>
        <CreateContractForm />
      </div>
    </>
  );
}

export default App;
