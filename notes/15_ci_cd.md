1hr 50min
## Introduction to CI and CD
 Dev Processes include
  - git standards
 
 Quality Processes include
  - os / node versioning support
  - release / update schedules
  - automations
    - deploymenmt

Continuous Integration + Continuous Delivery
- quality control best practices
- development practices that delivers better software and code
- doesn't leave the testing til the end
  - checks along the way
also note: continuous deployment


## Continuous Integration
process implementing software dev best practices for testing our code
- frequent commits to a shared repo
- reduces the number of errors and associated debugging time 
- ensures the code works in diff envs
- tests codes regularly
- releases code daily
- enhances collaboration efforts
- can include linting and security scans

tech tools:  circle, travis ci, jenkins

CI Flow:

Dev writes code and tests locally
        |
Code committed and pushed to source repo
        |
pushes trigger CI Server which => Builds >> Tests >> Result
        |
red tests sent back to dev to fix


## Continuous Delivery
process builds on CI
- confidence code will work in production
- ensures code in a state that can be released at any time

ensures that each time we add code to the main branch, it's ready to be delivered

merges are ready to be deployed

UI tests 
build and production configs+settings

user acceptance tests - makes sure software does what its supposed to spec and reqs
- tests the integrated product application in its entirety

CD doesn't mean we necessarily deploy all our commits in real time
- instead it ensures that we can

ensures value is delivered at every incremental step

no big "launch"

schedule smaller scale deliveries that allows for earlier identification of issues and course corrections
- helps makes sure that we are adding value (and not going down the rabbit hole of work on a value-less task)

(manually trigger deployment)

## Continuous Deployment
end goal
automates continuous delivery to production

continuous integration  =>  continous delivery   =>   continous deployment
build > test > merge        auto=release to repo      auto deploy to production


**continous deployment is NOT for every product**
- requires addtl / non-automated testing
- documentation is required for every deployment 
- manual steps for associated hardware
- any other time its optimal to release less often

## CI-CD Pipelines
pipeline: set of steps needed for a ci-cd process
- processes are determined by the team per product



e.g. 

*SOURCE*  -->   *BUILD*        -->      *TEST*  -->     *DEPLOY*
git push        compile                 smoke           staging
                docker build            unit              |
                                        integration      QA
                                                          | 
                                                        production

> staging can sometimes involve  beta testing amongst long time users
> coninuouos deployment is a product level decision



## GitHub Actions
CI-CD from directly within the source repo 
**community powered workfows**

this integration allows devs to take advantage of:
- lives with code
- github community
- collaborative features of github: wikis, PR's, reviews
- reuse componenets of other pipelines 
        > (shared actions from other codebases... think npm pkgs) 
- run tests on any platform with any language

theory remains the same in Jenkins / Circle - code is a bit more involved

**.yml : forscripting workflows**



## Setting Up GitHub Actions
github provides starter workflows + action suggestions based on the repo contents
- auto configures yaml file for us

*skip to directly configuring yaml workflow manually is available*




## Continuous Integration: Building a Pipeline

- run build pipeline whenever new code is pushed
- linux OS is very common for servers

[] create a top level directory .github
[] cd .github ** mkdir workflows 
[] cd workflows && touch node.yml

EXAMPLE:

name: thoughtboard CI                 // [] name the flow 
on:                                   // [] list the triggers and branches to watch  
  push: 
    branches: [ master ]
  pull_request:
    branches: [ master ]
jobs:                                 // [] define jobs to run
  build:                              // [] name the job
    runs-on: [ ubuntu-latest ]        // [] define the pipeline operating system(s)
    steps:                            // [] define the pipeline workflow process
      - uses: actions/checkout@v2     // [] define any github action integrations (checkout fetches and checks out the repository)
      - name: Use Node.js version 16  // [] names a section of steps until next '-' 
            ( here we define the section of steps that sets up the proper node environment ) 
        uses: actions/setup-node@v2   // [] define any github action integrations
        with: 
          node-version: '16'          // [] define the version of node to use 
      - run: npm install              // [] define any commands to run in the OS terminal
      - run : npm run build --prefix client // [] define the front-end build 
> the above config:
-  runs a build job on pushes and PR's to the master branch
  - |->build job:
    - is performed on the latest ubuntu
    - uses the v2 checkout github action
    - sets the Node version to 16 and uses the setup-node v2 github action
    - runs npm install script command
  
## **Common Build Pipeline Errors**
> ERROR debugging

*Error: Process completed with exit code 137*
issue: build server out of memory on install
        > terminates the build process

fix: look for the following line in your server/package.json and client/package.json:

"<projectname>": "file:..",

If you see this line, remove it. It is sometimes unintentionally added by your development environment, and it creates a circular dependency. The install will take up more and more memory until the build fails!

With this line removed from all package.json files, you should no longer get this common error.

## GitHub Actions Marketplace
[] explore marketplace - get a feel for what's aavailable / possible

## Continuous Integration: Test Pipeline
- run: npm test

## Mocking Out Databases for the CI pipeline
- mongoDB in github actions to the rescue


## Populating Data For Continuous Integration
9min