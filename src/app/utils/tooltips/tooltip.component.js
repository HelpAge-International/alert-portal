/**
 * Created by jordan on 21/06/2017.
 */
$(document).ready(function() {
  $(document).click(function(e) {
    var target = e.target;

    if (!$(target).is('.Info__icon') && !$(target).parents().is('.Info__icon')) {
      $('.Info__bubble').fadeOut();
    }
  });

  $(".Info__icon").click(function() {
    console.log("Called!");
    $(".Info__bubble").fadeIn();
  });

  $(".Extend__span").click(function() {
    $(this).toggleClass('Active');
    $(".Extended__content").slideToggle()
    $(".Info__bubble").toggleClass('Active');
  });

});
