

function formSubmit(form) {
	let url = window.location.href;
	if (url.includes("search")) {
		const split = url.split("/");
		const slice = split.slice(0, -1);
		url = slice.join("/");
	}
	if (url.includes("?")) {
		const split = url.split("?");
		const slice = split.slice(0, -1);
		url = slice;
	}
	form.action = url + "/search";

	// alert(form.action);
	return true;
}


$(document).ready(function () {


	const readURL = function (input) {
		if (input.files && input.files[0]) {
			const reader = new FileReader();

			reader.onload = function (e) {
				$('.avatar').attr('src', e.target.result);
			}

			reader.readAsDataURL(input.files[0]);
		}
	}


	$(".file-upload").on('change', function () {
		readURL(this);
	});
});


function validation(form) {
	const username = document.getElementById("username-signup").value;
	const phone = document.getElementById("phone-signup").value;
	const email = document.getElementById("email-signup").value;
	const password = document.getElementById("pass-signup").value;
	const re_password = document.getElementById("re-pass-signup").value;
	if (username.length == 0) {
		document.getElementById("username-signup-error").innerHTML = "Bạn phải nhập tên tài khoản";
		return false;
	}


	if (phone.length == 0) {
		document.getElementById("username-signup-error").innerHTML = "";
		document.getElementById("phone-signup-error").innerHTML = "Bạn phải nhập số điện thoại";
		return false;
	}


	if (email.length == 0) {
		document.getElementById("username-signup-error").innerHTML = "";
		document.getElementById("phone-signup-error").innerHTML = "";
		document.getElementById("email-signup-error").innerHTML = "Bạn phải nhập email ";
		return false;
	}

	if (password.length == 0) {
		document.getElementById("username-signup-error").innerHTML = "";
		document.getElementById("phone-signup-error").innerHTML = "";
		document.getElementById("email-signup-error").innerHTML = "";
		document.getElementById("password-signup-error").innerHTML = "Bạn phải nhập mật khẩu";
		return false;
	}

	if (re_password.length == 0) {
		document.getElementById("username-signup-error").innerHTML = "";
		document.getElementById("phone-signup-error").innerHTML = "";
		document.getElementById("email-signup-error").innerHTML = "";
		document.getElementById("password-signup-error").innerHTML = "";
		document.getElementById("re-password-signup-error").innerHTML = "Bạn phải nhập lại mật khẩu";
		return false;
	}

	if (password.length < 7) {
		document.getElementById("username-signup-error").innerHTML = "";
		document.getElementById("phone-signup-error").innerHTML = "";
		document.getElementById("email-signup-error").innerHTML = "";
		document.getElementById("password-signup-error").innerHTML = "";
		document.getElementById("re-password-signup-error").innerHTML = "";
		document.getElementById("password-signup-error").innerHTML = "Mật khẩu phải dài hơn 6 kí tự";
		return false;
	}
	if (checkUserNameExist(username)) {
		document.getElementById("signup-error").innerHTML = "Hãy nhập một tên đăng nhập khác";
		return false;
	}

	if (checkEmailExist(email)) {
		document.getElementById("signup-error").innerHTML = "Hãy nhập một email khác";
		return false;
	}

	if (password.localeCompare(re_password) != 0) {
		document.getElementById("username-signup-error").innerHTML = "";
		document.getElementById("phone-signup-error").innerHTML = "";
		document.getElementById("email-signup-error").innerHTML = "";
		document.getElementById("password-signup-error").innerHTML = "";
		document.getElementById("re-password-signup-error").innerHTML = "";
		document.getElementById("password-signup-error").innerHTML = "";
		document.getElementById("signup-error").innerHTML = "Mật khẩu nhập lại không khớp";
		return false;
	}

	console.log("success");
	return true;
}

function checkUserNameExist(username) {

	let mydata;
	$.ajax({
		url: '/api/users/username-is-exist',
		async: false,
		dataType: 'json',
		data: { username },
		success: function (json) {
			mydata = json;
		}
	});

	if (mydata) {
		$('#username-signup-error').addClass('error').removeClass('success').html('Tên đăng nhập này đã tồn tại');
		return true;
	}
	else {
		$('#username-signup-error').addClass('success').removeClass('error').html('Bạn có thể dùng tên đăng nhập này');
		return false;
	}
}


function checkPhone(value) {
	if (value == "") {
		$('#phone-signup-error').addClass('error').removeClass('success').html('Hãy nhập số điện thoại');
		return false;
	}
	if (value.length != 10 && value.length != 11) {
		$('#phone-signup-error').addClass('error').removeClass('success').html('Số điện thoại không hợp lệ');
		return false;
	}
	$('#phone-signup-error').addClass('error').removeClass('success').html('');
	return true;
}

function checkEmailExist(email) {
	let mydata;
	$.ajax({
		url: '/api/users/email-is-exist',
		async: false,
		dataType: 'json',
		data: { email },
		success: function (json) {
			mydata = json;
		}
	});

	if (mydata) {
		$('#email-signup-error').addClass('error').removeClass('success').html('Email đã có người sử dụng');
		return true;
	}
	else {
		$('#email-signup-error').addClass('success').removeClass('error').html('Bạn có thể dùng email này');
		return false;
	}
}


function checkPassword(value) {
	var passw = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,20}$/;
	if (value.length < 7) {
		$('#password-signup-error').addClass('error').removeClass('success').html('Mật khẩu phải dài hơn 7 kí tự');
		return false;
	}

	if (value.length > 20) {
		$('#password-signup-error').addClass('error').removeClass('success').html('Mật khẩu không được quá 16 kí tự');
		return false;
	}

	if (!value.match(passw)) {
		$('#password-signup-error').addClass('error').removeClass('success').html('Mật khẩu chứa ít nhất 1 kí tự thường, 1 kí tự hoa và 1 kí tự số');
		return false;
	}
	$('#password-signup-error').addClass('success').removeClass('error').html('');
	return true;
}

function checkRePassword(value) {
	const pass = document.getElementById("pass-signup").value;
	if (value.localeCompare(pass) != 0) {
		$('#re-password-signup-error').addClass('error').removeClass('success').html('Mật khẩu xác nhận không giống với mật khẩu của bạn');
		return false;
	}
	$('#re-password-signup-error').addClass('error').removeClass('success').html('');
	return true;
}

function checkPasswordExist(password) {
	let mydata;
	$.ajax({
		url: '/api/users/password-is-exist',
		async: false,
		dataType: 'json',
		data: { password },
		success: function (json) {
			mydata = json;
		}
	});

	if (mydata) {
		$('#change-error').addClass('error').removeClass('success').html('');
		return true;
	}
	else {
		$('#change-error').addClass('error').removeClass('success').html('Mật khẩu cũ không đúng');
		return false;
	}
}

function checkPasswordChange(value) {
	var passw = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,20}$/;
	if (value.length < 7) {
		$('#change-error').addClass('error').removeClass('success').html('Mật khẩu phải dài hơn 7 kí tự');
		return false;
	}

	if (value.length > 20) {
		$('#change-error').addClass('error').removeClass('success').html('Mật khẩu không được quá 16 kí tự');
		return false;
	}

	if (!value.match(passw)) {
		$('#change-error').addClass('error').removeClass('success').html('Mật khẩu chứa ít nhất 1 kí tự thường, 1 kí tự hoa và 1 kí tự số');
		return false;
	}
	$('#change-error').addClass('success').removeClass('error').html('');
	return true;
}

function checkPasswordChangeForm(form) {
	const password = document.getElementById("old-pass").value;
	const newPassword = document.getElementById("new-pass").value;

	if (!checkPasswordExist(password)) {

		$('#change-error').addClass('error').removeClass('success').html('Mật khẩu cũ không đúng');
		return false;
	}

	const check = checkPasswordChange(newPassword);
	if (!check) {
		$('#change-error').addClass('error').removeClass('success').html('Mật khẩu mới không hợp lệ');
		return false;
	}

	return true;
}


function validateEmail(email) {
	let mydata;
	$.ajax({
		url: '/api/users/email-is-exist',
		async: false,
		dataType: 'json',
		data: { email },
		success: function (json) {
			mydata = json;
		}
	});

	if (mydata) {
		$('#change-error').addClass('error').removeClass('success').html('');
		return true;
	}
	else {
		$('#change-error').addClass('error').removeClass('success').html('Email này không tồn tại');
		return false;
	}

}

function onsubmitRecoverForm(form) {
	const email = document.getElementById('your-email').value;
	if (validateEmail(email)) {
		return true;
	}
	else {
		$('#change-error').addClass('error').removeClass('success').html('Email này không tồn tại');
		return false;
	}
}

function recoverPasswordValidation(id, password) {
	let mydata;
	$.ajax
		({
			url: '/api/users/recover-password-is-exist',
			async: false,
			dataType: 'json',
			data: { id, password },
			success: function (json) {
				mydata = json;
			}
		});

	if (mydata) {
		$('#change-error').addClass('error').removeClass('success').html('');
		return true;
	}
	else {
		$('#change-error').addClass('error').removeClass('success').html('Mật khẩu cũ không đúng');
		return false;
	}
}

function onsubmitRecoverPasswordValidation(form, id) {
	const oldPassword = document.getElementById("old-pass").value;
	const newPassword = document.getElementById("new-pass").value;
	if (!recoverPasswordValidation(id, oldPassword)) {

		$('#change-error').addClass('error').removeClass('success').html('Mật khẩu cũ không đúng');
		return false;
	}

	const check = checkPasswordChange(newPassword);
	if (!check) {
		$('#change-error').addClass('error').removeClass('success').html('Mật khẩu mới không hợp lệ');
		return false;
	}

	return true;

}



function replaceTotal(products) {
	const template = Handlebars.compile($('#count-template').html());
	const count = { count: products.length };
	const productsHtml = template(count);
	$('#count').html(productsHtml);
	return count;
}


function replaceProduct(products,carts) {
	const template = Handlebars.compile($('#product-list-template').html());
	Handlebars.registerHelper("json", function (value) {                  
		return JSON.stringify(value);
	});
	const books = { books: products,
		json: ()=>json,
		cart:carts	
	};
	const productsHtml = template(books);
	$('#products').fadeOut("slow", function () {
		$('#products').html(productsHtml)
		$('#products').fadeIn("slow");

	});
	
}



function getProductPage(page,carts) {
	$.ajax({
		url: '/api/books/list',

		dataType: 'json',
		data: { page },
		cache: true,
		success: function (json) {
			replaceTotal(json);
			replaceProduct(json,carts);
		}
	});

}

function getProductSearchPage(keyword, categoryID, page,carts) {
	let mydata;
	if (categoryID.length > 0) {
		mydata = { keyword, categoryID, page };
	}
	else {
		mydata = { keyword, page };
	}
	$.ajax({
		url: '/api/books/search-list',
		dataType: 'json',
		data: mydata,
		cache: true,
		success: function (json) {
			replaceTotal(json);
			replaceProduct(json,carts);
		},
		error: function (e) {
			console.info("Error");
		},
		done: function (e) {
			console.info("DONE");
		}
	});
}
function countAllProduct(page) {
	let mydata;
	$.ajax({
		url: '/api/books/page-count',

		dataType: 'json',
		success: function (json) {
			replacePage(page, json);
		}
	});

}

function countSearchProduct(keyword, categoryID, page) {
	let mydata;
	if (categoryID.length > 0) {
		mydata = { keyword, categoryID, page };
	}
	else {
		mydata = { keyword, page };
	}
	$.ajax({
		url: '/api/books/search-list-count',
		dataType: 'json',
		data: mydata,
		cache: true,
		success: function (json) {
			replacePage(page, json);
		},
		error: function (e) {
			console.info("Error");
		},
		done: function (e) {
			console.info("DONE");
		}
	});
}
function countCategoryProduct(categoryID, page) {

	$.ajax({
		url: '/api/books/category-page-count',
		dataType: 'json',
		data: { categoryID },
		success: function (json) {
			replacePage(page, json);
		}
	});

}
function getCategoryProductPage(categoryID, page,carts) {

	$.ajax({
		url: '/api/books/category-list',
		dataType: 'json',
		data: { page, categoryID },
		success: function (json) {
			replaceProduct(json,carts);
			replaceTotal(json);
		}

	});
}



function replacePage(page, count) {
	let mydata;
	$.ajax({
		type: 'get',
		url: '/api/books/pagination',
		dataType: 'json',
		data: { page, count },
		success: function (html) {
			$('html, body').animate({ scrollTop: $('#products').position().top }, 'slow');
			// $('#pagination').fadeOut("slow", function(){
			$('#pagination').html(html);
			// $('#pagination').fadeIn("slow");

		},
		error: function () {
			console.log("error");
		}
	});
}

function pagination(page,carts) {
	let product;
	let count;
	let keyword;
	if (window.location.href.indexOf("category") > -1) {
		if (window.location.href.indexOf("search") > -1) {
			const segment_str = window.location.pathname; // return segment1/segment2/segment3/segment4
			const segment_array = segment_str.split('/');
			const search = segment_array.pop();
			const categoryID = segment_array.pop();
			keyword = getParameterByName('keyword', window.location.href);
			product = getProductSearchPage(keyword, categoryID, page,carts);
			count = countSearchProduct(keyword, categoryID, page);
		}
		else {
			const segment_str = window.location.pathname; // return segment1/segment2/segment3/segment4
			const segment_array = segment_str.split('/');
			const categoryID = segment_array.pop();
			product = getCategoryProductPage(categoryID, page,carts);
			count = countCategoryProduct(categoryID, page);
		}
	}
	else {
		if (window.location.href.indexOf("search") > -1) {
			keyword = getParameterByName('keyword', window.location.href);
			product = getProductSearchPage(keyword, "", page,carts);
			count = countSearchProduct(keyword, "", page);
		}
		else {
			product = getProductPage(page,carts);
			count = countAllProduct(page);
		}
	}


	if (window.location.href.indexOf("search") > -1) {
		if (history.pushState) {
			var newurl = window.location.protocol + "//" + window.location.host + window.location.pathname + '?keyword=' + keyword + '&p=' + page;
			window.history.pushState({ path: newurl }, '', newurl);
		}
	}
	else {
		if (history.pushState) {
			var newurl = window.location.protocol + "//" + window.location.host + window.location.pathname + '?p=' + page;
			window.history.pushState({ path: newurl }, '', newurl);
		}
	}
	return false;
}

function getParameterByName(name, url = window.location.href) {
	name = name.replace(/[\[\]]/g, '\\$&');
	var regex = new RegExp('[?&]' + name + '(=([^&#]*)|&|#|$)'),
		results = regex.exec(url);
	if (!results) return null;
	if (!results[2]) return '';
	return decodeURIComponent(results[2].replace(/\+/g, ' '));
}

function updateUrlParameter(uri, key, value) {
	// remove the hash part before operating on the uri
	var i = uri.indexOf('#');
	var hash = i === -1 ? '' : uri.substr(i);
	uri = i === -1 ? uri : uri.substr(0, i);

	var re = new RegExp("([?&])" + key + "=.*?(&|$)", "i");
	var separator = uri.indexOf('?') !== -1 ? "&" : "?";

	if (!value) {
		// remove key-value pair if value is empty
		uri = uri.replace(new RegExp("([?&]?)" + key + "=[^&]*", "i"), '');
		if (uri.slice(-1) === '?') {
			uri = uri.slice(0, -1);
		}
		// replace first occurrence of & by ? if no ? is present
		if (uri.indexOf('?') === -1) uri = uri.replace(/&/, '?');
	} else if (uri.match(re)) {
		uri = uri.replace(re, '$1' + key + "=" + value + '$2');
	} else {
		uri = uri + separator + key + "=" + value;
	}
	return uri + hash;
}

function commend(user) {
	const comment = document.getElementById("comment").value;
	const nameInput = document.getElementById("username");
	const type = nameInput.getAttribute('type');
	let mydata;
	const segment_str = window.location.pathname; // return segment1/segment2/segment3/segment4
	const segment_array = segment_str.split('/');
	const bookId = segment_array.pop();

	if (type === 'text') {
		const name = nameInput.value;
		if(name)
			mydata = {
			comment, name, bookId
			};
		else
		{
			alert("Hãy nhập tên của bạn để bình luận");
			return false;
		}
	}
	else {
		mydata = {
			comment, bookId
		};
	}
	
	if(comment.length==0)
	{
		alert("Hãy nhập bình luận trước khi gửi");
		return false;
	}
	

	$.ajax({
		type: 'get',
		url: '/api/books/comment',
		dataType: 'json',
		data: mydata,
		success: function (json) {
			replaceComment(json.comments, user);
			pageComment(json.page);
		},
		error: function () {
			console.log("error");
		}
	});

}

function replaceComment(comments, user) 
{
	const template = Handlebars.compile($('#comments-template').html());
	let replace;
	if (user)
		replace = { comments: comments, user: user };
	else
		replace = { comments: comments };
	const productsHtml = template( replace);
	$('#comment-div').fadeOut("slow", function () {
		$('#comment-div').html(productsHtml)
		$('#comment-div').fadeIn("slow");

	});
}

function pageComment(page) {
	const segment_str = window.location.pathname; // return segment1/segment2/segment3/segment4
	const segment_array = segment_str.split('/');
	const bookId = segment_array.pop();
	$.ajax({
		type: 'get',
		url: '/api/books/pagination-comment',
		dataType: 'json',
		data: { page, bookId },
		success: function (html) {

			// $('#pagination').fadeOut("slow", function(){
			$('#pagination-comment').html(html);
			// $('#pagination').fadeIn("slow");

		},
		error: function () {
			console.log("error");
		}
	});
}

function getCommentPage(page,user) {
	const segment_str = window.location.pathname; // return segment1/segment2/segment3/segment4
	const segment_array = segment_str.split('/');
	const bookId = segment_array.pop();
	const mydata = { bookId, page };
	$.ajax({
		url: '/api/books/comments-list',
		dataType: 'json',
		data: mydata,
		cache: true,
		success: function (json) {
			replaceComment(json,user);
		},
		error: function (e) {
			console.info("Error");
		},
		done: function (e) {
			console.info("DONE");
		}
	});
}

// function countAllComments()
// {
// 	const segment_str = window.location.pathname; // return segment1/segment2/segment3/segment4
// 	const segment_array = segment_str.split( '/' );
// 	const bookId = segment_array.pop();
// 	$.ajax({
// 		url: '/api/books/comments-count',
// 		dataType: 'json',
// 		data: bookId,
// 		cache: true,
// 		success: function (json) {
// 			pageComment(json);
// 		},
// 		error : function(e) {
// 			console.info("Error");
// 		},
// 		done : function(e) {
// 			console.info("DONE");
// 		}
// 	});
// }

function commentPagination(page,user) {
	getCommentPage(page,user);
	pageComment(page);
	return false;
}


function addProductToCart(cart_id,book_id)
{
	let mydata={
		cartID:cart_id,
		bookID:book_id
	};
	$.ajax({
		url: '/api/carts/add-product',
		dataType: 'json',
		data: mydata,
		cache: true,
		success: function (json) {
			replaceCart(json)
			replaceTotalQuantity(json)
		},
	});
	return false;
}
function  addProductAndGoToCart(cart_id,book_id)
{
	let mydata={
		cartID:cart_id,
		bookID:book_id
	};
	$.ajax({
		url: '/api/carts/add-product',
		dataType: 'json',
		data: mydata,
		cache: true,
		success: function (json) {
			replaceCart(json)
			replaceTotalQuantity(json)
			window.location = "/carts/";
		},
	});

}
function replaceTotalQuantity(newCart)
{
	

	
	$('#quantity').fadeOut("slow", function () {
		$('#quantity').html(newCart.total_quantity)
		$('#quantity').fadeIn("slow");

	});	
}
function replaceCart(newCart)
{
	const template = Handlebars.compile($('#cart-template').html());

	const cart={
		cart:newCart,
	};
	const productsHtml = template(cart);
	
	$('#div-cart').fadeOut("slow", function () {
		$('#div-cart').html(productsHtml)
		$('#div-cart').fadeIn("slow");

	});	
	
	
}

function replaceWishList(newCart)
{
	const template = Handlebars.compile($('#checkout-template').html());

	Handlebars.registerHelper("json", function (value) {                  
		return JSON.stringify(value);
	});
	const cart={
		cart:newCart,
		json:()=>json
	};
	const productsHtml = template(cart);
	
	$('#checkout-div').fadeOut("slow", function () {
		$('#checkout-div').html(productsHtml)
		$('#checkout-div').fadeIn("slow");

	});	
}
function addProductWishList(cart_id,book_id)
{
	let mydata={
		cartID:cart_id,
		bookID:book_id
	};
	$.ajax({
		url: '/api/carts/add-product',
		dataType: 'json',
		data: mydata,
		cache: true,
		success: function (json) {
			replaceCart(json)
			replaceTotalQuantity(json)
			replaceWishList(json);
		},
	});
	return false;
}

function decreaseProductWishList(cart_id,book_id)
{
	let mydata={
		cartID:cart_id,
		bookID:book_id
	};
	$.ajax({
		url: '/api/carts/decrease-product',
		dataType: 'json',
		data: mydata,
		cache: true,
		success: function (json) {
			replaceCart(json)
			replaceTotalQuantity(json)
			replaceWishList(json);
		},
	});
	return false;
}

function removeProductWishList(cart_id,book_id)
{
	let mydata={
		cartID:cart_id,
		bookID:book_id
	};
	$.ajax({
		url: '/api/carts/remove-product',
		dataType: 'json',
		data: mydata,
		cache: true,
		success: function (json) {
			replaceCart(json)
			replaceTotalQuantity(json)
			replaceWishList(json);
		},
	});
	return false;
}
