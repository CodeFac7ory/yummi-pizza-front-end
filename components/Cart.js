import React, { useState, useEffect }  from 'react';
import ReactDOM from 'react-dom';

import Contact from './Contact';

function Cart(props) {

	console.log('[[Cart]]');

	const [order, setOrder] = useState(null);
	const [status, setStatus] = useState('Loading...');

	useEffect(() => {

		let params = {};
		if (window.Auth.user) {
			params = { user_id: window.Auth.user.id }
		}

		axios.get('/yummi-pizza/public/api/cart', {
			params: params,
		  headers: {
		    'X-CSRFToken': `${window.Auth.token}`
		  }
	  })
	  .then(function (response) {
	  	console.log(response);
	    setOrder(response.data[0]);

	    if (!response.data[0]
	    	|| response.data.length === 0
	    	|| !response.data.items
	    	|| response.data.items.length === 0
	    ) {
	    	setStatus('The shopping cart is empty.');
	    }
	  })
	  .catch(function (error) {
	    console.log('[[error]]');
	    console.log(error);
	  })
	  .then(function () {

	  });

  }, []);

	const removeFromCart = (item, index) => {
		const temp = { ...order };

		axios.delete('/yummi-pizza/public/api/order_items/'+item.id, {})
		  .then(function (response) {
		    console.log('[[response]]');
		    console.log(response);

				setOrder(response.data[0]);
		  })
		  .catch(function (error) {
		    console.log('[[error]]');
		    console.log(error);
		  })
		  .then(function () {

		  });
	};

	const resetCart = (status) => {
		setStatus(status);
		setOrder(null);
	};

	const handleOrderClick = () => {
		if (window.Auth.user) {

		axios.patch('/yummi-pizza/public/api/orders/'+order.id+'/complete', {})
		  .then(function (response) {
		    console.log('[[response]]');
		    console.log(response);

				setOrder(null);
				setStatus(`The order is complete. It is going to be delivered to address:\n
					${window.Auth.user.street},\n
					${window.Auth.user.postal_code} ${window.Auth.user.city},\n
					${window.Auth.user.country}`);
		  })
		  .catch(function (error) {
		    console.log('[[error]]');
		    console.log(error);
		    setStatus(error);
		  })
		  .then(function () {

		  });
		}
		else {
			setStatus('unauthorized');
		}
	};

  return (
	  <div>
		  {
		  	(order && order.items && order.items.length > 0 && order.status === 'pending' && status !== 'unauthorized') && (
			  	<React.Fragment>
				  	{ order.items.map((value, index) => {
					  	return (<div key={index} className="row mx-md-n5 mb-2">
					  		<div className="col-3 my-auto">
					  			<img src={value.picture} style={{
						  			display: 'block',
									  maxWidth: 230,
									  maxHeight: 150,
						  			width: '100%',
									  height: 'auto',
				  				}}/>
				  			</div>
					  		<div className="col-5 my-auto">
					  			{value.name}
					  		</div>
					  		<div className="col-1 my-auto">
					  			{value.quantity}
					  		</div>
					  		<div className="col-1 my-auto">
					  			{props.currencySymbol} {(Math.round(value.price * props.currencyExchangeRate) / 100).toFixed(2)}
					  		</div>
					  		<div className="col-2 my-auto">
					  			<button type="button" className="btn btn-danger float-right btn-sm"
					  				onClick={() => removeFromCart(value, index)}
					  			>
					  				Remove from cart
					  			</button>
					  		</div>
					  	</div>)
					  })
				  }
				  <br />
				  <div  className="row mx-md-n5 mb-2">
				  	<div className="col-3 my-auto">
				  	</div>
				  	<div className="col-5 my-auto">
				  		<h5>Delievery costs:</h5>
				  	</div>
			  		<div className="col-1 my-auto">
			  		</div>
			  		<div className="col-1 my-auto">
			  			<h5>{props.currencySymbol} {(Math.round(props.delieveryCosts * props.currencyExchangeRate) / 100).toFixed(2)}</h5>
			  		</div>
				  </div>
				  <br />
				  <div  className="row mx-md-n5 mb-2">
				  	<div className="col-3 my-auto">
				  	</div>
				  	<div className="col-5 my-auto">
				  		<h1>Total:</h1>
				  	</div>
			  		<div className="col-1 my-auto">
			  		</div>
			  		<div className="col-1 my-auto">
			  			<h5>{props.currencySymbol} {(Math.round(order.total_price * props.currencyExchangeRate) / 100).toFixed(2)}</h5>
			  		</div>
			  		<div className="col-2">
			  			<button type="button" className="btn btn-success float-right btn-lg"
			  				onClick={handleOrderClick}
			  			>
			  				<i className="fa fa-shopping-cart"></i> Order
			  			</button>
			  		</div>
			  	</div>
			  </React.Fragment>)
			}
			{
		    !(order && order.items && order.items.length > 0)
		    	&& (<div style={{textAlign: 'center'}}><br /><h1>{status.split('\n').map(function(item, key) {
					  return (
					    <span key={key}>
					      {item}
					      <br/>
					    </span>
					  )
					})}</h1></div>)
			}
			{
				status === 'unauthorized' && (<Contact order={order} resetCart={resetCart}></Contact>)
			}
	  </div>
  );
}

export default Cart;