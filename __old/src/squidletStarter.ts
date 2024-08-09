import {startSystem} from 'squidlet'
import type {System} from 'squidlet'
import {publisherAppPkg} from './PublisherSquidletApp.js'


startSystem((system: System) => {
  system.use(publisherAppPkg())
})
