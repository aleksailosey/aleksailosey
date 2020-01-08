var req = function (options) {
  var xhr   = new XMLHttpRequest(),
      url    = options.url,
      o      = true;
  xhr.onreadystatechange = function () {
    if (xhr.readyState === 4 && xhr.status === 200) {
      if (xhr.responseText && o) {
        o = false;
        if (options.success) {
          var response;
          try {
            response = JSON.parse(xhr.responseText);
          } catch (error) {
            response = xhr.responseText;
          } finally {
            options.success(response);
            o = false;
          }
        }
      }
    }
  }
  xhr.open('post', url, true);
  xhr.setRequestHeader('Content-type', 'application/json');
  xhr.setRequestHeader('X-Requested-With', 'XMLHttpRequest');
  xhr.send(JSON.stringify(options.data));
}
