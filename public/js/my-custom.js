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


function checkPassword(value)
{
    var passw = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,20}$/;
    if(value.length<7)
	{
		$('#password-signup-error').addClass('error').removeClass('success').html('Mật khẩu phải dài hơn 7 kí tự');
		return false;
    }

    if(value.length>20)
	{
		$('#password-signup-error').addClass('error').removeClass('success').html('Mật khẩu không được quá 16 kí tự');
		return false;
    }

    if(!value.match(passw))
    {
        $('#password-signup-error').addClass('error').removeClass('success').html('Mật khẩu chứa ít nhất 1 kí tự thường, 1 kí tự hoa và 1 kí tự số');
		return false;
    }
    $('#password-signup-error').addClass('success').removeClass('error').html('');
    return true;
}

function checkRePassword(value)
{
    const pass=document.getElementById("pass-signup").value;
    if(value.localeCompare(pass)!=0)
    {
        $('#re-password-signup-error').addClass('error').removeClass('success').html('Mật khẩu xác nhận không giống với mật khẩu của bạn');
		return false;
    }
    $('#re-password-signup-error').addClass('error').removeClass('success').html('');
    return true;
}

function checkPasswordExist(password)
{
	let mydata;
	$.ajax({
  	url: '/api/users/password-is-exist',
  	async: false,
	dataType: 'json',
	data: {password},
  	success: function (json) {
   	 mydata = json;
  	}
	});

		if(mydata)
		{
			$('#change-error').addClass('error').removeClass('success').html('');
			return true;
		}
		else
		{
			$('#change-error').addClass('error').removeClass('success').html('Mật khẩu cũ không đúng');
			return false;
		}	
}

function checkPasswordChange(value)
{
	var passw = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,20}$/;
    if(value.length<7)
	{
		$('#change-error').addClass('error').removeClass('success').html('Mật khẩu phải dài hơn 7 kí tự');
		return false;
    }

    if(value.length>20)
	{
		$('#change-error').addClass('error').removeClass('success').html('Mật khẩu không được quá 16 kí tự');
		return false;
    }

    if(!value.match(passw))
    {
        $('#change-error').addClass('error').removeClass('success').html('Mật khẩu chứa ít nhất 1 kí tự thường, 1 kí tự hoa và 1 kí tự số');
		return false;
    }
    $('#change-error').addClass('success').removeClass('error').html('');
    return true;
}

function checkPasswordChangeForm(form)
{
	const password=document.getElementById("old-pass").value;
	const newPassword=document.getElementById("new-pass").value;
	
	if(!checkPasswordExist(password))
	{

		$('#change-error').addClass('error').removeClass('success').html('Mật khẩu cũ không đúng');
		return false;
	}
	
	const check=checkPasswordChange(newPassword);
	if(!check)
	{
		$('#change-error').addClass('error').removeClass('success').html('Mật khẩu mới không hợp lệ');
		return false;
	}

	return true;
}


function validateEmail(email)
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
			$('#change-error').addClass('error').removeClass('success').html('');
			return true;
		}
		else
		{
			$('#change-error').addClass('error').removeClass('success').html('Email này không tồn tại');
			return false;
		}	
		
}

function onsubmitRecoverForm(form)
{
	const email=document.getElementById('your-email').value;
	if(validateEmail(email))
	{
		return true;
	}
	else
	{
		$('#change-error').addClass('error').removeClass('success').html('Email này không tồn tại');
			return false;
	}
}

function recoverPasswordValidation(id,password)
{
	let mydata;
	$.ajax
	({
  		url: '/api/users/recover-password-is-exist',
  		async: false,
		dataType: 'json',
		data: {id,password},
  		success: function (json) {
			mydata = json;
		}
	});

	if(mydata)
		{
			$('#change-error').addClass('error').removeClass('success').html('');
			return true;
		}
		else
		{
			$('#change-error').addClass('error').removeClass('success').html('Mật khẩu cũ không đúng');
			return false;
		}	
}

function onsubmitRecoverPasswordValidation(form,id)
{
	const oldPassword=document.getElementById("old-pass").value;
	const newPassword=document.getElementById("new-pass").value;
	if(!recoverPasswordValidation(id,oldPassword))
	{

		$('#change-error').addClass('error').removeClass('success').html('Mật khẩu cũ không đúng');
		return false;
	}
	
	const check=checkPasswordChange(newPassword);
	if(!check)
	{
		$('#change-error').addClass('error').removeClass('success').html('Mật khẩu mới không hợp lệ');
		return false;
	}

	return true;

}