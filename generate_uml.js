const plantumlEncoder = require('plantuml-encoder');
const axios = require('axios');
const fs = require('fs');

const uml = `
@startuml
skinparam backgroundColor white
skinparam padding 5

title RVF-VMS System Architecture & Data Flow

actor Supplier
node "Central Stock\\n(Receives & Logs)" as Central
node "Zipline\\n(Main Hub)" as Zip
node "Sector\\n(Intermediate Hub)" as Sec
actor "Veterinary\\n(End User)" as Vet

== Physical Vaccine Distribution Flow (Top-Down) ==
Supplier -> Central : Delivers physical vaccines
activate Central
Central -> Central : Logs batch, converts currency
Central -> Zip : Distributes Stock
activate Zip
Zip -> Sec : Distributes Stock
activate Sec
Sec -> Vet : Distributes Stock
activate Vet

== Request & Approval Workflow (Bottom-Up) ==
Vet -> Sec : Submits Request
Sec -> Zip : Submits Request
Zip -> Central : Submits Request
Central -> Central : Approves Request

Central --> Zip : Transfers Stock
Zip -> Central : Approves Delivery

Zip --> Sec : Transfers Stock
Sec -> Zip : Approves Delivery

Sec --> Vet : Transfers Stock
Vet -> Sec : Approves Delivery

deactivate Vet
deactivate Sec
deactivate Zip
deactivate Central
@enduml
`;

const encoded = plantumlEncoder.encode(uml);
axios({
  method: 'get',
  url: 'http://www.plantuml.com/plantuml/png/' + encoded,
  responseType: 'stream'
})
.then(function (response) {
  response.data.pipe(fs.createWriteStream('System_Architecture.png'))
    .on('finish', () => {
      console.log('Successfully downloaded System_Architecture.png');
      process.exit(0);
    });
})
.catch(function (error) {
  console.error('Error downloading image:', error.message);
  process.exit(1);
});
