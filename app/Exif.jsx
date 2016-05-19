import React from 'react';
import ReactDOM from 'react-dom';
// import ExifInfo from './ExifInfo.jsx';
// import BinaryView from './BinaryView.jsx';

var ExifPage = React.createClass({
  getInitialState: function() {
  },
  render: function() {
    return(
      <div>
        <div>
          {/* <Image source={require('./images/geotag.jpg')} />*/}
          <button className="uploadPicture">Upload Picture</button>
        </div>
        {/*
        <div>
          <ExifInfo bytes={this.state.bytes} />
        </div>
        <div>
          <BinaryView bytes={this.state.bytes}/>
        </div>
        */}
      </div>
    )
  }
})

ReactDOM.render(
  <ExifPage />,
  document.getElementById('content')
);
