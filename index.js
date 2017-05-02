const app = require('express')();
const cookieParser = require('cookie-parser');

app.use(cookieParser());

app.get("/cookie-page", (req, res) => {
  res.set('content-type', 'text/html');
  res.set('cache-control', 'no-cache');
  res.cookie('random-number', Math.random());

  res.send(`<!DOCTYPE html>
    <meta name="viewport" content="width=device-width, minimum-scale=1.0">
    <body>
      <script>
        function addTextToBody(text) {
          const div = document.createElement('div');
          div.textContent = text;
          document.body.appendChild(div);
        }
      </script>
      <script type="module" src="cookie-script"></script>
      <script type="module" crossorigin src="cookie-script?1"></script>
      <script type="module" crossorigin="use-credentials" src="cookie-script?2"></script>
    </body>
  `);
});

app.get("/mime", (req, res) => {
  res.set('content-type', 'text/html');
  res.set('cache-control', 'no-cache');
  res.send(`<!DOCTYPE html>
    <meta name="viewport" content="width=device-width, minimum-scale=1.0">
    <body>
      <script>
        function addTextToBody(text) {
          const div = document.createElement('div');
          div.textContent = text;
          document.body.appendChild(div);
        }
      </script>
      <script type="module" src="correct-mime"></script>
      <script type="module" src="incorrect-mime"></script>
    </body>
  `);
});

app.get("/async", (req, res) => {
  res.set('content-type', 'text/html');
  res.set('cache-control', 'no-cache');
  res.send(`<!DOCTYPE html>
    <meta name="viewport" content="width=device-width, minimum-scale=1.0">
    <body>
      <script>
        function addTextToBody(text) {
          const div = document.createElement('div');
          div.textContent = text;
          document.body.appendChild(div);
        }
      </script>
      <script type="module" async src="slow"></script>
      <script type="module" async>
        import "./slow?";
        addTextToBody("Inline-slow executed");
      </script>
      <script type="module" async src="fast"></script>
      <script type="module" async>
        import "./fast?";
        addTextToBody("Inline-fast executed");
      </script>
    </body>
  `);
});

app.get("/cookie-script", (req, res) => {
  const randomNumberCookie = req.cookies && req.cookies['random-number'];
  res.set('cache-control', 'no-cache');
  res.set('content-type', 'application/javascript');

  if (randomNumberCookie) {
    res.send(`addTextToBody("Random number cookie is: ${randomNumberCookie}")`);
  }
  else {
    res.send(`addTextToBody("No random number cookie found.")`);
  }
});

app.get("/no-cors", (req, res) => {
  res.set('cache-control', 'no-cache');
  res.set('content-type', 'application/javascript');
  res.send(`addTextToBody("This shouldn't execute - no CORS headers.")`);
});

app.get("/cors", (req, res) => {
  res.set('cache-control', 'no-cache');
  res.set('content-type', 'application/javascript');
  res.set('access-control-allow-origin', '*');
  res.send(`addTextToBody("Successfully executed cross-origin script.")`);
});

app.get("/correct-mime", (req, res) => {
  res.set('cache-control', 'no-cache');
  res.set('content-type', 'application/javascript');
  res.send(`addTextToBody("This script should execute")`);
});

app.get("/incorrect-mime", (req, res) => {
  res.set('cache-control', 'no-cache');
  res.set('content-type', 'text/plain');
  res.send(`addTextToBody("This script should not execute")`);
});

app.get("/fast", (req, res) => {
  res.set('cache-control', 'no-cache');
  res.set('content-type', 'application/javascript');
  res.send(`addTextToBody("Fast script executed")`);
});

app.get("/slow", (req, res) => {
  res.set('cache-control', 'no-cache');
  res.set('content-type', 'application/javascript');

  setTimeout(() => {
    res.send(`addTextToBody("Slow script executed")`);
  }, 1000);
});

module.exports = app;