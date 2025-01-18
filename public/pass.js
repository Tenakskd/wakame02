
  document.body.style.display = 'none';
  window.onload = function() {
    var userInput = null;
    var cookies = document.cookie;
    var cookiesArray = cookies.split(';');
    var validPasswords = ['massiro','wakame02','わかめtube','わかめうまい','aihiaihi','わかめ02','1108','Harmicelli','春雨']; 

    for (var c of cookiesArray) {
      var cArray = c.split('=');
      if (cArray[0].trim() === 'cruw-basic') {
        userInput = decodeURIComponent(cArray[1]);
      }
    }

    if (!validPasswords.includes(userInput)) { 
      userInput = prompt("パスワードを入力して下さい:", "");
    }

    if (!validPasswords.includes(userInput)) {
      document.body.innerHTML = "認証失敗";
    } else {
      var now = new Date();
      now.setDate(now.getDate() + 7);
      document.cookie = "cruw-basic=" + encodeURIComponent(userInput) + ";expires=" + now.toUTCString() + "; path=/;";
    }

    document.body.style.display = null;
  }