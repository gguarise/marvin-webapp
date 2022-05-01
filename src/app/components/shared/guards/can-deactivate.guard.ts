import { Injectable } from '@angular/core';
import { CanDeactivate } from '@angular/router';
import { BaseTableComponent } from '../../base/base-table/base-table.component';
import { BaseComponent } from '../../base/base.component';

@Injectable()
export class BaseCanDeactivateGuard implements CanDeactivate<BaseComponent> {
  async canDeactivate(target: BaseComponent) {
    const discardChanges = await target
      .confirmRedirect()
      .then((discard) => discard);
    return discardChanges;
  }
}

@Injectable()
export class BaseTableCanDeactivateGuard
  implements CanDeactivate<BaseTableComponent>
{
  async canDeactivate(target: BaseTableComponent) {
    const discardChanges = await target
      .confirmRedirect()
      .then((discard) => discard);
    return discardChanges;
  }
}
