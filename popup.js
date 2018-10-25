
// GET MOA JSON and populate selectors
$(document).ready(function() {
  var all_genes;
  var all_types;
  var all_classes;
  var all_therapies;
  var all_effects;
  var all_alterations;
  var all_implications;
  var typeahead_genes;


  // cleaner with .map ?

  $.getJSON('http://moalmanac.org/api/assertions', function(data){
      $.each(data, function (key, entry) {
          if (key=='disease') {
              all_types.append(entry);
          }
          if (key=='therapy_name') {
              all_therapies.append(entry);
          }
          if (key=='predictive_implication') {
              all_implications.append(entry)
          }
      });
  });

  $.getJSON('http://moalmanac.org/api/alterations', function(data){
      $.each(data, function (key, entry) {
          if (key=='gene_name') {
              all_genes.append(entry);
          }
          if (key=='feature') {
              all_classes.append(entry);
          }
          if (key=='alt_type') {
              all_effects.append(entry);
          }
          if (key=='alt') {
              all_alterations.append(entry);
          }

      typeahead_genes = [... new Set(gene_list)];
      var gene_list = $('#gene-input');

      });
  });


  var type_list = $('#type-select');
  var class_list = $('#class-select');
  var therapy_list = $('#therapy-select');
  var effect_list = $('#effect-select');
  var alteration_list = $('#alteration-input');
  var implication_list = $('#implication-select');
});



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
$('#btn-sub').click(function () {
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
    url: '',
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
    success: function (response) {
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
    error: function (response) {
      $('#error-panel').show();
      $('#error-text').html(JSON.parse(response.responseText).message);
      $('#success-panel').hide();
    }
  });
});
