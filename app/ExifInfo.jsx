import React from 'react';
import Update from 'react-addons-update'


var ExifInfo = React.createClass({
  getInitialState: function() {
    console.log("exif info bytes", this.props.bytes)
    return {bytes: this.props.bytes}
  },
  componentWillReceiveProps: function(nextProps) {
    console.log("will receive props called", nextProps)
    this.setState({
      bytes: nextProps.bytes
    });
  },
  handleMouseEnter: function(byte, bytePos){
    console.log("byte", byte, "pos", bytePos);
    // var dataBlock = $(e.target).attr("data-block");
    // if (byte.block){
    //   // highlight all bytes within this block
    //   console.log(dataBlock, $("span[data-block='"+dataBlock+"']"));
    //
    // }
    if (byte.block != null) {
      var startPos = bytePos;
      var changedBytes = [startPos, 0];
      while(this.state.bytes.length > startPos &&
        this.state.bytes[startPos].block == byte.block){
        var startPosByte = this.state.bytes[startPos];
        startPosByte["highlighted"] = true
        changedBytes.push(startPosByte);
        startPos = startPos + 1;
      }

      changedBytes[1] = changedBytes.length - 2;
      console.log("changedBytes", changedBytes);
      var newState = Update(this.state, {
        bytes : {
          $splice : [changedBytes]
        }
      });

      this.setState({bytes: newState.bytes});
      console.log("newState", this.state.bytes);

    }
  },
  handleMouseLeave: function(e){
    // console.log("got mouse leave", e);
  },
  renderLine: function(lineNum, bytes){
    var hex = Number(lineNum*16).toString(16);
    var hexMem = "0x"+"0".repeat(5-hex.length)+hex;
    var that = this;
    console.log("rendering line")
    var byteSpans = bytes.map(function(byte, index){
      var block = "block"+ byte.block ? byte.block : null
      return(<span className={byte.highlighted ? "byte highlighted" : "byte"} key={lineNum*16+index} data-block={block}
        onMouseEnter={that.handleMouseEnter.bind(null, byte, lineNum*16+index)}
        onMouseLeave={that.handleMouseLeave.bind(null, byte, lineNum*16+index)}>
        {byte.byte}
      </span>)
    })

    var key="row"+lineNum
    return (
      <div className="memRow" key={key}>
        <span className="hexMem">
          {hexMem}
        </span>
        {byteSpans}
      </div>
    )
  },
  render: function() {
    console.log("render called", this.state.bytes)
    var renderedLines = []
    if (this.state.bytes){
      for(var i =0; i<this.state.bytes.length/16; i++){
        renderedLines.push(this.renderLine(i, this.state.bytes.slice(i*16, (i+1)*16)))
      }
    }

    return(
      <div className="exifInfo">
        {renderedLines}
      </div>
    )
  }
})

export default ExifInfo;
