import { Link, Outlet } from 'react-router-dom';

function App() {
  return (
    <div className="App">
      <div style={{ flexDirection: 'column', display: 'flex' }}>
        <Link to="/wallets">Wallet</Link>
        <Link  to="/collections">Collections</Link>
      </div>
      <Outlet />
    </div>
  );
}

export default App;
