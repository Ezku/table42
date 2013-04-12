// always put everything inside PhoneGap deviceready
document.addEventListener("deviceready", function() {

  $(".opensLayer").on("tap", function() {
    var webView = new steroids.views.WebView(this.getAttribute("data-location"));
    steroids.layers.push(webView);
  });

  $(".opensModal").on("tap", function() {
    var modalWebView = new steroids.views.WebView(this.getAttribute("data-location"));
    steroids.modal.show(modalWebView);
  });

  $(".closesModal").on("tap", function() {
    steroids.modal.hide();
  });

});
