import React, { useState, useEffect }  from 'react';
import ReactDOM from 'react-dom';
import { Route, BrowserRouter as Router, Switch, Link } from 'react-router-dom';

import Cart from './Cart';
import Menu from './Menu';
import History from './History';

function Main() {

	let active;

	if (window.location.href.includes('cart')) {
		active = 'cart';
	}
	else {
		active = 'home';
	}

	const [auth, setAuth] = useState(null);
	const [currency, setCurrency] = useState('euro');
	const [currencyExchangeRate, setCurrencyExchangeRate] = useState(1);
	const [euroToDollar, setEuroToDollar] = useState(1.14);
	const [currencySymbol, setCurrencySymbol] = useState('€');
	const [delieveryCosts, setDelieveryCosts] = useState(200);

	const handleCurrencyChange = (e) => {
		setCurrency(e.target.value);

		if (e.target.value === 'euro') {
			setCurrencyExchangeRate(1);
			setCurrencySymbol('€');
		}
		else {
			setCurrencyExchangeRate(euroToDollar);
			setCurrencySymbol('$');
		}
	};

	useEffect(() => {
		if (window.Auth) {
    	setAuth(window.Auth);
		}

		axios.get('http://api.exchangeratesapi.io/latest')
	  .then(function (response) {
	    console.log('[[exchangeratesapi response]]');
	    console.log(response);

			setEuroToDollar(response.rated.USD);
	  })
	  .catch(function (error) {
	    console.log('[[error]]');
	    console.log(error);

	  })
	  .then(function () {

	  });

  }, []);

	function logout(e) {
    e.preventDefault();

		axios.post('/yummi-pizza/public/logout', {
	    _token: window.Auth.token
	  })
	  .then(function (response) {
	    console.log('[[response]]');
	    console.log(response);

	    setAuth(null);
	    window.location.reload();
	  })
	  .catch(function (error) {
	    console.log('[[error]]');
	    console.log(error);
	  })
	  .then(function () {

	  });
  }

  return (
  	<div className="container">
			<Router>
				<nav className="navbar navbar-expand-lg navbar-light bg-light">
				  <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
				    <span className="navbar-toggler-icon"></span>
				  </button>
				  <div className="collapse navbar-collapse" id="navbarSupportedContent">
				    <ul className="navbar-nav mr-auto">
				      <Link className="nav-link" to="/yummi-pizza/public/">Home</Link>
				      {!(auth && auth.user) && (
				      <li className="nav-item">
				        <a className="nav-link" href="/yummi-pizza/public/login">Login/Register</a>
				      </li>
				      )}
				      <Link className="nav-link" to="/yummi-pizza/public/cart">Shopping Cart</Link>
            </ul>
            <ul className="navbar-nav">
				      <select onChange={handleCurrencyChange}>
				      	<option value="euro">
				      		Euro
				      	</option>
				      	<option value="dolar">
				      		Dollar
				      	</option>
				      </select>
            </ul>
            <ul className="navbar-nav">
				      {auth && auth.user && (
		      			<li className="nav-item dropdown">
					        <a className="nav-link dropdown-toggle"
					        	href="#" id="navbarDropdown" role="button" data-toggle="dropdown" aria-haspopup="true"
					        	aria-expanded="false"
					        >
					          {auth.user.name}
					        </a>
		        			<div className="dropdown-menu" aria-labelledby="navbarDropdown">
					          <Link className="dropdown-item" to="/yummi-pizza/public/history">View Order History</Link>
          					<div className="dropdown-divider"></div>
					          <a className="dropdown-item" href="logout" onClick={logout}>Logout</a>
					        </div>
					      </li>
				      )}
				    </ul>
{/*				    <ul className="navbar-nav mr-auto">
				      <Link className="nav-link" to="/">Home</Link>
				      {!(auth && auth.user) && (
				      <li className="nav-item">
				        <a className="nav-link" href="/login">Login</a>
				      </li>
				      )}
				      <Link className="nav-link" to="/cart">Shopping Cart</Link>
				      {auth && auth.user && (
		      			<li className="nav-item dropdown">
					        <a className="nav-link dropdown-toggle"
					        	href="#" id="navbarDropdown" role="button" data-toggle="dropdown" aria-haspopup="true"
					        	aria-expanded="false"
					        >
					          {auth.user.name}
					        </a>
		        			<div className="dropdown-menu" aria-labelledby="navbarDropdown">
					          <a className="dropdown-item" href="logout" onClick={logout}>Logout</a>
					        </div>
					      </li>
				      )}
				    </ul>*/}
				  </div>
				</nav>
				<React.Fragment>
					<main>
						<Switch>
				      <Route path="/yummi-pizza/public/"
				      	component={props =>
				      		<Menu
				      			currencyExchangeRate={currencyExchangeRate}
				      			currencySymbol={currencySymbol}
				      			delieveryCosts={delieveryCosts}
				      		/>}
				      exact />
				      <Route path="/yummi-pizza/public/cart"
				      	component={props =>
				      		<Cart
				      			currencyExchangeRate={currencyExchangeRate}
				      			currencySymbol={currencySymbol}
				      			delieveryCosts={delieveryCosts}
				      		/>}
				      />
				      <Route path="/yummi-pizza/public/history"
				      	component={props =>
				      		<History
				      			currencyExchangeRate={currencyExchangeRate}
				      			currencySymbol={currencySymbol}
				      			delieveryCosts={delieveryCosts}
				      		/>}
				      />
				    </Switch>
	        </main>
        </React.Fragment>
      </Router>
  	</div>
  );
}

export default Main;

if (document.getElementById('main')) {
  ReactDOM.render(<Main />, document.getElementById('main'));
}