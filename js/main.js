var fs = require("fs");
var path = require("path");
var mime = require("mime");
var filesize = require("filesize");
var gui = require("nw.gui");
var strHelper = require("./js/strHelper.js");

gui.Window.get().showDevTools();

var fileList = [];

$(document).ready(function(){
  $("#dir").val((process.platform === 'win32') ? process.env.HOMEPATH : process.env.HOME);
  updateDir();
  updateCarouselSize();

  var win = gui.Window.get();
  win.on("resize", function(){
    updateCarouselSize();
  });

  function updateCarouselSize(){
    $("#runtimeStyle").html("#carousel img {max-width:" + $("#tabContents").width() + "px; max-height:" + $("#tabContents").height() + "px;}");
  }

  $("#browse").change(function() {
    $("#dir").val($(this).val());
    updateDir();
  });

  $("#browseBtn").click(function(){
    $("#browse").trigger("click");
  });

  $("#dir").on("input", function(){
    updateDir();
  });

  function setActiveTab(id){
    $("#tabs").children().removeClass("active");
    $(id).addClass("active");
    var panel = id.slice(0, -3);
    $("#tabContents > .tabActive").not(panel).fadeOut(200, function(){
      $(panel).fadeIn(200);
      $("#tabContents > .tabActive").removeClass("tabActive");
      $(panel).addClass("tabActive");
    });
  }

  function updateDir(){
    var dir = $("#dir").val();
    fileList = [];
    $("#detailsList").empty();
    $("#thumbnailsList").empty();
    $(".carousel-inner").empty();
    $(".carousel-control").hide();
    if(fs.existsSync(dir)){
      $("#dirNotExists").addClass("hidden");
      fs.readdirSync(dir).forEach(function(fileName){
        var filePath = path.join(dir, fileName);
        var fileMime = mime.lookup(filePath);
        if(strHelper.startsWith(fileMime, "image/")){
          fileList.push(filePath);
          fileStats = fs.statSync(filePath);
          $("#detailsList").append('<tr><td><a href="#" class="detailsItem">' + fileName + '</a></td><td>' + fileStats.mtime.toLocaleDateString() + ' ' + fileStats.mtime.toLocaleTimeString() + '</td><td>' + fileMime.substr(6) + '</td><td>' + filesize(fileStats.size) + '</td></tr>');
          $("#thumbnailsList").append('<div class="col-xs-4 col-md-3 col-lg-2"><a href="#" class="thumbnail"><img src="' + filePath + '" /><div class="caption">' + fileName + '</div></a></div>');
          $(".carousel-inner").append('<div class="item"><img src="' + filePath + '"></div>');
          $(".carousel-inner :first").addClass("active");
        }
      });
      if(fileList.length === 0){
        $("#noImages").removeClass("hidden");
      }else{
        $("#noImages").addClass("hidden");
        $(".carousel-control").show();
      }
    }else{
      $("#dirNotExists").removeClass("hidden");
      $("#noImages").addClass("hidden");
    }
    $(".thumbnail").click(function(){
      $("#carousel").carousel($(this).parent().index());
      setActiveTab("#slideshowBtn");
    });
    $(".detailsItem").click(function(){
      $("#carousel").carousel($(this).parent().parent().index());
      setActiveTab("#slideshowBtn");
    });
  }

  $(".tabBtn").click(function(){
    console.log("#" + $(this).attr("id"));
    setActiveTab("#" + $(this).attr("id"));
  });
});
