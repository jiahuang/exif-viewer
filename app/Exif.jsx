import React from 'react';
import ReactDOM from 'react-dom';
import EXIF from './exiflib.js';
// import request from 'superagent';
import ExifInfo from './ExifInfo.jsx';
// import BinaryView from './BinaryView.jsx';

var geotag = "https://raw.githubusercontent.com/jiahuang/exif-viewer/master/app/images/geotag.jpg";

var ExifPage = React.createClass({
  getInitialState: function() {
    var that = this;

    var xhr = new XMLHttpRequest();
    xhr.open("GET", this.props.image);
    xhr.responseType = "blob";
    xhr.onload = function()
    {
      var blob = xhr.response;//xhr.response is now a blob object
      var file = new FileReader();
      // file.readAsBinaryString(blob)
      file.readAsArrayBuffer(blob);
      file.addEventListener("loadend", function(e)
      {
        // console.log("result", e.target.result);
        var exif = EXIF.readFromBinaryFile(e.target.result);

        // that.setState({"bytes": e.target.result})
        console.log("exif", exif);
        console.log("bytes", EXIF.bytes);
        that.setState({"byteData": EXIF.bytes})

        // console.log("result", file.result);

        var binaryReader = new FileReader();
        var lastOffset = EXIF.bytes[EXIF.bytes.length-1].offset
        var lastByte = lastOffset+32-lastOffset%16
        console.log("last offset", lastOffset, blob.size);
        binaryReader.readAsBinaryString(blob.slice(0, lastOffset > blob.size ? blob.size : lastByte));
        binaryReader.addEventListener("loadend", function(e)
        {
          var markup = that.showResult(binaryReader, "Binary");
          console.log("markup", markup);
          EXIF.bytes.forEach(function(b, index){
            for(var i = 0; i<b.bytes.length; i++){
              var m = markup[b.offset+i];
              m["block"] = index;
              markup[b.offset+i] = m;
            }
          })
          that.setState({"bytes": markup})
        });
      });

    }
    xhr.send();
    return {}
  },
  showResult: function(fr) {
    var markup, result, n, aByte, byteStr;
    markup = [];
    result = fr.result;
    console.log("result length", result.length)

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
        <div>
          <img src={this.props.image} />
        </div>

        <div>
          <ExifInfo bytes={this.state.bytes} />
        </div>
        {/*
        <div>
          <BinaryView bytes={this.state.bytes}/>
        </div>
        */}
      </div>
    )
  }
})

ReactDOM.render(
  <ExifPage image={geotag}/>,
  document.getElementById('content')
);
