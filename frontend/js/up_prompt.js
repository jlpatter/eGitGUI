const ipcRenderer = require('electron').ipcRenderer;

class UPPrompt {
  run() {
    window.addEventListener('DOMContentLoaded', () => {
      $('#loginBtn').click(function() {
        ipcRenderer.send('login-message', [$('#usernameTxt').val(), $('#passwordTxt').val()]);
        window.close();
      });

      $('#cancelBtn').click(function() {
        window.close();
      });
    });
  }
}

new UPPrompt().run();
