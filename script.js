/*
              _                        __                
          ___| |_ ___  _ __ _ __ ___  / _| ___  _ __ ___ 
         / __| __/ _ \| '__| '_ ` _ \| |_ / _ \| '__/ __|
        _\__ \ || (_) | |  | | | | | |  _| (_) | |  \__ \
       (_)___/\__\___/|_|  |_| |_| |_|_|  \___/|_|  |___/
      
       Script created by Felix @ Stormfors: www.stormfors.com
*/

/*-------------------------------------*/
/*            Variables                */
/*-------------------------------------*/

var Webflow = Webflow || [];
var QueryString;
var QueryParamObject;
var SerializedAnswers;
var ResultLink;
var EncodedLink;
var EmailResultsLink;
var GHLButtonID = "GHLButton";
var Domain = document.location.origin;
var Path = document.location.pathname;

/*-------------------------------------*/
/*            Initiate Script          */
/*-------------------------------------*/

Webflow.push(function () {
  $.get("http://127.0.0.1:5500/wheel.html", function (data) {
    $("#ajaxContent").append(data);
    if (window.location.href.includes("?redirect=true")) {
      const storedResults = localStorage.getItem("brandAssessmentResults");
      if (storedResults) {
        window.location.href = storedResults;
      }
    } else if (window.location.href.includes("?")) {
      readQueryParameters();
    }
  });
});

/*-------------------------------------*/
/*            Click Handler            */
/*-------------------------------------*/

$("#updatebtn").on("click", function () {
  submitForm();
});

/*-------------------------------------*/
/*            Main Functions           */
/*-------------------------------------*/

function readQueryParameters() {
  const url = document.location;
  QueryString = url.search
    ? url.search
    : url.hash
    ? url.hash.slice(url.hash.indexOf("?"))
    : "";
  QueryParamObject = new URLSearchParams(QueryString);
  ResultLink = Domain + Path + QueryString;
  updateWheel(QueryParamObject);
}

function updateWheel(queryParams) {
  queryParams.forEach(function (value, key) {
    $("#bWheel #shape-" + key + " path").attr("class", value);
    $("#bWheel #shape-" + key + " circle").attr("class", value);
  });

  showResults();
  hideAssesmentForm();
  setGHLButton();
}

function submitForm() {
  SerializedAnswers = $("#assesmentform").serialize();
  ResultLink = Domain + Path + "?" + SerializedAnswers;
  localStorage.setItem("brandAssessmentResults", ResultLink);
  /*   window.location.href = ResultLink; */
  openEmailForm();
}

/*-------------------------------------*/
/*             Utility Functions       */
/*-------------------------------------*/

function setGHLButton() {
  EncodedLink = encodeURIComponent(ResultLink);
  console.log("Encoded Link: ", EncodedLink);
  EmailResultsLink = `https://api.leadconnectorhq.com/widget/form/d2L5UYSVATSsqWTlUldY?result=${EncodedLink}`;
  console.log("Email Result Link: ", EmailResultsLink);
  let emailButton = document.getElementById(GHLButtonID);
  emailButton.setAttribute("href", EmailResultsLink);
  emailButton.setAttribute("target", "_blank");
}

function openEmailForm() {
  EncodedLink = encodeURIComponent(ResultLink);
  EmailResultsLink = `https://api.leadconnectorhq.com/widget/form/d2L5UYSVATSsqWTlUldY?result=${EncodedLink}`;
  window.location.href = EmailResultsLink;
}

function showResults() {
  $("#brandResults").removeClass("hide");
  $("#start")[0].scrollIntoView({ behavior: "smooth" });
}

function hideResults() {
  $("#brandResults").addClass("hide");
}

function hideAssesmentForm() {
  $("#brandAssesment").hide();
}

/*-------------------------------------*/
/*       URL Shortener Utility         */
/*-------------------------------------*/
