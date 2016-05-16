import React from 'react';

var ExifInfo = React.createClass({
  getInitialState: function() {
  },
  render: function() {
    return(
      <div className="exifInfo">
        {this.state.info}
      </div>
    )
  }
})

export default ExifInfo;
