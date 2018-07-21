var $buttons = $("footer").find("button")

$buttons.click(e => {
  $(".content").removeClass("hide");
  var $button = $(e.target);
  $buttons.removeClass("active");
  $button.addClass("active");
  var $content = $("footer > .content");
  var label = $button.text();
  switch (label) {
    case "about":
      $content.html(aboutHtml);
      break;
    case "inquiries":
      $content.html(inquiriesHtml);
      break;
    case "pronunciation":
      $content.html(pronunciationHtml);
      break;
    case "privacy":
      $content.html(privacyHtml);
      break;
    default:
      return;
  }
});

var aboutHtml = `<p>We are a software studio focused on:</p>
<ol>
  <li>Creating modular and extensible components for developers.</li>
  <li>Deliver memorable and engaging experiences for consumers.</li>
</ol>`;
var inquiriesHtml = ``;
var pronunciationHtml = ``;
var privacyHtml = ``;
