import express from 'express'
import { Liquid } from 'liquidjs';

// Vul hier jullie team naam in
const teamName = 'Rocket';

const app = express()
app.use(express.static('public'))
const engine = new Liquid();
app.engine('liquid', engine.express()); 
app.set('views', './views')
app.use(express.urlencoded({extended: true}))



// MESSAGES
let messages = []
// messages.push("hoi ik ben een bericht","het tweede bericht","het derde bericht")
app.get('/berichten', async function (request, response) {
  response.render('messages.liquid', {
    // persons: personResponseJSON.data, 
    messages: messages
  })
})
app.post('/berichten', async function (request, response) {
//data verwerken
  messages.push(request.body.tekstje)
  response.redirect(303, '/berichten')
})




app.get('/', async function (request, response) {
  const messagesResponse = await fetch(`https://fdnd.directus.app/items/messages/?filter={"for":"Team ${teamName}"}`)
  const messagesResponseJSON = await messagesResponse.json()

  response.render('index.liquid', {
    teamName: teamName,
    messages: messagesResponseJSON.data
  })
})

app.post('/', async function (request, response) {
  await fetch('https://fdnd.directus.app/items/messages/', {
    method: 'POST',
    body: JSON.stringify({
      for: `Team ${teamName}`,
      from: request.body.from,
      text: request.body.text
    }),
    headers: {
      'Content-Type': 'application/json;charset=UTF-8'
    }
  });

  response.redirect(303, '/')
})



app.set('port', process.env.PORT || 8001)
app.listen(app.get('port'), function () {
  console.log(`Application started on http://localhost:${app.get('port')}`)
})

// if (teamName == '') {
//   console.log('Voeg eerst de naam van jullie team in de code toe.')
// } else {
//   app.listen(app.get('port'), function () {
//     console.log(`Application started on http://localhost:${app.get('port')}`)
//   })
// }