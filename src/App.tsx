import { useState } from 'react';
import './App.css';
import { CreateContractForm } from './components/CreateContractForm/CreateContractForm';
import { Logo, TopNav } from './components/Header';
import ls from 'localstorage-slim';

function App() {
  const [limitedGfx, setLimitedGfx] = useState<boolean>(ls.get('limitedGfx') ?? false);
  function triggerLimitedGfx() {
    ls.set('limitedGfx', !limitedGfx);
    setLimitedGfx(!limitedGfx);
  }

  return (
    <div className={`App${limitedGfx ? ' limited-gfx' : ''}`}>
      <TopNav onLimitedGfx={triggerLimitedGfx} limitedGfx={limitedGfx} />
      <Logo />

      <div className='container max-w-xl'>
        <CreateContractForm />
      </div>
    </div>
  );
}

export default App;
