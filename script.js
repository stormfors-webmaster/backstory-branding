var assessmentAnswers;
var emailResultsLink;
var qs;
// var queryString = new URLSearchParams(document.location.search);

const url = document.location;
const urlParameters = url.search
  ? url.search
  : url.hash
  ? url.hash.slice(url.hash.indexOf("?"))
  : "";
const queryString = new URLSearchParams(urlParameters);
console.log(queryString);

function showWheel() {
  $(".questions, .stepIndicators").hide();
  $(".results").fadeIn();
  $("#zion").scrollIntoView();
}

$(function () {
  //check to see if coming from a share link. If so, immediately show wheel
  // console.log(window.location.href.includes("?"))

  if (window.location.href.includes("?")) {
    console.log("COMING FROM A LINK!");
    updateWheel(queryString);
    $("#mainImage").hide();
    showWheel();
  }

  $(".nxtBtn").on("click", function (e) {
    e.preventDefault();
    $("#mainImage").hide();

    // Hide FAQ section and footer, to make sure they don't appeare while the new
    // questions are loding in after clicking the Next button (that looked like a glitch)
    $("#faqsectionid").css("opacity", "0");
    $("#footerid").css("opacity", "0");

    // Scroll up to #start, because it looks better, and not less glitchy after clicking the next button
    $("#start")[0].scrollIntoView({ behavior: "smooth" });

    var nextFieldset = $(this).parents("fieldset").next("fieldset");
    $(this)
      .parents("fieldset")
      .fadeOut(function () {
        $(nextFieldset).slideDown();
        $(".crumb").removeClass("active");
        $(".crumb")
          .eq($("#assessment fieldset:visible").index())
          .addClass("active");
        $(".assessmentBreadcrumb")
          .siblings("h2")
          .text($(".crumb.active").text());
      });

    // Show the FAQ section and footer after clicking the next button,
    // after 1000 ms delay, so that they are not shown too early
    const glitchTimeout = setTimeout(glitchTimeoutFunction, 1000);
    function glitchTimeoutFunction() {
      $("#faqsectionid").css("opacity", "100");
      $("#footerid").css("opacity", "100");
    }
  });

  $(".subBtn").on("click", function (e) {
    e.preventDefault();

    // TODO: LET THE COPYING BEGIN ❣️️️️️️️

    // save the following Webflow Form INPUTS => Name, Company Name, Email
    const webflowFormNameValue = $("#field1").val();
    const webflowFormCompanyNameValue = $("#field4").val();
    const webflowFormEmailValue = $("#field2").val();

    // console.log(webflowFormNameValue);
    // console.log(webflowFormCompanyNameValue);
    // console.log(webflowFormEmailValue);

    // SELECT THE ACTIVE CAMPAIGN INPUTS
    const activeCampaignName = $("._x74134925 input");
    const activeCampaignCompanyName = $("._x33585044 input");
    const activeCampaignEmail = $("#email");
    const activeCampaignWheelResultsLink = $("._x78823800 input");
    const activeCampaignSubmitButton = $("._submit");

    // console.log(activeCampaignName);
    // console.log(activeCampaignCompanyName);
    // console.log(activeCampaignEmail);

    // console.log($("#assessment").serialize());

    // ❗️ REMOVE AFTER TESTING
    // activeCampaignName.val(webflowFormNameValue);
    // activeCampaignCompanyName.val(webflowFormCompanyNameValue);
    // activeCampaignEmail.val(webflowFormEmailValue);
    // assessmentAnswers = $("#assessment").serialize();
    // qs = new URLSearchParams(assessmentAnswers);
    // activeCampaignWheelResultsLink.val(document.location.href + "?" + qs.toString())
    // return;

    // submit lead form data
    var leadFormData = new FormData();

    var leadFormIsValid = true;

    // check validity of form data and add to post
    for (var i = 0; i < $(".leadForm input").length; i++) {
      var formInput = $(".leadForm input").eq(i);
      if (!$(formInput)[0].checkValidity()) {
        leadFormIsValid = false;
      }
      leadFormData.append($(formInput).attr("id"), $(formInput).val());
    }

    if (leadFormIsValid) {
      console.log("lead form is valid");

      // form is valid so hide questions and show wheel results

      // ❗️ UNCOMMENT!!
      $(".questions").slideUp(function () {
        $(".stepIndicators").hide();
        $(".results").fadeIn();
      });

      console.log($("#assessment").serialize());

      assessmentAnswers = $("#assessment").serialize();
      let pageUrl =
        "https://www.backstorybranding.com/dev/brand-assesment-dev-2?";
      let encodedPageUrl = encodeURIComponent(pageUrl);
      qs = new URLSearchParams(assessmentAnswers);
      let encodedAnswers = encodeURIComponent(assessmentAnswers);
      const encodedValue = encodedPageUrl + encodedAnswers;
      console.log(encodedValue);
      emailResultsLink = `https://api.leadconnectorhq.com/widget/form/d2L5UYSVATSsqWTlUldY?result=${encodedValue}`;
      let emailButton = document.getElementById("email-results-button");
      console.log(emailResultsLink);
      emailButton.setAttribute("href", emailResultsLink);

      // COPY THE VALUES AND RESULTS INTO THE AC FORM
      activeCampaignName.val(webflowFormNameValue);
      activeCampaignCompanyName.val(webflowFormCompanyNameValue);
      activeCampaignEmail.val(webflowFormEmailValue);
      assessmentAnswers = $("#assessment").serialize();
      qs = new URLSearchParams(assessmentAnswers);
      activeCampaignWheelResultsLink.val(
        document.location.href + "?" + qs.toString()
      );

      console.log(document.location.href + "?" + qs.toString());

      console.log(qs);

      // ❗️ UNCOMMENT!!
      updateWheel(qs);

      // return;

      // SUBMIT THE ACTIVE CAMPAIGN FORM NOW
      activeCampaignSubmitButton.click();

      //add link back to finished brand wheel
      leadFormData.append("field5", "A new brand assessment submission");
      leadFormData.append(
        "field6",
        document.location.href + "?" + qs.toString()
      );
      $.ajax({
        type: "POST", //From the form method
        url: "https://backstorybranding38046.activehosted.com/proc.php",
        data: leadFormData, // serializes the form's elements.
        processData: false,
        contentType: false,
        success: function (data) {
          // redirect to thank-you page
          console.log("lead form successfully sent");
        },
      });
    } else {
      $(".leadForm input").each(function () {
        $(this)[0].reportValidity();
      });
    }
  });

  $(".prevBtn").on("click", function (e) {
    e.preventDefault();
    var prevFieldset = $(this).parents("fieldset").prev("fieldset");
    console.log("fieldset index = " + $(prevFieldset).index());

    // Hide FAQ section and footer, to make sure they don't appeare while the new
    // questions are loding in after clicking the previous button (that looked like a glitch)
    $("#faqsectionid").css("opacity", "0");
    $("#footerid").css("opacity", "0");

    // Scroll up to #start, because it looks better, and not less glitchy after clicking the previous button
    $("#start")[0].scrollIntoView({ behavior: "smooth" });

    $(this)
      .parents("fieldset")
      .fadeOut(function () {
        $(prevFieldset).slideDown();
        $(".crumb").removeClass("active");
        $(".crumb")
          .eq($("#assessment fieldset:visible").index())
          .addClass("active");
      });

    // Show the FAQ section and footer after clicking the next button,
    // after 1000 ms delay, so that they are not shown too early
    const glitchTimeout = setTimeout(glitchTimeoutFunction, 1000);
    function glitchTimeoutFunction() {
      $("#faqsectionid").css("opacity", "100");
      $("#footerid").css("opacity", "100");
    }
  });

  $("#bWheel [id^='shape-']").on("click", function () {
    $(".well.description").fadeIn();
    var shape = $(this).attr("id").split("shape-").pop();
    $(".well").html(
      "<h4 class='text-primary'>" +
        shape.replace("--", "/").replace(/-/g, " ") +
        "</h4><p>" +
        $("input[name=" + shape + "]")
          .parents(".form-group")
          .children("label")
          .text() +
        "</p>"
    );
  });
});

function updateWheel(answers) {
  console.log("update wheel running...");
  console.log(answers);

  answers.forEach(function (value, key) {
    //console.log("#bWheel #shape-" + key + " gets this class " + value);
    $("#bWheel #shape-" + key + " path").attr("class", value);
    $("#bWheel #shape-" + key + " circle").attr("class", value);
  });

  $(".shareWheel").attr(
    "href",
    "mailto:contact@backstory.com?subject=Check+out+my+Brand+Wheel&body=" +
      encodeURIComponent(document.location.href + "?" + answers.toString())
  );

  console.log($("#showAfterSub"));

  $("#zion")[0].scrollIntoView({ behavior: "smooth" });
}
