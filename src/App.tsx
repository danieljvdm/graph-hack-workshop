import { Link, Outlet } from "react-router-dom";

function App() {
  return (
    <div className="App">
      <div className="nav">
        <Link to="/wallets">Wallet</Link>
        <Link to="/collections">Collections</Link>
      </div>
      <Outlet />
    </div>
  );
}

export default App;
