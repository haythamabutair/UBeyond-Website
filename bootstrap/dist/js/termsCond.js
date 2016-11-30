

//Fucntion to activate button when all terms are accepted
$(function(){
  $("input[name$='typeRad']").on('change',function() {
      //Mentee or mentor
       var userType = $(this).val();
       $("div.desc").hide();
       $("#"+userType +"Terms").show();
   });
});

$(function(){
  $(document).mousemove(function(){
    var allYes = true;
    //Check if mentee is picked
      if ($("input[name$='typeRad']:checked").val() == 'mentee') {

        $('#menteeTerms').children('.mentee-question').each(function() {

            if ($(this).find('input:radio:checked').val() == 'No' ||
                  !$(this).find('input:radio:checked').val()) {
                allYes = false;
            }
        });
      }else{
        //If Mentor is picked
        //Checks all radio buttons
        $('#mentorTerms').children('.mentor-radio').each(function() {

            if ($(this).find('input:radio:checked').val() == 'No' ||
                  !$(this).find('input:radio:checked').val()) {
                allYes = false;
            }
        });
      }

      if (allYes) {
        $('#termsAndCondBtn').removeAttr('disabled');
      } else {
        $('#termsAndCondBtn').attr('disabled', 'disabled');
      }
    })
});
