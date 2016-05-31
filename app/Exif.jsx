import React from 'react';
import ReactDOM from 'react-dom';
import EXIF from './exiflib.js';
// import request from 'superagent';
import ExifInfo from './ExifInfo.jsx';
import InfoDisplay from './InfoDisplay.jsx';

var DEBUG = false;
var geotag = "https://raw.githubusercontent.com/jiahuang/exif-viewer/master/app/images/geotag.jpg";

var ExifPage = React.createClass({
  getInitialState: function() {
    this.getImageFromURL(this.props.image)
    return {state: null, image: this.props.image, tempImage: "", clickedBlock: null}
  },
  getImageFromURL: function(url){
    var that = this;

    var xhr = new XMLHttpRequest();
    xhr.open("GET", url);
    xhr.responseType = "blob";
    xhr.onload = function()
    {
      var blob = xhr.response;//xhr.response is now a blob object
      var file = new FileReader();
      // file.readAsBinaryString(blob)
      file.readAsArrayBuffer(blob);
      file.addEventListener("loadend", function(e)
      {
        var exif = EXIF.readFromBinaryFile(e.target.result);
        if (DEBUG){
          console.log("exif", exif);
          console.log("bytes", EXIF.bytes);
        }

        var binaryReader = new FileReader();
        var sortedBytes = EXIF.bytes.sort(function(a, b){
          return a.offset < b.offset ? -1 : 1;
        });
        that.setState({info: {}, "byteData": sortedBytes})
        var lastOffset = sortedBytes[sortedBytes.length-1].offset
        var lastByte = lastOffset+32-lastOffset%16
        binaryReader.readAsBinaryString(blob.slice(0, lastOffset > blob.size ? blob.size : lastByte));
        binaryReader.addEventListener("loadend", function(e)
        {
          var markup = that.showResult(binaryReader, "Binary");
          sortedBytes.forEach(function(b, index){
            if (b.type && b.tagName){
              exif[b.tagName] = {value: exif[b.tagName], block: index};
            }
            for(var i = 0; i<b.bytes.length; i++){
              var m = markup[b.offset+i];
              m["block"] = {number: index, start: b.offset, end: b.offset+b.bytes.length};
              markup[b.offset+i] = m;
            }
          })
          if (DEBUG){
            console.log("markup", markup, "exif blocked", exif);
          }
          that.setState({"bytes": markup, clickedBlock: -1, "exif": exif, image: url})
        });
      });
    }
    xhr.send();
  },
  handleImageUpload: function(){
    this.getImageFromURL(this.state.tempImage);
  },
  handleImageChange: function(e){
    this.setState({tempImage: e.target.value})
  },
  handleByteChunkClick: function(byteChunk) {
    this.setState({clickedBlock: null, info: this.state.byteData[byteChunk.block.number]})
  },
  handleExifClick: function(block){
    this.setState({clickedBlock: block, info: this.state.byteData[block]})
  },
  showResult: function(fr) {
    var markup, result, n, aByte, byteStr;
    markup = [];
    result = fr.result;

    for (n = 0; n < result.length; ++n) {
        aByte = result.charCodeAt(n);
        byteStr = aByte.toString(16);
        if (byteStr.length < 2) {
            byteStr = "0" + byteStr;
        }
        markup.push({byte: byteStr});
    }
    return markup;
  },
  render: function() {
    return(
      <div>
        <div class="row instructions">
          <div class="col col-md-12">Upload an image to view the binary EXIF data. Highlight over the binary data to view decoded metadata.
          </div>
        </div>
        <div className="row">
          <div className="col col-md-12">
            <img className="exifImg block" src={this.state.image} />
          </div>
        </div>
        <div className="row">
          <div className="col col-md-12">
            <div className="input-group exifURL">
              <input type="text" className="textInput form-control" placeholder="URL" value={this.state.tempImage} onChange={this.handleImageChange}/>
              <span className="input-group-btn"><button className="btn btn-default" onClick={this.handleImageUpload}>Use Image URL</button></span>
            </div>
          </div>
        </div>

        <div className="row">
          <div className="col col-md-6">
            <ExifInfo bytes={this.state.bytes} handleClick={this.handleByteChunkClick} clickedBlock={this.state.clickedBlock}/>
          </div>
          <div className="col col-md-6">
            <InfoDisplay info={this.state.info} exif={this.state.exif} handleExifClick={this.handleExifClick}/>
          </div>
        </div>
      </div>
    )
  }
})

ReactDOM.render(
  <ExifPage image={geotag}/>,
  document.getElementById('content')
);
