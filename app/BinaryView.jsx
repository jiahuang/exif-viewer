import React from 'react';

var ByteChunk = React.CreateClass({
  propTypes: {
    handleHighlight: React.PropTypes.func.isRequired
  },
  getInitialState: function() {
  },
  render: function(){
    <div>
    
    </div>
  }
})

var BinaryView = React.createClass({
  getInitialState: function() {
    // this.props.exifData = [{}]
  },
  handleByteChunkHighlight: function(data){
    // some data chunk has been highlighted
    this.setState({highlighted: data})
  },
  render: function() {
    return(
      <div className="binaryView">
        <div className="bytes">
          <ByteChunk exifData={this.props.exifData} handleHighlight={this.handleByteChunkHighlight}/>
        </div>
        <ByteInfo info={this.state.highlighted}/>
      </div>
    )
  }
})

export default BinaryView;
