// Hello.
//
// This is The Scripts used for ___________ Theme
//
//

function main() {

(function () {
   'use strict';

   /* ==============================================
  	Testimonial Slider
  	=============================================== */ 

  	$('a.page-scroll').click(function() {
        if (location.pathname.replace(/^\//,'') == this.pathname.replace(/^\//,'') && location.hostname == this.hostname) {
          var target = $(this.hash);
          target = target.length ? target : $('[name=' + this.hash.slice(1) +']');
          if (target.length) {
            $('html,body').animate({
              scrollTop: target.offset().top - 40
            }, 900);
            return false;
          }
        }
      });

    /*====================================
    Show Menu on Book
    ======================================*/
    $(window).bind('scroll', function() {
        if ($(window).scrollTop() > 40) {
            $('.navbar-default').addClass('on');
        } else {
            $('.navbar-default').removeClass('on');
        }
    });

    $('body').scrollspy({ 
        target: '.navbar-default',
        offset: 80
    })

  	$(document).ready(function() {
  	  $("#team").owlCarousel({
  	 
  	      navigation : false, // Show next and prev buttons
  	      slideSpeed : 300,
  	      paginationSpeed : 400,
  	      autoHeight : true,
  	      itemsCustom : [
				        [0, 1],
				        [450, 2],
				        [600, 2],
				        [700, 2],
				        [1000, 4],
				        [1200, 4],
				        [1400, 4],
				        [1600, 4]
				      ],
  	  });

  	  $("#clients").owlCarousel({
  	 
  	      navigation : false, // Show next and prev buttons
  	      slideSpeed : 300,
  	      paginationSpeed : 400,
  	      autoHeight : true,
  	      itemsCustom : [
				        [0, 1],
				        [450, 2],
				        [600, 2],
				        [700, 2],
				        [1000, 4],
				        [1200, 5],
				        [1400, 5],
				        [1600, 5]
				      ],
  	  });

      $("#testimonial").owlCarousel({
        navigation : false, // Show next and prev buttons
        slideSpeed : 300,
        paginationSpeed : 400,
        singleItem:true
        });

  	});

  	/*====================================
    Portfolio Isotope Filter
    ======================================*/
    $(function() {
        var $container = $('#lightbox');
        $container.isotope({
            filter: '*',
            animationOptions: {
                duration: 750,
                easing: 'linear',
                queue: false
            }
        });
        $('.cat a').click(function() {
            // $('.cat .active').removeClass('active');
            // $(this).addClass('active');
            // var selector = $(this).attr('data-filter');
            // $container.isotope({
            //     filter: selector,
            //     animationOptions: {
            //         duration: 750,
            //         easing: 'linear',
            //         queue: false
            //     }
            // });
            // return false;
        });

    });
    /*====================================
      二维码显示
      ======================================*/
    $(function(){
      $('#footer .footer-social a').mouseenter(function(){
        $(this).find('.mask').show()
      }).mouseleave(function(){
        $(this).find('.mask').hide()
      })
    })

    /*====================================
      联系我们
      ======================================*/
    var isShow = false
    function createMsg(msg, time){
      if(isShow) return
      $('.mu-alert').html(msg).show()
      isShow = true
      setTimeout(function(){
        $('.mu-alert').hide()
        isShow = false
      }, time)
    }
    function clear() {
      $('#phone').val('')
      $('#name').val('')
      $('#content').val('')
      setTimeout(function(){
        $(document).scrollTop(0)
      },1000)
    }
    $(function(){
      $('#sendEmail').click(function() {
        var phone = $('#phone').val()
        var name = $('#name').val()
        var content = $('#content').val()
        if(phone == '' || name == '' || content == ''){
          var msg = '所有内容不能为空'
          createMsg(msg, 800)
          return
        }
        var data = {
          to: 'business@bingblue.com',
          subject: '来自：首页底部免费咨询',
          html: '手机/微信:' + phone + ',姓名:' + name + ',需求:' + content,
          event: '/company/index'
        }
        $.ajax({
          type: "POST",
          url: "/new/api/email/send",
          data: data,
          success: function (data) {
            if(data.code == 200) {
              var msg = '谢谢您选择滨清，我们会尽快联系您！'
              createMsg(msg, 1000)
              clear()
            }else{
              var msg = '提交失败，请直接发送邮件至:<br>business@bingblue.com，谢谢！'
              createMsg(msg, 2000)
            }
          },
          error: function(){
            var msg = '提交失败，请直接发送邮件至:<br>business@bingblue.com，谢谢！'
            createMsg(msg, 2000)
          }
        })
      })
    })

}());


}
main();