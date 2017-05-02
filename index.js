const app = require('express')();
const srv = require('http').createServer(app);
const cookieParser = require('cookie-parser');

app.use(cookieParser());

app.get("/cookie-page", (req, res) => {
  res.set('content-type', 'text/html');
  res.cookie('random-number', Math.random());
  
  res.send(`<!DOCTYPE html>
    <body>
      <script>
        function addTextToBody(text) {
          const div = document.createElement('div');
          div.textContent = text;
          document.body.appendChild(div);
        }
      </script>
      <script type="module" src="cookie-script"></script>
      <script type="module" crossorigin src="cookie-script?"></script>
    </body>
  `);
});

app.get("/cookie-script", (req, res) => {
  const randomNumberCookie = req.cookies && req.cookies['random-number'];

  if (randomNumberCookie) {
    res.send(`addTextToBody("Random number cookie is: ${randomNumberCookie}")`);
  }
  else {
    res.send(`addTextToBody("No random number cookie found.")`);
  }
});

app.get("/no-cors", (req, res) => {
  res.set('content-type', 'application/javascript');
  res.send(`addTextToBody("This shouldn't execute - no CORS headers.")`);
});

app.get("/cors", (req, res) => {
  res.set('content-type', 'application/javascript');
  res.set('access-control-allow-origin', '*');
  res.send(`addTextToBody("Successfully executed cross-origin script.")`);
});

srv.listen(3030, function () {
  console.log('Listening on 3030');
});