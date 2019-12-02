$("#signup").click(function() {
  $("#first").fadeOut("fast", function() {
    $("#third").fadeOut("fast");    
    $("#second").fadeIn("fast");
  });
});

$("#signin").click(function() {
  $("#second").fadeOut("fast", function() {
    $("#third").fadeOut("fast");    
    $("#first").fadeIn("fast");
  });
});

$("#forget_password").click(function() {
  $("#second").fadeOut("fast", function() {
    $("#first").fadeOut("fast");
    $("#third").fadeIn("fast");
  });
});


  
$(function() {
  $("form[name='login']").validate({
    rules: {
      
      email: {
        required: true,
        email: true
      },
      username: {
        required: true,
      },
      password: {
        required: true,
        
      }
    },
    messages: {
      email: "Please enter a valid email address",
      username: "Please enter your username",

      password: {
        required: "Please enter password",
      
      }
      
    },
    submitHandler: function(form) {
      form.submit();
    }
  });
});

$(function() {
  
  $("form[name='registration']").validate({
    rules: {
      firstname: "required",
      lastname: "required",
      username: "required",
      email: {
        required: true,
        email: true
      },
      password: {
        required: true,
        minlength: 5
      }
    },
    
    messages: {
      firstname: "Please enter your firstname",
      lastname: "Please enter your lastname",
      username: "Please enter your username",
      password: {
        required: "Please provide a password",
        minlength: "Your password must be at least 5 characters long"
      },
      email: "Please enter a valid email address"
    },
  
    submitHandler: function(form) {
      form.submit();
    }
  });
});

$(function() {
  
  $("form[name='forgotpassword']").validate({
    rules: {
      email: {
        required: true,
        email: true
      }
    },
    
    messages: {
      email: "Please enter a valid email address"
    },
  
    submitHandler: function(form) {
      form.submit();
    }
  });
});

function isValidEmailAddress(emailAddress) {
    var pattern = /^([a-z\d!#$%&'*+\-\/=?^_`{|}~\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]+(\.[a-z\d!#$%&'*+\-\/=?^_`{|}~\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]+)*|"((([ \t]*\r\n)?[ \t]+)?([\x01-\x08\x0b\x0c\x0e-\x1f\x7f\x21\x23-\x5b\x5d-\x7e\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]|\\[\x01-\x09\x0b\x0c\x0d-\x7f\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]))*(([ \t]*\r\n)?[ \t]+)?")@(([a-z\d\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]|[a-z\d\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF][a-z\d\-._~\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]*[a-z\d\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])\.)+([a-z\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]|[a-z\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF][a-z\d\-._~\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]*[a-z\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])\.?$/i;
    return pattern.test(emailAddress);
}

function loginUser(){
  event.preventDefault();
  document.querySelector('#submit_login').innerHTML='<strong>Logging You In ...</strong>';
  var username = document.querySelector('#login_username').value;
  var password = document.querySelector('#login_password').value;
  console.log(username, password)
  var len = username.length;
  if (username.length < 1 && password.length < 1) {
    document.querySelector('#submit_login').innerHTML='Login';
    document.querySelector('#msg').innerHTML='<p class="text-danger text-center">Invalid credentials</p>';
    setTimeout(() => {
      document.querySelector('#msg').innerHTML='';
    }, 10000);
  } else {
    $.ajax({
        url : '/login',
        method: 'POST',
        dataType : "json",
        crossOrigin:true,
        // headers: {"Authorization":"5FA056D2706634F2B7C6FC66FE17517B"},
        data: {'username': username, 'password': password}
      })
      .done(function(data) {
          if(data.status !== 200){
            console.log(data.Error)
            document.querySelector('#submit_login').innerHTML='Login';
            document.querySelector('#msg').innerHTML='<p class="text-danger text-center">'+data.Error+'</p>';
            setTimeout(() => {
              document.querySelector('#msg').innerHTML='';
            }, 10000);
          } else {
            console.log(data)
            localStorage.setItem("token", data.token)
            location.href ='/'
          }
      });
  }
}

function registerUser(){
  event.preventDefault();
  document.querySelector('#submit_register').innerHTML='<strong>Registering You ...</strong>';
  var username = document.querySelector('#username_signup').value;
  var password = document.querySelector('#password_signup').value;
  var confirm_password = document.querySelector('#confirm_password_signup').value;
  var email = document.querySelector('#email_signup').value;
  // console.log(username, password)
  if (password !== confirm_password){
    document.querySelector('#submit_register').innerHTML='Get Started For Free';
    document.querySelector('#msg').innerHTML='<p class="text-danger text-center">Password mismatch</p>';
    setTimeout(() => {
      document.querySelector('#msg').innerHTML='';
    }, 10000);
  } else {
    $.ajax({
        url : '/register',
        method: 'POST',
        dataType : "json",
        crossOrigin:true,
        // headers: {"Authorization":"5FA056D2706634F2B7C6FC66FE17517B"},
        data: {'username': username, 'password': password, 'email':email}
      })
      .done(function(data) {
          if(data.status !== 201){
            console.log(data.Error)
            document.querySelector('#submit_register').innerHTML='Get Started For Free';
            document.querySelector('#msg').innerHTML='<p class="text-danger text-center">'+data.Error+'</p>';
            setTimeout(() => {
              document.querySelector('#msg').innerHTML='';
            }, 10000);
          } else {
            console.log(data)
            localStorage.setItem("token", data.token)
            location.href ='/login-register'
          }
      });
  }
}

function resetPassword(){
  event.preventDefault();
  document.querySelector('#submit_forgot_password').innerHTML='<strong>Processing ...</strong>';
  var email = document.querySelector('#email_forgot_password').value;
  console.log(email)
  if (email.length < 1) {
    document.querySelector('#submit_forgot_password').innerHTML='Reset Password';
    document.querySelector('#msg').innerHTML='<p class="text-danger text-center">Invalid credentials</p>';
    setTimeout(() => {
      document.querySelector('#msg').innerHTML='';
    }, 10000);
  } else {
    $.ajax({
        url : '/reset-password',
        method: 'POST',
        dataType : "json",
        crossOrigin:true,
        // headers: {"Authorization":"5FA056D2706634F2B7C6FC66FE17517B"},
        data: {'email': email}
      })
      .done((data) => {
          if(data.status !== 200){
            console.log(data.Error)
            document.querySelector('#msg').innerHTML='<p class="text-danger text-center">'+data.Error+'</p>';
            setTimeout(() => {
              document.querySelector('#msg').innerHTML='';
            }, 10000);
            document.querySelector('#submit_forgot_password').innerHTML='Reset Password';
          } else {
            console.log(data)
            // localStorage.setItem("token", data.token)
            document.querySelector('#forgotpassword').innerHTML='<p>Check your mailbox for the further instruction</p>';
          }
      });
  }
}

function changePassword(){
  event.preventDefault();
  document.querySelector('#submit_change_password').innerHTML='<strong>Processing ...</strong>';
  var new_password = document.querySelector('#new_password').value;
  var confirm_new_password = document.querySelector('#confirm_new_password').value;
  var token = localStorage.getItem(token)
  if (new_password !== confirm_new_password) {
    document.querySelector('#submit_change_password').innerHTML='Change Password';
    document.querySelector('#msg').innerHTML='<p class="text-danger text-center">Invalid credentials</p>';
    setTimeout(() => {
      document.querySelector('#msg').innerHTML='';
    }, 10000);
  } else {
    $.ajax({
        url : '/change-password',
        method: 'POST',
        dataType : "json",
        crossOrigin:true,
        headers: {"Authorization":'Bearer '+token},
        data: {'email': email}
      })
      .done((data) => {
          if(data.status !== 200){
            console.log(data.Error)
            document.querySelector('#msg').innerHTML='<p class="text-danger text-center">'+data.Error+'</p>';
            setTimeout(() => {
              document.querySelector('#msg').innerHTML='';
            }, 10000);
            document.querySelector('#submit_change_password').innerHTML='Change Password';
          } else {
            console.log(data)
            // localStorage.setItem("token", data.token)
            document.querySelector('#changepassword').innerHTML='<p>Pasword changed successfully</p>';
          }
      });
  }
}