'use strict'
$(function () {
  $('.bg3 li').mouseenter(function(){
    $('.bg3 .active').removeClass('active')
    $(this).addClass('active')
  })
  $('.demo li').mouseenter(function() {
    $('.demo .active').removeClass('active')
    $(this).addClass('active')
  })
  $('#fullpage').fullpage()
})
