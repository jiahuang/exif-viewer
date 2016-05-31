import React from 'react';
import Update from 'react-addons-update'


var ExifInfo = React.createClass({
  propTypes: {
    handleClick: React.PropTypes.func.isRequired
  },
  getInitialState: function() {
    return {bytes: this.props.bytes}
  },
  componentWillReceiveProps: function(nextProps) {
    if (nextProps.bytes) {
      this.setState({bytes: nextProps.bytes});
    }

    if (nextProps.clickedBlock != null){
      this.setState({clickedBlock: nextProps.clickedBlock});
    }
  },
  handleMouseEnter: function(byte){
    if (byte.block != null) {
      this.setState({highlightedBlock: byte.block.number});
    }
  },
  handleMouseLeave: function(byte){
    if (byte.block != null && byte.block.number == this.state.highlightedBlock){
      this.setState({highlightedBlock: null})
    }
  },
  handleClick: function(byte){
    this.props.handleClick(byte);
    this.setState({clickedBlock: byte.block.number})
  },
  renderLine: function(lineNum, bytes){
    var hex = Number(lineNum*16).toString(16);
    var hexMem = "0x"+"0".repeat(5-hex.length)+hex;
    var byteSpans = bytes.map(function(byte, index){
      var block = null
      if (byte.block && byte.block.number == this.state.clickedBlock) {
        block = "clicked"
      } else if (byte.block && byte.block.number == this.state.highlightedBlock) {
        block = "highlighted"
      }

      var byteStyle = "byte";
      if (block != "clicked" && byte.block) {
        byteStyle = "text-info "+byteStyle;
      }
      return(<span className={byteStyle} key={lineNum*16+index} data-block={block}
        onMouseEnter={this.handleMouseEnter.bind(null, byte)}
        onMouseLeave={this.handleMouseLeave.bind(null, byte)}
        onClick={this.handleClick.bind(null, byte)}>
        {byte.byte}
      </span>)
    }.bind(this))

    var key="row"+lineNum
    return (
      <div className="memRow" key={key}>
        <span className="hexMem text-primary">
          {hexMem}
        </span>
        {byteSpans}
      </div>
    )
  },
  render: function() {
    var renderedLines = []
    if (this.state.bytes){
      for(var i =0; i<this.state.bytes.length/16; i++){
        renderedLines.push(this.renderLine(i, this.state.bytes.slice(i*16, (i+1)*16)))
      }
    }

    return(
      <div className="exifInfo">
        <div className="memRow firstRow">
          <span className="hexMem text-primary">Memory<br/>Address</span>
          <span className="byte">Bytes</span>
        </div>
        {renderedLines}
      </div>
    )
  }
})

export default ExifInfo;
