import logo from './logo.svg';
import './App.css';
import React from 'react';
import web3 from './web3';
//eslint-disable-next-line
//import ecommerce from './ecommerce';

class App extends React.Component {
  render() {
    console.log(web3.version);
    web3.eth.getAccounts().then((accounts) => {
      console.log(accounts[0]);
    });

    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <p>
            Edit <code>src/App.js</code> and save to reload.
          </p>
          <a
            className="App-link"
            href="https://reactjs.org"
            target="_blank"
            rel="noopener noreferrer"
          >
            Learn React
          </a>
        </header>
      </div>

    );
  }
}

export default App;
