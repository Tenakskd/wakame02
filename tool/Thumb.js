<!DOCTYPE html>
<html lang="ja">
<head>
  <meta charset="UTF-8">
  <title>URL入力</title>
<style>
body {
  font-family: 'Arial', sans-serif;
  background-color: #f4f4f4;
  color: #333;
  text-align: center;
  padding: 20px;
}

.nyuuryokuwakame {
  background-color: #ececec;
  border-radius: 10px;
  padding: 25px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
  max-width: 600px;
  margin: 0 auto;
}

h1 {
  font-size: 2.2rem;
  color: #4a4a4a;
  margin-bottom: 20px;
}

#goButton {
  background-color: #6b705c;
  color: white;
  padding: 12px 25px;
  border: none;
  border-radius: 5px;
  font-size: 1.1rem;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

#goButton:hover {
  background-color: #556b2f;
}

p {
  font-size: 1rem;
  color: #555;
}

br {
  margin-top: 20px;
}
</style>
</head>
<body>
  <div class="nyuuryokuwakame">
    <h1>YouTubeサムネ画像を取得</h1>
    <button id="goButton">URLを入力！</button>
    <p>動画のURLをコピーできたら、上のボタンを押して下さい。</p><br>
  </div>
  <script>
    document.getElementById('goButton').addEventListener('click', () => {
      const url = prompt('URLを入力して下さい');

      if (!url) {
        alert('URLが入力されていません');
        return;
      }
      
      const videoId = extractVideoId(url);
      
      const redirectUrl = `/vi/${videoId}/maxresdefault.jpg`;

      window.location.href = redirectUrl;
    });
    
    function extractVideoId(url) {
        const regExp = /^.*(?:youtu\.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
        const match = url.match(regExp);
        return (match && match[1].length == 11) ? match[1] : null;
    }
  </script>
</body>
</html>