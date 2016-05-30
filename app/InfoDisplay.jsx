import React from 'react';

var TagInfo = React.createClass({
  getInitialState: function() {
    return {}
  },
  getTagType: function(val){
    if (val == 1){
      return {format: "Byte", description: "an 8-bit unsigned integer."}
    } else if (val == 2) {
      return {format: "ASCII", description: "An 8-bit byte containing one 7-bit ASCII code. The final byte is terminated with NULL."}
    } else if (val == 3) {
      return {format: "Short", description: "A 16-bit (2-byte) unsigned integer."}
    } else if (val == 4) {
      return {format: "Long", description: "A 32-bit (4-byte) unsigned integer."}
    } else if (val == 5) {
      return {format: "Rational", description: "Two LONGs. The first LONG is the numerator and the second LONG expresses the denominator. Two LONGs is too much data to fit in the tag which only has 4 bytes allocated. If the type is Rational the value contained here is the address to find the data. It is important to note that the offset is NOT from the start of the file. It is from the start of the EXIF header."}
    } else if (val == 7) {
      return {format: "Undefined", description: "An 8-bit byte that can take any value depending on the field definition."}
    } else if (val == 9) {
      return {format: "SLONG", description: "A 32-bit (4-byte) signed integer (2's complement notation)."}
    } else if (val == 10) {
      return {format: "SRATIONAL", description: "Two SLONGs. The first SLONG is the numerator and the second SLONG is the denominator. Two SLONGs is too much data to fit in the tag which only has 4 bytes allocated. If the type is SRATIONAL the value contained here is the address to find the data. It is important to note that the offset is NOT from the start of the file. It is from the start of the EXIF header."}
    } else {
      return {format: "Not in spec", description: "This format is not in the spec."}
    }
  },
  render: function(){
    console.log("tag", this.props.info)
    var tagType = this.getTagType(this.props.info.tagType)

    var value = this.props.info.value.valueOf();
    if (Array.isArray(this.props.info.value)){
      value = this.props.info.value.map(function(val){
        return val.valueOf()+" ";
      });
    }

    return(
      <div className="tagInfo">
        <h4>Bytes 0-1: Tag ID</h4>
        <div className="infoByte">
          <span className="byte">{this.props.info.bytes[0].byte}</span>
          <span className="byte">{this.props.info.bytes[1].byte}</span>
        </div>
        <p>This tag's id is: <span className="result">0x{Number(this.props.info.tagId).toString(16)}</span>. This ID is used to distinguish it from other tags.</p>
        <h4>Bytes 2-3: Type</h4>
        <div className="infoByte">
          <span className="byte">{this.props.info.bytes[2].byte}</span>
          <span className="byte">{this.props.info.bytes[3].byte}</span>
        </div>
        <p>The value held in this tag is of type <span className="result">{tagType.format}</span>. {tagType.description}</p>
        <h4>Bytes 4-7: Count</h4>
        <div className="infoByte">
          <span className="byte">{this.props.info.bytes[4].byte}</span>
          <span className="byte">{this.props.info.bytes[5].byte}</span>
          <span className="byte">{this.props.info.bytes[6].byte}</span>
          <span className="byte">{this.props.info.bytes[7].byte}</span>
        </div>
        <p>The number of values. It should be noted carefully that the count is not the sum of the bytes. In the case of one value of SHORT (16 bits), for example, the count is '1' even though it is 2 bytes. This tag has a count of <span className="result">{this.props.info.tagCount}</span>.</p>
        <h4>Bytes 8-11: Value or Offset</h4>
        <div className="infoByte">
          <span className="byte">{this.props.info.bytes[8].byte}</span>
          <span className="byte">{this.props.info.bytes[9].byte}</span>
          <span className="byte">{this.props.info.bytes[10].byte}</span>
          <span className="byte">{this.props.info.bytes[11].byte}</span>
        </div>
        <p>If the value can fit in 4 bytes this will store the 4 bytes. Otherwise it stores the offset from the start of the EXIF header. If the value is smaller than 4 bytes, it is stored starting from the left. This tag has a value of <span className="result">{value}</span>.</p>
      </div>
    )
  }
})

var InfoDisplay = React.createClass({
  getInitialState: function() {
    return {showEXIF: false}
  },
  handleExifClick: function(){
    this.setState({showEXIF: true})
  },
  handleBinaryClick: function(){
    this.setState({showEXIF: false})
  },
  renderEXIF: function(){
    var keyInfo = Object.keys(this.props.exif).map(function(k){
      var val = this.props.exif[k].valueOf()
      if (Array.isArray(this.props.exif[k])){
        val = this.props.exif[k].map(function(v){
          return v.valueOf()+" ";
        });
      }
      return (
        <p key={k}>
          <span className="exifDataType text-primary">{k}</span> {val}
        </p>
      )
    }.bind(this))

    return(
      <div>
        {keyInfo}
      </div>
    )
  },
  renderContent: function(){
    var tag = this.props.info.type && this.props.info.type == "tag" ? <TagInfo info={this.props.info}/> : null

    var content = this.state.showEXIF ? (<div>{this.renderEXIF()}</div>) : (
      <div className="binaryInfo">
        {this.props.info.description ? <div>
          <h4 className="text-primary">Description</h4>
          <p>{this.props.info.description}. This is a 12 byte entry containing the following data</p>
          </div>: <p>No bytes selected. Click on some bytes to view the EXIF data.</p>}
        {tag}
      </div>
    )

    return(
      <div>
        {content}
      </div>
    )
  },
  render: function() {
    if (this.props.info) {
      return(
        <div className="infoDisplay">
          <ul className="nav nav-pills nav-justified">
            <li className="active"><a onClick={this.handleBinaryClick} data-toggle="pill">Binary Data</a></li>
            <li><a onClick={this.handleExifClick} data-toggle="pill">EXIF Data</a></li>
          </ul>
          <div className="tab-content well">
            {this.renderContent()}
          </div>
        </div>
      )
    } else {
      return(<div/>)
    }
  }
})

export default InfoDisplay;
