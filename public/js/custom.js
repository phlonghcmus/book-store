(function($) {
    "use strict";

	/* ..............................................
	   Loader
	   ................................................. */
	$(window).on('load', function() {
		$('.preloader').fadeOut();
		$('#preloader').delay(550).fadeOut('slow');
		$('body').delay(450).css({
			'overflow': 'visible'
		});
	});

	/* ..............................................
	   Fixed Menu
	   ................................................. */

	$(window).on('scroll', function() {
		if ($(window).scrollTop() > 50) {
			$('.main-header').addClass('fixed-menu');
		} else {
			$('.main-header').removeClass('fixed-menu');
		}
	});

	/* ..............................................
	   Gallery
	   ................................................. */

	$('#slides-shop').superslides({
		inherit_width_from: '.cover-slides',
		inherit_height_from: '.cover-slides',
		play: 5000,
		animation: 'fade',
	});

	$(".cover-slides ul li").append("<div class='overlay-background'></div>");

	/* ..............................................
	   Map Full
	   ................................................. */

	$(document).ready(function() {
		$(window).on('scroll', function() {
			if ($(this).scrollTop() > 100) {
				$('#back-to-top').fadeIn();
			} else {
				$('#back-to-top').fadeOut();
			}
		});
		$('#back-to-top').click(function() {
			$("html, body").animate({
				scrollTop: 0
			}, 600);
			return false;
		});
	});

	/* ..............................................
	   Special Menu
	   ................................................. */

	var Container = $('.container');
	Container.imagesLoaded(function() {
		var portfolio = $('.special-menu');
		portfolio.on('click', 'button', function() {
			$(this).addClass('active').siblings().removeClass('active');
			var filterValue = $(this).attr('data-filter');
			$grid.isotope({
				filter: filterValue
			});
		});
		var $grid = $('.special-list').isotope({
			itemSelector: '.special-grid'
		});
	});

	/* ..............................................
	   BaguetteBox
	   ................................................. */

	baguetteBox.run('.tz-gallery', {
		animation: 'fadeIn',
		noScrollbars: true
	});

	/* ..............................................
	   Offer Box
	   ................................................. */

	$('.offer-box').inewsticker({
		speed: 3000,
		effect: 'fade',
		dir: 'ltr',
		font_size: 13,
		color: '#ffffff',
		font_family: 'Montserrat, sans-serif',
		delay_after: 1000
	});

	/* ..............................................
	   Tooltip
	   ................................................. */

	$(document).ready(function() {
		$('[data-toggle="tooltip"]').tooltip();
	});

	/* ..............................................
	   Owl Carousel Instagram Feed
	   ................................................. */

	$('.main-instagram').owlCarousel({
		loop: true,
		margin: 0,
		dots: false,
		autoplay: true,
		autoplayTimeout: 3000,
		autoplayHoverPause: true,
		navText: ["<i class='fas fa-arrow-left'></i>", "<i class='fas fa-arrow-right'></i>"],
		responsive: {
			0: {
				items: 2,
				nav: true
			},
			600: {
				items: 3,
				nav: true
			},
			1000: {
				items: 5,
				nav: true,
				loop: true
			}
		}
	});

	/* ..............................................
	   Featured Products
	   ................................................. */

	$('.featured-products-box').owlCarousel({
		loop: true,
		margin: 15,
		dots: false,
		autoplay: true,
		autoplayTimeout: 3000,
		autoplayHoverPause: true,
		navText: ["<i class='fas fa-arrow-left'></i>", "<i class='fas fa-arrow-right'></i>"],
		responsive: {
			0: {
				items: 1,
				nav: true
			},
			600: {
				items: 3,
				nav: true
			},
			1000: {
				items: 4,
				nav: true,
				loop: true
			}
		}
	});

	/* ..............................................
	   Scroll
	   ................................................. */

	$(document).ready(function() {
		$(window).on('scroll', function() {
			if ($(this).scrollTop() > 100) {
				$('#back-to-top').fadeIn();
			} else {
				$('#back-to-top').fadeOut();
			}
		});
		$('#back-to-top').click(function() {
			$("html, body").animate({
				scrollTop: 0
			}, 600);
			return false;
		});
	});


	/* ..............................................
	   Slider Range
	   ................................................. */

	$(function() {
		$("#slider-range").slider({
			range: true,
			min: 0,
			max: 4000,
			values: [1000, 3000],
			slide: function(event, ui) {
				$("#amount").val("$" + ui.values[0] + " - $" + ui.values[1]);
			}
		});
		$("#amount").val("$" + $("#slider-range").slider("values", 0) +
			" - $" + $("#slider-range").slider("values", 1));
	});

	/* ..............................................
	   NiceScroll
	   ................................................. */

	$(".brand-box").niceScroll({
		cursorcolor: "#9b9b9c",
	});


}(jQuery));

function formSubmit(form) {
	let url=window.location.href;
	if(url.includes("search"))
	{
		const split=url.split("/");
	const slice=split.slice(0, -1);
	url=slice.join("/");
	}
	if(url.includes("?")){
	const split=url.split("?");
	const slice=split.slice(0, -1);
	url=slice;
}
		form.action = url+ "/search";

  // alert(form.action);
  return true;
}


$(document).ready(function() {


	const readURL = function(input) {
		if (input.files && input.files[0]) {
			const reader = new FileReader();

			reader.onload = function (e) {
				$('.avatar').attr('src', e.target.result);
			}

			reader.readAsDataURL(input.files[0]);
		}
	}


	$(".file-upload").on('change', function(){
		readURL(this);
	});
});


function validation(form)
{
  const username=document.getElementById("username-signup").value;
  const phone=document.getElementById("phone-signup").value;
  const email=document.getElementById("email-signup").value;
  const password=document.getElementById("pass-signup").value;
  const re_password=document.getElementById("re-pass-signup").value;
  if(username.length==0)
  {
  	document.getElementById("username-signup-error").innerHTML="Bạn phải nhập tên tài khoản";
  	return false;
  }


  if(phone.length==0)
  {
  	document.getElementById("username-signup-error").innerHTML="";
  	document.getElementById("phone-signup-error").innerHTML="Bạn phải nhập số điện thoại";
  	return false;
  }


   if(email.length==0)
  {
  	document.getElementById("username-signup-error").innerHTML="";
  	document.getElementById("phone-signup-error").innerHTML="";
  	document.getElementById("email-signup-error").innerHTML="Bạn phải nhập email ";
  	return false;
  }

   if(password.length==0)
  {
  	document.getElementById("username-signup-error").innerHTML="";
  	document.getElementById("phone-signup-error").innerHTML="";
  	document.getElementById("email-signup-error").innerHTML="";
  	document.getElementById("password-signup-error").innerHTML="Bạn phải nhập mật khẩu";
  	return false;
  }

  if(re_password.length==0)
  {
  	document.getElementById("username-signup-error").innerHTML="";
  	document.getElementById("phone-signup-error").innerHTML="";
  	document.getElementById("email-signup-error").innerHTML="";
  	document.getElementById("password-signup-error").innerHTML="";
  	document.getElementById("re-password-signup-error").innerHTML="Bạn phải nhập lại mật khẩu";
  	return false;
  }

   	if(password.length<7)
	{
  		document.getElementById("username-signup-error").innerHTML="";
  		document.getElementById("phone-signup-error").innerHTML="";
  		document.getElementById("email-signup-error").innerHTML="";
  		document.getElementById("password-signup-error").innerHTML="";
  		document.getElementById("re-password-signup-error").innerHTML="";
  		document.getElementById("password-signup-error").innerHTML="Mật khẩu phải dài hơn 6 kí tự";
  		return false;
  	}
  	if(checkUserNameExist(username))
	{
  		document.getElementById("signup-error").innerHTML="Hãy nhập một tên đăng nhập khác";
  		return false;
	}

	if(checkEmailExist(email))
	{
		document.getElementById("signup-error").innerHTML="Hãy nhập một email khác";
  		return false;
	}

  if(password.localeCompare(re_password)!=0)
  {
  	document.getElementById("username-signup-error").innerHTML="";
  	document.getElementById("phone-signup-error").innerHTML="";
  	document.getElementById("email-signup-error").innerHTML="";
  	document.getElementById("password-signup-error").innerHTML="";
  	document.getElementById("re-password-signup-error").innerHTML="";
  	document.getElementById("password-signup-error").innerHTML="";
    document.getElementById("signup-error").innerHTML="Mật khẩu nhập lại không khớp";
    return false;
  }

  console.log("success");
  return true;
}

function checkUserNameExist(username)
{

	let mydata;
	$.ajax({
  	url: '/api/users/username-is-exist',
  	async: false,
	dataType: 'json',
	data: {username},
  	success: function (json) {
   	 mydata = json;
  	}
	});

		if(mydata)
		{
			$('#username-signup-error').addClass('error').removeClass('success').html('Tên đăng nhập này đã tồn tại');
			return true;
		}
		else
		{
			$('#username-signup-error').addClass('success').removeClass('error').html('Bạn có thể dùng tên đăng nhập này');
			return false;
		}	
}


function checkPhone(value)
{
	if(value=="")
	{
		$('#phone-signup-error').addClass('error').removeClass('success').html('Hãy nhập số điện thoại');
		return false;
	}
	if(value.length!=10 && value.length!=11)
	{
		$('#phone-signup-error').addClass('error').removeClass('success').html('Số điện thoại không hợp lệ');
		return false;
	}
	$('#phone-signup-error').addClass('error').removeClass('success').html('');
	return true;
}

function checkEmailExist(email)
{
	let mydata;
	$.ajax({
  	url: '/api/users/email-is-exist',
  	async: false,
	dataType: 'json',
	data: {email},
  	success: function (json) {
   	 mydata = json;
  	}
	});

		if(mydata)
		{
			$('#email-signup-error').addClass('error').removeClass('success').html('Email đã có người sử dụng');
			return true;
		}
		else
		{
			$('#email-signup-error').addClass('success').removeClass('error').html('Bạn có thể dùng email này');
			return false;
		}	
}
