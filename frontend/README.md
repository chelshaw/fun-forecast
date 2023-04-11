# fun-forecast-frontend

This README outlines the details of collaborating on this Ember application.
A short introduction of this app could easily go here.

## Prerequisites

You will need the following things properly installed on your computer.

- [Git](https://git-scm.com/)
- [Node.js](https://nodejs.org/)
- [Yarn](https://yarnpkg.com/)
- [Ember CLI](https://cli.emberjs.com/release/)
- [Google Chrome](https://google.com/chrome/)

## Installation

- `git clone <repository-url>` this repository
- `cd fun-forecast-frontend`
- `yarn install`

## Running / Development

- `yarn start` (or `ember serve`)
- Visit your app at [http://localhost:4200](http://localhost:4200).
- Visit your tests at [http://localhost:4200/tests](http://localhost:4200/tests).

### Code Generators

Make use of the many generators for code, try `ember help generate` for more details

### Running Tests

- `ember test`
- `ember test --server`

### Linting

- `yarn lint`
- `yarn lint:fix`

### Building

- `ember build` (development)
- `ember build --environment production` (production)

### Deploying

Deployment should happen automatically when a merge happens to `release/*` branches. However, in the case that you need to perform a deploy from a local machine take the following steps: 

- Make sure .env has the appropriate keys. Copy the example env file and fill in the missing values.
`cp .example-env .env`

- Set env variable so the deploy pipeline knows to use the .env file `export FF_LOCAL_DEPLOY=1`
- `yarn deploy:prod` 
- Done!

## Further Reading / Useful Links

- [ember.js](https://emberjs.com/)
- [ember-cli](https://cli.emberjs.com/release/)
- Development Browser Extensions
  - [ember inspector for chrome](https://chrome.google.com/webstore/detail/ember-inspector/bmdblncegkenkacieihfhpjfppoconhi)
  - [ember inspector for firefox](https://addons.mozilla.org/en-US/firefox/addon/ember-inspector/)

### Later

- [ ] Create calendar event
- [ ] Customize my own activity schema ($/schema)
- [ ] Invite a friend
- [ ] See local events ($)
