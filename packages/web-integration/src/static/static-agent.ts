import { Agent as PageAgent } from '@sqai/core/agent';
import type StaticPage from './static-page';

export class StaticPageAgent extends PageAgent {
  constructor(page: StaticPage) {
    super(page, {});
    this.dryMode = true;
  }
}
