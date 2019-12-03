var token = localStorage.getItem('token')
console.log(token)
$.ajax({
  url:'/user-profile',
  method:"GET",
  dataType : "json",
  crossOrigin:true,
  headers: {"Authorization":'Bearer '+token},
})
.done((data)=>{
  console.log(data)
  var array = data.details
  document.querySelector("#profileResponse").innerHTML="username: " + data.details.username
})