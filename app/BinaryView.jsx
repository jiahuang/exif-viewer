import React from 'react';

var ByteChunk = React.CreateClass({
  getInitialState: function() {
  },
  render: function(){
    <div>

    </div>
  }
})

var BinaryView = React.createClass({
  getInitialState: function() {
  },
  handleByteChunkHighlight: function(data){
    // some data chunk has been highlighted
    this.setState({highlighted: data})
  },
  render: function() {
    return(
      <div className="binaryView">
        <div className="bytes">
          <ByteChunk />
        </div>
        <ByteInfo info={this.state.highlighted}/>
      </div>
    )
  }
})

export default BinaryView;
