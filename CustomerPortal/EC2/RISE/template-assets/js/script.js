function Captcha(){
       console.log("session");
    var ArrayData = [];    
    if(sessionStorage.getItem("cart") == null){
                sessionStorage.setItem("cart",JSON.stringify(ArrayData));
    }
                     var alpha = new Array('A','B','C','D','E','F','G','H','I','J','K','L','M','N','O','P','Q','R','S','T','U','V','W','X','Y','Z','a','b','c','d','e','f','g','h','i','j','k','l','m','n','o','p','q','r','s','t','u','v','w','x','y','z');
                     var i;
                     for (i=0;i<6;i++){
                       var a = alpha[Math.floor(Math.random() * alpha.length)];
                       var b = alpha[Math.floor(Math.random() * alpha.length)];
                       var c = alpha[Math.floor(Math.random() * alpha.length)];
                       var d = alpha[Math.floor(Math.random() * alpha.length)];
                       var e = alpha[Math.floor(Math.random() * alpha.length)];
                       var f = alpha[Math.floor(Math.random() * alpha.length)];
                       var g = alpha[Math.floor(Math.random() * alpha.length)];
                      }
                    var code = a + b + c + d + e+ f + g;
                    document.getElementById("mainCaptcha").value = code
                  }
                  function ValidCaptcha(){
                      var string1 = removeSpaces(document.getElementById('mainCaptcha').value);
                      var string2 = removeSpaces(document.getElementById('txtInput').value);
                      if (string1 == string2){
                        return true;
                      }
                      else{        
                        return false;
                      }
                  }
                  function removeSpaces(string){
                    return string.split(' ').join('');
                  }

                  function gotologin(){
                  	console.log("I am here!!!!");
                  	document.getElementById('register').style.display = 'none';
                  	console.log("here-----", document.getElementById('register'));
                  	document.getElementById('login').style.display = 'block';
                  	console.log("here2-----", document.getElementById('login'));
                  }

                  function gotoregister(){
                  	document.getElementById('register').style.display = 'block';
                  	document.getElementById('login').style.display = 'none';
                  }

                  function checkPassword(){
                    console.log("Here========1");
                    var p1 = document.getElementById("Password").value;
                    var p2 = document.getElementById("Checkpassword").value;
                    console.log("Here========2" + p1 +p2);
                    if(p1 == p2){
                        return true;
                    }
                    return false;
                  }
        

                  function register(){

                    var payload = { 
                                name: $('#Name').val(),
                                password: $('#Password').val(),
                                email : $('#Email').val()
                            };
                      if(checkPassword() == true){
                            $.ajax({
                                url: "/users",
                                type: "POST",
                                contentType: "application/json",
                                processData: false,
                                data: JSON.stringify(payload),
                                complete: function (data) {
                                    res = data.responseText;
                                    if(res == "USER ERROR"){
                                        alert("Username in use. Please Re-enter Username.");
                                    }
                                    else if(res == "MAIL ERROR"){
                                        alert("E-mail in use. Please Re-enter E-mail.");
                                    }
                                    else if(res == "OK"){
                                        gotologin();
                                        alert("Member added. Please Login.")
                                    }
                                }
                            }); 
                      }
                      else {
                          document.getElementById("Checkpassword").value = "";
                          alert("Please enter matching passwords.");
                      }
                  }

                function getUser(){
                    console.log("inside getuser");
                    $.ajax({
                            url: "/getuser",
                            type: "POST",
                            contentType: "application/json",
                            processData: false,
                            complete: function (data , err) {
//                                if(err) throw err;
                                res = data.responseText;
                                
//                                if(err) throw err;
                                console.log("User is: ", res);
                                document.getElementById("loginUser").innerHTML = res;
                            }
                     });  
                }

           

                function login(){
                    var val = ValidCaptcha();
                    if(val == true){
                                    
                                var payload= { 
                                name: $('#LoginName').val(),
                                password: $('#LoginPassword').val()
                            };
                                  $.ajax({
                                                url: "/login",
                                                type: "POST",
                                                contentType: "application/json",
                                                processData: false,
                                                data: JSON.stringify(payload),
                                                complete: function (data , err) {
//                                                    if(err) throw err;
                                                    res = data.responseText;
                                                    if(res == "ERROR"){
                                                        
                                                        alert("Please check Username and Password.");
                                                    }
                                                    else {
                                                        sessionStorage.setItem("loggedInAs",$('#LoginName').val());
                                                        alert("Successfully Logged in.");
                                                    }
                                                }
                                         });  
//                                $.ajax({
//                                                url: "/getuser",
//                                                type: "POST",
//                                                contentType: "application/json",
//                                                processData: false,
//                                                complete: function (data) {
//                                                    res = data.responseText;
//                                                    console.log("Getuser res for login===>", res);
//                                                    if(res == "Guest"){
//                                                        document.getElementById('loginUser').innerHTML = 'Guest';
//                                                    } 
//                                                    else document.getElementById('loginUser').innerHTML = res.toString;
//                                                }
//                                         });        
                                      
                    }
                    else {
                        alert("Please check and re-enter captcha.");
                    }
                    location.reload();
                } 

            function logout(){
               $.ajax({
                                                url: "/logout",
                                                type: "POST",
                                                contentType: "application/json",
                                                processData: false,
                                                complete: function (data , err) {
//                                                    if(err) throw err;
                                                    res = data.responseText;
                                                    if(res == "OK"){
                                                        sessionStorage.removeItem('loggedInAs');
                                                        alert("Logged Out!");
//                                                        document.getElementById('loginUser').innerHTML = 'Guest';
                                                    }
                                                   else{
                                                       alert("Unseccessful Logout. Please try again.");
                                                       
                                                   }
                                                }
                                         }); 
                location.reload();
            }


