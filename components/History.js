import React, { useState, useEffect }  from 'react';
import ReactDOM from 'react-dom';

function History(props) {

	const [history,setHistory] = useState([]);

	useEffect(() => {

		let params = {};
		if (window.Auth.user) {
			params = { user_id: window.Auth.user.id }
		}

		axios.get('/yummi-pizza/public/api/orders', {
			params: params,
		  headers: {
		    'X-CSRFToken': `${window.Auth.token}`
		  }
	  })
	  .then(function (response) {
	  	console.log('history response');
	  	console.log(response);
	  	console.log(window.Auth);
	    setHistory([...response.data]);
	  })
	  .catch(function (error) {
	    console.log('[[error]]');
	    console.log(error);
	  })
	  .then(function () {

	  });

  }, []);

  return (
	  <div>{
	  	(!window.Auth.user) && (<h1>Please login</h1>)
	  }
	  {
	  	(!history || history.length < 1) && (<h1 style={{textAlign: 'center'}}>No order history!</h1>)
	  }
	  {
			(window.Auth.user) && (
				history.map((order, index) => {
					return (<React.Fragment key={index}>
						<h5>
							<div key={'title' + index} className="row mx-md-n5 mb-2">
					  		<div className="col-1 my-auto">
					  			Time:
					  		</div>
					  		<div className="col-9 my-auto">
					  			{new Date(new Date(order.updated_at) - (new Date()).getTimezoneOffset()*60*1000).toLocaleString()}
					  		</div>
					  		<div className="col-1 my-auto">
					  			Quantity
					  		</div>
					  		<div className="col-1 my-auto" style={{textAlign: 'right'}}>
					  			Price
					  		</div>
							</div>
						</h5>
						<hr/>
						{
							order.items.map((item, itemIndex) => {
								return (<div key={'item' + itemIndex} className="row mx-md-n5 mb-2">
						  		<div className="col-1 my-auto">
						  		</div>
						  		<div className="col-9 my-auto">
						  			{item.name}
						  		</div>
						  		<div className="col-1 my-auto" style={{textAlign: 'center'}}>
						  			{item.quantity}
						  		</div>
						  		<div className="col-1 my-auto" style={{textAlign: 'right'}}>
						  			{props.currencySymbol} {(Math.round(item.price * props.currencyExchangeRate) / 100).toFixed(2)}
						  		</div>
								</div>);
							})
						}
						<hr/>
						<div key={'itemDelieveryCosts' + index} className="row mx-md-n5 mb-2">
				  		<div className="col-1 my-auto">
				  		</div>
				  		<div className="col-9 my-auto">
				  			Delievery costs
				  		</div>
				  		<div className="col-1 my-auto">
				  		</div>
				  		<div className="col-1 my-auto" style={{textAlign: 'right'}}>
				  			{props.currencySymbol} {(Math.round(props.delieveryCosts * props.currencyExchangeRate) / 100).toFixed(2)}
				  		</div>
						</div>
						<hr/>
						<h4>
							<div key={'total' + index} className="row mx-md-n5 mb-2">
					  		<div className="col-1 my-auto">
					  		</div>
					  		<div className="col-9 my-auto">
					  			Total price:
					  		</div>
					  		<div className="col-2 my-auto" style={{textAlign: 'right'}}>
					  			{props.currencySymbol} {(Math.round(order.total_price * props.currencyExchangeRate) / 100).toFixed(2)}
					  		</div>
							</div>
						</h4>
						<br />
						<br />
						<br />
					</React.Fragment>);
				})
			)
	  }
	  </div>
	);

}

export default History;