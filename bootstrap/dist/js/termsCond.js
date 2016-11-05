

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
        //Not on mentee anymore
        allYes = false;
      }

      if (allYes) {
        $('#termsAndCondBtn').removeAttr('disabled');
      } else {
        $('#termsAndCondBtn').attr('disabled', 'disabled');
      }
    })
});



var counter = 1; //start index
//clone is a button I created to clone the row
$(function(){
  $('#clone').click(function() {
    //clone the first row
    if(counter < 5){
      var newRow =  $('#references > .element').clone();
      counter++;
      newRow.find('#reference-1').attr('id','reference-' + counter)
      newRow.find('#reference-'+counter).text('Reference-'+counter)
      //insert the new row after the last one
      $('#references > .element').after(newRow);
    }
  });
});
