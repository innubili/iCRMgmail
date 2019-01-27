/**
 * Returns the array of cards that should be rendered for the current
 * e-mail thread. The name of this function is specified in the
 * manifest 'onTriggerFunction' field, indicating that this function
 * runs every time the add-on is started.
 *
 * @param {Object} e The data provided by the Gmail UI.
 * @return {Card[]}
 */
function buildAddOn(e) {
  // Activate temporary Gmail add-on scopes.
  var accessToken = e.messageMetadata.accessToken;
  GmailApp.setCurrentMessageAccessToken(accessToken);

  var messageId = e.messageMetadata.messageId;
  var message = GmailApp.getMessageById(messageId);
  
  // Build the main card after adding the section.
  var card = CardService.newCardBuilder()
    .setHeader(CardService.newCardHeader()
    .setTitle('iCRM')
    .setImageUrl('https://www.gstatic.com/images/icons/material/system/1x/dashboard_googblue_24dp.png'))
    .addSection(getPeopleSection(message))
    .build();

  return [card];
} 

function getPeopleSection(message){
  var section = CardService.newCardSection().setHeader("<font color=\"#1257e0\"><b>People</b></font>");  
  var people = getPeople(message);
  
  if (people.length > 0){
  
    // Create a checkbox group for people to add to CRM db
    var checkboxGroup = CardService.newSelectionInput()
    .setType(CardService.SelectionInputType.CHECK_BOX)
    .setFieldName('people')
    .setOnChangeAction(CardService.newAction().setFunctionName('togglePeople'));
    
    // Add checkbox with name and selected value for each person.
    for(var i in people) {
      var p = people[i];
      checkboxGroup.addItem(p.name + (p.account ? (' (' + p.account.name + ')') : ''), p.email, p.known);
    }
    
    // Add the checkbox group to the section.
    section.addWidget(checkboxGroup);
  } else {
    section.addWidget(CardService.newTextParagraph().setText('none'));
  }
  return section;
}

function togglePeople(e){
  var selected = e.formInputs.people;
  
  if (selected != null){
     
  }
  else {
   
  }
}

function getPeople(message){
  var ePeople = message.getTo().split('>')
        .concat(message.getCc().split('>'))
        .concat(message.getFrom().split('>'));
  var people = [];
  for (var i in ePeople){
    var e = ePeople[i].trim(); 
    if (e){
      if (e.indexOf('>') < 0) e += '>';  // add again email closure '>' rempved by split
      e = e.replace(', <','<').trim(); // remove leading commas
      var person = iCRM.getExternalPersonFromEmailField(e);  
      if (person && !person.known) {
        people.push(person);
      }
    }
  }
  return people;
}

