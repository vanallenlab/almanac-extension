var all_genes = new Set();
var all_types = new Set();
var all_classes = new Set();
var all_therapies = new Set();
var all_effects = new Set();
var all_alterations = new Set();
var all_implications = new Set();
var typeahead_genes = all_genes;


// GET MOA JSON and populate selectors
$(document).ready(function() {

  var type_selector = $('#type-select');
  var class_selector = $('#class-select');
  var therapy_selector = $('#therapy-select');
  var effect_selector = $('#effect-select');
  // var alteration_selector = $('#alteration-input');
  var implication_selector = $('#implication-select');

  // cleaner with .map ?

  $.getJSON('api/assertions.json', function(data) {
          $.each(data, function (key, entry) {
              all_types.add(entry['disease']);
              all_therapies.add(entry['therapy_name']);
              all_implications.add(entry['predictive_implication']);
          });
          populateSelector(type_selector, all_types);
          populateSelector(therapy_selector, all_therapies);
          populateSelector(implication_selector, all_implications);
  });

  $.getJSON('api/alterations.json', function(data) {
      $.each(data, function (key, entry) {
          all_genes.add(entry['gene_name']);
          all_classes.add(entry['feature']);
          all_effects.add(entry['alt_type']);
          // all_alterations.add(entry['alt']);
      });
      populateSelector(class_selector, all_classes);
      populateSelector(effect_selector, all_effects);
      // populateSelector(alteration_selector, all_alterations)
  });

  function populateSelector(selector, set_of_all) {

      let array_of_all = Array.from(set_of_all).sort();
      array_of_all.forEach(function (option) {
          if (!option == (null || "")) {
              selector.append("<option value='" + option + "'>" + option + "</option>");
          }
      })
  }



$('#btn-sub').click(function () {
  // Selectors
  var implication_select = $('#implication-select')[0];
  var type_select = $('#type-select')[0]; //type of cancer
  var therapy_select = $('#therapy-select')[0];
  var class_select = $('#class-select')[0]; // e.g. rearrangement, CNV
  var effect_select = $('#effect-select')[0]; // e.g. missense, amplification
  var alteration_input = $('#alteration-input')[0];
  var source_input = $('#source-input')[0];
  var gene_input = $('#gene-input')[0];
  var email_input = $('#email-input')[0];

  // Reactions
  var therapy = therapy_select.value;
  var type =  type_select.value;
  var implication =  implication_select.value;
  var source = source_input.value;
  var gene = gene_input.value;
  var alt_class = class_select.value;
  var alteration = alteration_input.value;
  var effect = effect_select.value;
  var email = email_input.value;
  $.ajax({
    type: "POST",
    url: "http://localhost:5000/submit",
    data: {
      'therapy': therapy,
      'type': type,
      'implication': implication,
      'source': source,
      'gene': encodeURIComponent(gene),
      'effect': effect,
      'class': alt_class,
      'alteration': alteration,
      'email': encodeURIComponent(email)
    },
    dataType: 'json',
    // contentType: "application/json",
    crossDomain: true,
    success: function (response) {
        console.log(response);
      $('#success-panel').show();
      dict = JSON.parse(JSON.parse(response).message);
      $('#success-text').html("<b></br>Email: " + decodeURIComponent(dict.email) +
                              "</br>Therapy: " + dict.therapy +
                              "</br> Implication: " + dict.implication +
                              "</br> Gene: " + decodeURIComponent(dict.gene) +
                              "</br> Type: " + dict.type +
                              "</br> Class: " + dict.alt_class +
                              "</br> Effect: " + dict.effect +
                              "</br> Alteration: " + dict.alteration +
                              "</br> DOI: " + dict.source + "</b>");
      $('#error-panel').hide();
    },
    error: function (response, textStatus, errorThrown) {
        console.log(response, textStatus, errorThrown);
      $('#error-panel').show();
      $('#error-text').html(JSON.parse(response.responseText));
      $('#success-panel').hide();
    }
  });
});

});