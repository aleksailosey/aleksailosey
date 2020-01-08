var selected = false;
var toggleAltMenu = function () {
  var altMenu = document.getElementsByClassName('alt_menu')[0];
  if (selected) {
    altMenu.style.display = 'none';
    document.body.classList.remove('body_no_scroll');
  } else {
    altMenu.style.display = 'flex';
    document.body.classList.add('body_no_scroll');
  }
  selected = !selected;
}

window.addEventListener('resize', function () {
  var win     = window,
      doc     = document,
      docElem = doc.documentElement,
      body    = doc.getElementsByTagName('body')[0],
      x       = win.innerWidth || docElem.clientWidth || body.clientWidth;
  var altMenu = document.getElementsByClassName('alt_menu')[0];
  if (x > 800) {
    selected = false;
    altMenu.style.display = 'none';
  }
});

var suggestBook = function () {
  var wrap = document.getElementsByClassName('suggestion_wrap')[0];
  if (wrap) {
    wrap.style.display = 'flex';
  }
}

var pushBook = function () {
  var title = document.getElementById('title'),
      link  = document.getElementById('link');
  if (link && link.value && title && title.value) {
    if (validURL(link.value)) {
      req({
        url: '/books/push',
        data: {
          title: title.value.trim(),
          link: link.value.trim()
        },
        success: function (response) {
          if (response === true) {
            document.getElementById('list').innerHTML += `
            <a href='${link.value.trim()}' class='body_font middle_size blue book_item' target='_blank'>${title.value.trim()}</a>
            `;
            var wrap = document.getElementsByClassName('suggestion_wrap')[0];
            if (wrap) {
              wrap.style.display = 'none';
              title.value = '';
              link.value = '';
            }
          } else {
            alert('Book has already been suggested');
            title.value = '';
            link.value = '';
          }
        }
      });
    } else {
      alert('Invalid URL');
      link.value = '';
    }
  } else {
    alert('Please fill out both fields');
  }
}

function validURL(str) {
  return /^(https?|ftp):\/\/(((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:)*@)?(((\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5]))|((([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)+(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.?)(:\d*)?)(\/((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)+(\/(([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)*)*)?)?(\?((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)|[\uE000-\uF8FF]|\/|\?)*)?(\#((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)|\/|\?)*)?$/i.test(str);
}
