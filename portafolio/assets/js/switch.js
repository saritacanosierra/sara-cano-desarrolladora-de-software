"use strict";
$(document).ready(function () {
  $(".icon-switch").on("click", function () {
    $(".switch").toggleClass("switch-on");
  });

  $(".color-change").on("click", function () {
    var atrColor = $(this).attr("data-color");
    $("body").removeClass("defolt-bg-light-green defolt-bg-green");

    switch (atrColor) {
      case "light-green":
        $(".s-color").attr("href", "assets/css/light-green-1.css");
        $("body").addClass("dark-wood");
        break;
      case "cafe":
        $(".s-color").attr("href", "assets/css/cafe.css");
        $("body").addClass("cartografer");
        break;
      case "green":
        $(".s-color").attr("href", "assets/css/green.css");
        $("body").addClass("dark-wood");
        break;
      case "orange":
        $(".s-color").attr("href", "assets/css/orange.css");
        $("body").addClass("cartografer");
        break;
      case "red":
        $(".s-color").attr("href", "assets/css/red.css");
        $("body").addClass("dark-wood");
        break;
      case "yellow":
        $(".s-color").attr("href", "assets/css/yellow.css");
        $("body").addClass("cartografer");
        break;
    }
  });

  // bg-change
  $(".bg-change").on("click", function () {
    var atrBg = $(this).attr("data-bg");
    $("body").removeClass("cartografer  dark-wood");
    switch (atrBg) {
      case "cartografer":
        $("body").addClass("cartografer");
        break;
      case "dark-wood":
        $("body").addClass("dark-wood");
        break;
    }
  });
});
